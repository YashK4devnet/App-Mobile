import React, { useEffect, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import { storageService } from '../services/storageService';
import { reportApiService } from '../services/reportApiService';
import { isAppOnline } from '../utils/connection';

export default function SyncManager() {
  const isSyncing = useRef(false);

  const processSyncQueue = useCallback(async () => {
    if (!isAppOnline() || isSyncing.current) return;

    try {
      isSyncing.current = true;
      const tasks = await storageService.getSyncTasks();
      if (!tasks || tasks.length === 0) {
        isSyncing.current = false;
        return;
      }

      let successCount = 0;
      let failCount = 0;

      for (const task of tasks) {
        try {
          if (task.type === 'lines') {
            await reportApiService.patchAuditLines(task.reportId, task.lineField, task.payload.lines);
          } else if (task.type === 'section') {
            await reportApiService.patchAuditSection(task.reportId, task.payload);
          }
          await storageService.removeSyncTask(task.id);
          successCount++;
        } catch (error) {
          if (!error.isOffline) {
            failCount++;
            console.error(`Sync failed for task ${task.id}`, error);
          }
        }
      }

      if (successCount > 0) {
        toast.success(`Successfully synced ${successCount} pending updates!`, {
          icon: '✅',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
      }
      if (failCount > 0) {
        toast.error(`Failed to sync ${failCount} updates. Will retry later.`, {
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
      }
    } catch (err) {
      console.error("Error processing sync queue:", err);
    } finally {
      isSyncing.current = false;
    }
  }, []);

  useEffect(() => {
    // Process queue when component mounts (e.g. app startup)
    processSyncQueue();

    // Process queue when connection is restored
    window.addEventListener('online', processSyncQueue);

    // Periodically retry sync every 60 seconds to catch cases where 
    // network is connected but server was temporarily down
    const intervalId = setInterval(processSyncQueue, 60000);

    return () => {
      window.removeEventListener('online', processSyncQueue);
      clearInterval(intervalId);
    };
  }, [processSyncQueue]);

  return null; // Headless component
}
