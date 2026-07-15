import React, { useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { storageService } from '../services/storageService';
import { reportApiService } from '../services/reportApiService';

export default function SyncManager() {
  const processSyncQueue = useCallback(async () => {
    if (!navigator.onLine) return;

    try {
      const tasks = await storageService.getSyncTasks();
      if (!tasks || tasks.length === 0) return;

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
    }
  }, []);

  useEffect(() => {
    // Process queue when component mounts (e.g. app startup)
    processSyncQueue();

    // Process queue when connection is restored
    window.addEventListener('online', processSyncQueue);

    return () => {
      window.removeEventListener('online', processSyncQueue);
    };
  }, [processSyncQueue]);

  return null; // Headless component
}
