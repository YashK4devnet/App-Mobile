package com.example.app;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.location.Location;
import android.util.Log;

import androidx.localbroadcastmanager.content.LocalBroadcastManager;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import org.json.JSONObject;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;

@CapacitorPlugin(name = "NativeTracking")
public class NativeTrackingPlugin extends Plugin {
    public static String apiKey = "";
    public static String employeeId = "";
    public static String endpointUrl = "";

    private long lastPostTime = 0;
    private static final long TRACKING_INTERVAL_MS = 5000;

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
        Log.d("NativeTracking", "Configured with endpoint: " + endpointUrl);
        call.resolve();
    }

    private void sendLocationToServer(Location location) {
        new Thread(() -> {
            try {
                URL url = new URL(endpointUrl);
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("POST");
                conn.setRequestProperty("Content-Type", "application/json");
                conn.setRequestProperty("api-key", apiKey);
                conn.setDoOutput(true);

                JSONObject json = new JSONObject();
                json.put("employee_id", Integer.parseInt(employeeId));
                json.put("latitude", String.valueOf(location.getLatitude()));
                json.put("longitude", String.valueOf(location.getLongitude()));
                
                // date format: yyyy-mm-dd
                SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd", Locale.US);
                dateFormat.setTimeZone(TimeZone.getDefault());
                json.put("date", dateFormat.format(new Date(location.getTime())));
                
                // time format: 24 hr
                SimpleDateFormat timeFormat = new SimpleDateFormat("HH:mm:ss", Locale.US);
                timeFormat.setTimeZone(TimeZone.getDefault());
                json.put("time", timeFormat.format(new Date(location.getTime())));

                try (OutputStream os = conn.getOutputStream()) {
                    byte[] input = json.toString().getBytes("utf-8");
                    os.write(input, 0, input.length);
                }

                int responseCode = conn.getResponseCode();
                Log.d("NativeTracking", "Location sent, response: " + responseCode);
                conn.disconnect();
            } catch (Exception e) {
                Log.e("NativeTracking", "Error sending location", e);
            }
        }).start();
    }
}
