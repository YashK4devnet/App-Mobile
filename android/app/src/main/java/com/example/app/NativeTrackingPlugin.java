package com.example.app;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.SharedPreferences;
import android.location.Location;
import android.util.Log;

import androidx.localbroadcastmanager.content.LocalBroadcastManager;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;

import android.os.PowerManager;
import android.provider.Settings;
import android.net.Uri;
import com.getcapacitor.JSObject;

@CapacitorPlugin(name = "NativeTracking")
public class NativeTrackingPlugin extends Plugin {
    public static String apiKey = "";
    public static String employeeId = "";
    public static String endpointUrl = "";

    private static long lastPostTime = 0;
    private static long TRACKING_INTERVAL_MS = 5000;

    private static final String PREFS_NAME = "NativeTrackingPrefs";
    private static final String KEY_OFFLINE_QUEUE = "offline_location_queue";
    private static final int MAX_QUEUE_SIZE = 200;

    private BroadcastReceiver locationReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            long now = System.currentTimeMillis();
            if (now - lastPostTime < TRACKING_INTERVAL_MS) {
                return;
            }
            lastPostTime = now;

            Location location = intent.getParcelableExtra("location");
            if (location != null && !apiKey.isEmpty() && !endpointUrl.isEmpty()) {
                sendLocationToServer(location);
            }
        }
    };

    @Override
    public void load() {
        try {
            LocalBroadcastManager.getInstance(getContext()).unregisterReceiver(locationReceiver);
        } catch (Exception e) {}
        LocalBroadcastManager.getInstance(getContext()).registerReceiver(
                locationReceiver,
                new IntentFilter("com.equimaps.capacitor_background_geolocation.broadcast")
        );
    }

    @PluginMethod
    public void setConfig(PluginCall call) {
        apiKey = call.getString("apiKey", "");
        employeeId = String.valueOf(call.getInt("employeeId", call.getString("employeeId") != null ? Integer.parseInt(call.getString("employeeId")) : 0));
        endpointUrl = call.getString("endpointUrl", "");
        
        // Dynamically accept interval from frontend, default to 5000ms
        int dynamicInterval = call.getInt("interval", 5000);
        TRACKING_INTERVAL_MS = dynamicInterval;
        
        // Reset lastPostTime so newly configured tracking sends an immediate location update
        lastPostTime = 0;
        
        Log.d("NativeTracking", "Configured! Endpoint: " + endpointUrl + " | Interval: " + TRACKING_INTERVAL_MS + "ms | Employee: " + employeeId);
        call.resolve();
    }

    @PluginMethod
    public void stopTracking(PluginCall call) {
        apiKey = "";
        employeeId = "";
        Log.d("NativeTracking", "Native tracking config cleared on checkout!");
        call.resolve();
    }

    @PluginMethod
    public void flushQueue(PluginCall call) {
        final Context context = getContext();
        String tempApiKey = call.getString("apiKey", apiKey);
        String tempEmployeeId = String.valueOf(call.getInt("employeeId", call.getString("employeeId") != null ? Integer.parseInt(call.getString("employeeId")) : (employeeId.isEmpty() ? 0 : Integer.parseInt(employeeId))));
        String tempEndpointUrl = call.getString("endpointUrl", endpointUrl);

        if (!tempApiKey.isEmpty()) apiKey = tempApiKey;
        if (!tempEmployeeId.isEmpty() && !tempEmployeeId.equals("0")) employeeId = tempEmployeeId;
        if (!tempEndpointUrl.isEmpty()) endpointUrl = tempEndpointUrl;

        new Thread(() -> {
            try {
                flushOfflineQueue(context);
                JSObject ret = new JSObject();
                ret.put("success", true);
                call.resolve(ret);
            } catch (Exception e) {
                Log.e("NativeTracking", "Manual flush failed", e);
                call.reject("Manual flush failed: " + e.getMessage());
            }
        }).start();
    }

    @PluginMethod
    public void requestIgnoreBatteryOptimizations(PluginCall call) {
        try {
            Context context = getContext();
            PowerManager pm = (PowerManager) context.getSystemService(Context.POWER_SERVICE);
            String packageName = context.getPackageName();
            boolean isIgnoring = false;
            
            if (pm != null) {
                isIgnoring = pm.isIgnoringBatteryOptimizations(packageName);
                if (!isIgnoring) {
                    Intent intent = new Intent();
                    intent.setAction(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS);
                    intent.setData(Uri.parse("package:" + packageName));
                    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    context.startActivity(intent);
                }
            }
            
            JSObject ret = new JSObject();
            ret.put("isIgnoring", isIgnoring);
            call.resolve(ret);
        } catch (Exception e) {
            Log.e("NativeTracking", "Failed to request battery optimization exemption", e);
            call.reject("Failed to request battery optimization exemption: " + e.getMessage());
        }
    }

    private void sendLocationToServer(Location location) {
        final Context context = getContext();
        new Thread(() -> {
            try {
                JSONObject json = new JSONObject();
                json.put("employee_id", Integer.parseInt(employeeId));
                
                // Keep as Double (Numbers) instead of Strings, as required by backend schema
                json.put("latitude", location.getLatitude());
                json.put("longitude", location.getLongitude());
                
                // date format: yyyy-MM-dd
                SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd", Locale.US);
                dateFormat.setTimeZone(TimeZone.getDefault());
                json.put("date", dateFormat.format(new Date(location.getTime())));
                
                // time format: 24 hr
                SimpleDateFormat timeFormat = new SimpleDateFormat("HH:mm:ss", Locale.US);
                timeFormat.setTimeZone(TimeZone.getDefault());
                json.put("time", timeFormat.format(new Date(location.getTime())));

                Log.d("NativeTracking", "Sending POST to: " + endpointUrl);

                int statusCode = sendSingleJsonPayload(json);
                if (statusCode >= 200 && statusCode < 300) {
                    Log.d("NativeTracking", "✅ Current location posted successfully!");
                    // Connection is active -> Sync any offline records that were queued earlier
                    flushOfflineQueue(context);
                } else if (statusCode == 401 || statusCode == 403) {
                    Log.e("NativeTracking", "⛔ Session expired / Unauthorized (HTTP " + statusCode + "). Skipping queue enqueueing until re-authenticated.");
                } else {
                    Log.w("NativeTracking", "⚠️ POST failed or offline (HTTP " + statusCode + "). Saving location payload to offline queue...");
                    enqueueOfflineLocation(context, json);
                }
            } catch (Exception e) {
                Log.e("NativeTracking", "Error processing location update", e);
            }
        }).start();
    }

    private int sendSingleJsonPayload(JSONObject json) {
        HttpURLConnection conn = null;
        try {
            URL url = new URL(endpointUrl);
            conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setRequestProperty("api-key", apiKey);
            conn.setConnectTimeout(12000); // 12 seconds connection timeout
            conn.setReadTimeout(12000);    // 12 seconds read timeout
            conn.setDoOutput(true);

            try (OutputStream os = conn.getOutputStream()) {
                byte[] input = json.toString().getBytes("utf-8");
                os.write(input, 0, input.length);
            }

            int responseCode = conn.getResponseCode();
            Log.d("NativeTracking", "POST Response Code: " + responseCode + " for payload: " + json.toString());
            return responseCode;
        } catch (Exception e) {
            Log.e("NativeTracking", "HTTP POST failed: " + e.getMessage());
            return 0; // Return 0 to signify network error / offline
        } finally {
            if (conn != null) {
                conn.disconnect();
            }
        }
    }

    private synchronized void enqueueOfflineLocation(Context context, JSONObject json) {
        if (context == null) return;
        try {
            SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
            String queueStr = prefs.getString(KEY_OFFLINE_QUEUE, "[]");
            JSONArray queue = new JSONArray(queueStr);

            // Cap queue size to prevent memory bloat
            while (queue.length() >= MAX_QUEUE_SIZE) {
                queue.remove(0); // Drop oldest entry
            }

            queue.put(json);
            prefs.edit().putString(KEY_OFFLINE_QUEUE, queue.toString()).apply();
            Log.d("NativeTracking", "💾 Saved offline location record. Total queued items: " + queue.length());
        } catch (Exception e) {
            Log.e("NativeTracking", "Error writing to offline location queue", e);
        }
    }

    private synchronized void flushOfflineQueue(Context context) {
        if (context == null || apiKey.isEmpty() || endpointUrl.isEmpty()) return;
        try {
            SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
            String queueStr = prefs.getString(KEY_OFFLINE_QUEUE, "[]");
            JSONArray queue = new JSONArray(queueStr);

            if (queue.length() == 0) return;

            Log.d("NativeTracking", "🔄 Found " + queue.length() + " offline location records to sync. Processing...");
            JSONArray remainingQueue = new JSONArray();

            for (int i = 0; i < queue.length(); i++) {
                JSONObject jsonItem = queue.getJSONObject(i);
                int statusCode = sendSingleJsonPayload(jsonItem);
                if (statusCode < 200 || statusCode >= 300) {
                    // Stop trying if network drops or auth fails midway, and retain remaining unsent items in queue
                    for (int j = i; j < queue.length(); j++) {
                        remainingQueue.put(queue.getJSONObject(j));
                    }
                    if (statusCode == 401 || statusCode == 403) {
                        Log.e("NativeTracking", "⛔ Session expired during offline queue sync (HTTP " + statusCode + "). Saved remaining " + remainingQueue.length() + " items until user re-authenticates.");
                    } else {
                        Log.w("NativeTracking", "⚠️ Connection lost while syncing offline queue (HTTP " + statusCode + "). Saved remaining " + remainingQueue.length() + " items.");
                    }
                    break;
                }
            }

            prefs.edit().putString(KEY_OFFLINE_QUEUE, remainingQueue.toString()).apply();
            if (remainingQueue.length() == 0) {
                Log.d("NativeTracking", "🎉 All offline location records successfully synced with backend!");
            }
        } catch (Exception e) {
            Log.e("NativeTracking", "Error flushing offline location queue", e);
        }
    }
}
