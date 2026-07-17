import React, { useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import { storageService } from '../../services/storageService';
import { AuditContext } from '../../stores/AuditContext';

export default function AuditSettingsPage() {
  const [realOnlineStatus, setRealOnlineStatus] = useState(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });

  const [pendingTasksCount, setPendingTasksCount] = useState(0);
  const [isClearing, setIsClearing] = useState(false);

  const auditContext = useContext(AuditContext);

  useEffect(() => {
    if (auditContext?.refreshData) {
      auditContext.refreshData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync real-time browser network status
  useEffect(() => {
    const handleOnline = () => setRealOnlineStatus(true);
    const handleOffline = () => setRealOnlineStatus(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Fetch count of pending sync tasks
  const refreshSyncCount = async () => {
    try {
      const tasks = await storageService.getSyncTasks();
      setPendingTasksCount(tasks ? tasks.length : 0);
    } catch (e) {
      console.error('Failed to get sync queue count', e);
    }
  };

  useEffect(() => {
    refreshSyncCount();
    // Poll every 3 seconds while on settings page to keep sync queue visual fresh
    const interval = setInterval(refreshSyncCount, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleForceSync = () => {
    if (!navigator.onLine) {
      toast.error("You are currently offline. Connect to the internet first.");
      return;
    }
    toast("Manual sync triggered...", { icon: "🔄" });
    window.dispatchEvent(new Event('force-sync'));
    setTimeout(refreshSyncCount, 2000);
  };

  // Clear local DB cache
  const handleClearCache = async () => {
    if (window.confirm('Are you sure you want to clear all local drafts, offline cached reports, and sync tasks? This action is irreversible.')) {
      setIsClearing(true);
      try {
        await storageService.clearAllData();
        // Clear API keys and other related localStorage keys
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem('audit_api_key');
        }
        await refreshSyncCount();
        toast.success('Successfully cleared all local cached databases.', {
          style: {
            borderRadius: '12px',
            background: '#333',
            color: '#fff',
          },
        });
      } catch (e) {
        console.error(e);
        toast.error('Failed to clear local cache data.');
      } finally {
        setIsClearing(false);
      }
    }
  };

  return (
    <div className="transition-opacity duration-300 ease-out opacity-100 flex flex-col h-full overflow-y-auto pb-6 scrollbar-none px-4 pt-4 select-none">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white tracking-tight mb-1">
          Settings
        </h1>
      </div>

      <div className="space-y-5">

        {/* Sync Status Card */}
        <div className="p-5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl flex flex-col gap-4 shadow-xl">
          <h3 className="text-[15px] font-bold text-white/95">
            Offline Synchronization
          </h3>

          <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl">
            <div className="flex-1 pr-4">
              <h4 className="text-[14px] font-semibold text-white">
                Pending Sync Actions
              </h4>
              <p className="text-[12px] text-white/55 mt-0.5">
                Actions saved locally that will auto-upload when reconnected.
              </p>
            </div>
            <div className="w-10 h-10 shrink-0 rounded-full bg-white/5 border border-white/5 flex items-center justify-center font-bold text-[15px] text-white">
              {pendingTasksCount}
            </div>
          </div>

          <button
            onClick={handleForceSync}
            disabled={pendingTasksCount === 0}
            className={`w-full py-3.5 bg-[#4ecdc4]/20 hover:bg-[#4ecdc4]/30 text-[#4ecdc4] border border-[#4ecdc4]/30 rounded-2xl text-[13px] font-bold tracking-wide transition-all flex items-center justify-center gap-2 ${pendingTasksCount === 0 ? 'opacity-50 cursor-not-allowed' : 'active:scale-[0.98]'
              }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Sync Now
          </button>
        </div>

        {/* Storage Management */}
        <div className="p-5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl flex flex-col gap-4 shadow-xl">
          <h3 className="text-[15px] font-bold text-white/95">
            Storage & Cache Management
          </h3>

          <div className="space-y-3">
            <button
              onClick={handleClearCache}
              disabled={isClearing}
              className={`w-full py-3.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/25 rounded-2xl text-[13px] font-bold tracking-wide active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${isClearing ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
              {isClearing ? 'Clearing Storage...' : 'Wipe Local Database Cache'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
