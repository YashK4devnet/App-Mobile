import React, { useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import { storageService } from '../../services/storageService';
import { AuditContext } from '../../stores/AuditContext';

export default function AuditSettingsPage() {
  const [realOnlineStatus, setRealOnlineStatus] = useState(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });

  const [pendingTasks, setPendingTasks] = useState([]);
  const [expandedReports, setExpandedReports] = useState({});
  const [isClearing, setIsClearing] = useState(false);

  const pendingTasksCount = pendingTasks.length;

  const auditContext = useContext(AuditContext);

  useEffect(() => {
    if (auditContext?.refreshData) {
      auditContext.refreshData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const refreshSyncTasks = async () => {
    try {
      const tasks = await storageService.getSyncTasks();
      setPendingTasks(tasks || []);
    } catch (e) {
      console.error('Failed to get sync queue', e);
    }
  };

  useEffect(() => {
    refreshSyncTasks();
    const interval = setInterval(refreshSyncTasks, 3000);
    return () => clearInterval(interval);
  }, []);

  const groupedTasks = pendingTasks.reduce((acc, task) => {
    if (!acc[task.reportId]) acc[task.reportId] = [];
    acc[task.reportId].push(task);
    return acc;
  }, {});

  const toggleReportExpand = (reportId) => {
    setExpandedReports(prev => ({
      ...prev,
      [reportId]: !prev[reportId]
    }));
  };

  const getReportName = (reportId) => {
    const report = auditContext?.reports?.find(r => r.id?.toString() === reportId?.toString());
    if (report) {
      const venueName = typeof report.venue === 'object' ? report.venue.name : (Array.isArray(report.venue) ? report.venue[1] : `Venue ${report.venue}`);
      return `Venue Audit: ${venueName} (ID: ${reportId})`;
    }
    return `Audit Report ID: ${reportId}`;
  };

  const getTaskDescription = (task) => {
    if (task.type === 'section') return 'Updated Report Section';
    if (task.type === 'lines') return `Updated ${task.lineField ? task.lineField.replace(/_/g, ' ') : 'Lines'}`;
    return 'Updated Data';
  };

  const handleForceSync = () => {
    if (!navigator.onLine) {
      toast.error("You are currently offline. Connect to the internet first.");
      return;
    }
    toast("Manual sync triggered...", { icon: "🔄" });
    window.dispatchEvent(new Event('force-sync'));
    setTimeout(refreshSyncTasks, 2000);
  };

  const handleClearCache = async () => {
    if (window.confirm('Are you sure you want to clear all local drafts, offline cached reports, and sync tasks? This action is irreversible.')) {
      setIsClearing(true);
      try {
        await storageService.clearAllData();
        if (typeof localStorage !== 'undefined') {
          Object.keys(localStorage).forEach((key) => {
            if (key.startsWith('audit_reports_cache_')) {
              localStorage.removeItem(key);
            }
          });
        }
        await refreshSyncTasks();
        toast.success('Successfully cleared all local cached databases.', {
          style: {
            borderRadius: '12px',
            background: '#0f172a',
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
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#0f172a] tracking-tight mb-1">
          Settings
        </h1>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${realOnlineStatus ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 border-rose-500/20'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${realOnlineStatus ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
          {realOnlineStatus ? 'Online' : 'Offline'}
        </div>
      </div>

      <div className="space-y-5">
        {/* Sync Status Card */}
        <div className="p-5 bg-white border border-[#ff7700]/20 rounded-3xl flex flex-col gap-4 shadow-xs">
          <h3 className="text-[15px] font-bold text-[#0f172a]">
            Offline Synchronization
          </h3>

          <div className="flex items-center justify-between p-4 bg-[#f8fafc] border border-slate-200 rounded-2xl">
            <div className="flex-1 pr-4">
              <h4 className="text-[14px] font-semibold text-[#0f172a]">
                Pending Sync Actions
              </h4>
              <p className="text-[12px] text-slate-500 mt-0.5">
                {pendingTasksCount === 0 
                  ? "No actions saved locally." 
                  : "Actions saved locally that will auto-upload when reconnected."}
              </p>
            </div>
            <div className="w-10 h-10 shrink-0 rounded-full bg-[#ff7700]/10 border border-[#ff7700]/20 flex items-center justify-center font-bold text-[15px] text-[#ff7700]">
              {pendingTasksCount}
            </div>
          </div>

          {pendingTasksCount > 0 && (
            <div className="flex flex-col gap-3 mt-1">
              {Object.entries(groupedTasks).map(([reportId, tasks]) => (
                <div key={reportId} className="bg-[#f8fafc] border border-slate-200 rounded-2xl overflow-hidden transition-all">
                  <div 
                    onClick={() => toggleReportExpand(reportId)}
                    className="p-4 flex items-center justify-between cursor-pointer active:bg-slate-100"
                  >
                    <div className="flex-1 pr-2">
                      <h4 className="text-[14px] font-semibold text-[#0f172a] truncate">{getReportName(reportId)}</h4>
                      <p className="text-[12px] text-slate-500 mt-1">{tasks.length} pending action{tasks.length > 1 ? 's' : ''}</p>
                    </div>
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-600 shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className={`w-4 h-4 transition-transform ${expandedReports[reportId] ? 'rotate-180' : ''}`}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </div>
                  </div>
                  {expandedReports[reportId] && (
                    <div className="px-4 pb-4 pt-1 bg-white border-t border-slate-200">
                      <div className="space-y-3 mt-2">
                        {tasks.map(task => (
                          <div key={task.id} className="flex items-start gap-3">
                            <div className="w-6 h-6 shrink-0 rounded-full bg-[#ff7700]/10 flex items-center justify-center mt-0.5">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-3 h-3 text-[#ff7700]">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-[13px] text-[#0f172a] font-medium leading-tight capitalize">{getTaskDescription(task)}</p>
                              <p className="text-[11px] text-slate-400 mt-1">
                                {new Date(task.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3 mt-2">
            <button
              onClick={handleForceSync}
              className="flex-1 py-3 px-4 bg-[#ff7700] hover:bg-[#ea580c] text-white rounded-2xl text-xs font-bold active:scale-95 transition-all shadow-xs cursor-pointer"
            >
              Sync Now
            </button>
            <button
              onClick={handleClearCache}
              disabled={isClearing}
              className="py-3 px-4 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-600 rounded-2xl text-xs font-bold active:scale-95 transition-all cursor-pointer"
            >
              {isClearing ? 'Clearing...' : 'Clear Cache'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
