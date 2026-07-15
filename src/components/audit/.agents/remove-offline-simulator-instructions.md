# Instructions to Cleanly Remove the Offline Simulator

When you are finished testing the offline capabilities and want to remove the simulated offline test functionality, follow these steps to cleanly remove it from the codebase.

## 1. Revert `reportApiService.js`
Open `src/components/audit/services/reportApiService.js`:
- Remove the import statement for `isAppOnline`:
  ```javascript
  import { isAppOnline } from '../utils/connection';
  ```
- Search for all occurrences of `isAppOnline()` and replace them back with `navigator.onLine`. 
  There should be 4 instances to replace.

## 2. Revert `SyncManager.jsx`
Open `src/components/audit/components/SyncManager.jsx`:
- Remove the import statement for `isAppOnline`.
- In the `processSyncQueue` function, change:
  ```javascript
  if (!isAppOnline()) return;
  ```
  back to:
  ```javascript
  if (!navigator.onLine) return;
  ```

## 3. Revert `httpClient.js`
Open `src/components/audit/services/httpClient.js`:
- Remove the import statement for `isAppOnline`.
- Inside `performSilentLogin`, remove the simulated failure check:
  ```javascript
  if (!isAppOnline()) {
    throw new TypeError('Failed to fetch (simulated offline)');
  }
  ```
- Inside `auditHttpClient`, remove the simulated failure check:
  ```javascript
  if (!isAppOnline()) {
    throw new TypeError('Failed to fetch (simulated offline)');
  }
  ```

## 4. Update `AuditSettingsPage.jsx`
Open `src/components/audit/pages/AuditSettings/AuditSettingsPage.jsx`:
- Remove the imports for `isAppOnline` and `toggleOfflineSimulation`.
- Remove the `isSimulatedOffline` state declaration.
- Remove the `handleToggleOffline` function.
- In the JSX, locate and delete the entire `<!-- Network Status Card -->` section which contains the "Network Status Simulator" and the toggle switch.

*(Note: You can choose to keep the "Offline Synchronization" counter and the "Developer / QA Tools" database wipe buttons if you find them useful for QA, or remove them as well if you want a clean settings page).*

## 5. Delete `connection.js`
Once the above references have been removed, you can safely delete the utility file:
- `src/components/audit/utils/connection.js`

## 6. Clear Local Storage (Optional)
To ensure no leftover simulator state remains in your browser, you can run the following in your browser's Developer Tools Console:
```javascript
localStorage.removeItem('audit_simulated_offline');
```
