import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { isAppOnline, toggleOfflineSimulation } from '../../utils/connection';
import { storageService } from '../../services/storageService';

export default function AuditSettingsPage() {
  const [isSimulatedOffline, setIsSimulatedOffline] = useState(() => {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('audit_simulated_offline') === 'true';
    }
    return false;
  });

  const [realOnlineStatus, setRealOnlineStatus] = useState(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });

  const [pendingTasksCount, setPendingTasksCount] = useState(0);
  const [isClearing, setIsClearing] = useState(false);

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

  // Handle toggling simulated offline mode
  const handleToggleOffline = (e) => {
    const checked = e.target.checked;
    setIsSimulatedOffline(checked);
    toggleOfflineSimulation(checked);

    if (checked) {
      toast('Simulated Offline Mode Enabled. All APIs will now fail.', {
        icon: '🔌',
        style: {
          borderRadius: '12px',
          background: '#333',
          color: '#fff',
        },
      });
    } else {
      toast.success('Online Connection Restored. Processing sync queue...', {
        style: {
          borderRadius: '12px',
          background: '#333',
          color: '#fff',
        },
      });
    }
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
        <p className="text-sm text-white/60 font-medium">
          Configure offline testing and data caching options.
        </p>
      </div>

      <div className="space-y-5">
        {/* Network Status Card */}
        <div className="p-5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl flex flex-col gap-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-[15px] font-bold text-white/95">
              Network Status Simulator
            </h3>
            <span className={`flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold rounded-full uppercase tracking-wider ${
              realOnlineStatus && !isSimulatedOffline 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                realOnlineStatus && !isSimulatedOffline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400 animate-pulse'
              }`} />
              {realOnlineStatus && !isSimulatedOffline ? 'Online' : isSimulatedOffline ? 'Simulated Offline' : 'No Connection'}
            </span>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl">
            <div className="flex-1 pr-4">
              <h4 className="text-[14px] font-semibold text-white">
                Simulate Offline Mode
              </h4>
              <p className="text-[12px] text-white/55 mt-0.5 leading-normal">
                Force the app to behave as if it is offline without turning off your computer's internet.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer select-none shrink-0">
              <input 
                type="checkbox" 
                checked={isSimulatedOffline} 
                onChange={handleToggleOffline} 
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-white/15 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4ecdc4]"></div>
            </label>
          </div>
        </div>

        {/* Sync Status Card */}
        <div className="p-5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl flex flex-col gap-4 shadow-xl">
          <h3 className="text-[15px] font-bold text-white/95">
            Offline Synchronization
          </h3>

          <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl">
            <div>
              <h4 className="text-[14px] font-semibold text-white">
                Pending Sync Actions
              </h4>
              <p className="text-[12px] text-white/55 mt-0.5">
                Actions saved locally that will auto-upload when reconnected.
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center font-bold text-[15px] text-white">
              {pendingTasksCount}
            </div>
          </div>
        </div>

        {/* Developer Maintenance Tools */}
        <div className="p-5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl flex flex-col gap-4 shadow-xl">
          <h3 className="text-[15px] font-bold text-white/95">
            Developer / QA Tools
          </h3>

          <div className="space-y-3">
            <button
              onClick={handleClearCache}
              disabled={isClearing}
              className={`w-full py-3.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/25 rounded-2xl text-[13px] font-bold tracking-wide active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${
                isClearing ? 'opacity-50 cursor-not-allowed' : ''
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
