import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WelcomeHeader from './components/WelcomeHeader';
import RecentReports from './components/RecentReports';
import ActiveDrafts from './components/ActiveDrafts';
import { getUserProfile, getRecentReports } from '../../services/dashboardService';
import { storageService } from '../../services/storageService';

export default function AuditDashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a brief, smooth API loading state
    const timer = setTimeout(() => {
      setUser(getUserProfile());
      setReports(getRecentReports());
      
      // Load active drafts from IndexedDB
      storageService.getAllDrafts().then(allDrafts => {
        const loadedDrafts = [];
        allDrafts.forEach(({ key, data }) => {
          if (key && key.startsWith('audit_draft_')) {
            try {
              const parts = key.split('_');
              const auditTypeId = data.auditTypeId || parts[parts.length - 1];
              const venueId = parts.slice(2, parts.length - 1).join('_') || 'new';
              loadedDrafts.push({
                key,
                venueId,
                auditTypeId,
                data
              });
            } catch (e) {
              console.error("Failed to parse draft from IndexedDB", e);
            }
          }
        });
        setDrafts(loadedDrafts);
        setLoading(false);
      }).catch(err => {
        console.error("Failed to load drafts from IndexedDB", err);
        setLoading(false);
      });
    }, 250);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 select-none">
        {/* Premium spinner matching the orange branding */}
        <div className="w-8 h-8 border-4 border-[#FFF4E8] border-t-[#F98A15] rounded-full animate-spin"></div>
        <p className="text-xs text-slate-400 font-bold tracking-tight animate-pulse">
          Loading dashboard...
        </p>
      </div>
    );
  }

  const handleStartAuditClick = () => {
    navigate('audit-setup');
  };

  const handleReportClick = (report) => {
    console.log(`Report clicked: ${report.title} (No: ${report.reportNo})`);
  };

  const handleViewAllClick = () => {
    console.log("View all reports clicked");
  };

  const handleResumeDraft = (draft) => {
    const venueData = draft.data.isNew ? {} : {
      id: draft.venueId,
      venueName: draft.data.venueName,
      city: draft.data.city,
      state: draft.data.state
    };
    navigate(draft.auditTypeId, { state: { venue: venueData, loadDraft: true } });
  };

  const handleDeleteDraft = (key) => {
    storageService.deleteDraft(key).then(() => {
      setDrafts(prev => prev.filter(d => d.key !== key));
    }).catch(err => {
      console.error("Failed to delete draft", err);
    });
  };

  return (
    <div className="transition-opacity duration-300 ease-out opacity-100">
      <WelcomeHeader user={user} />

      {/* Big prominent button to take the user to the venue selection */}
      <div className="mb-6 select-none">
        <button
          onClick={handleStartAuditClick}
          className="w-full h-28 relative overflow-hidden group flex items-center justify-between p-5 bg-gradient-to-br from-[#F98A15] to-[#E07A0F] rounded-2xl shadow-md hover:shadow-lg active:scale-[0.98] transition-all text-left cursor-pointer duration-200"
        >
          {/* Decorative background light pattern */}
          <div className="absolute right-0 top-0 -mt-6 -mr-6 w-32 h-32 bg-white/10 rounded-full blur-xl group-hover:scale-110 transition-transform duration-300 pointer-events-none"></div>

          <div className="flex items-center gap-4 relative z-10 pointer-events-none">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0 shadow-inner">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
            <div>
              <h3 className="text-[16px] font-black text-white leading-tight mb-0.5">
                Start New Assessment
              </h3>
              <p className="text-[11px] text-orange-100/90 font-bold">
                Select a venue to begin auditing
              </p>
            </div>
          </div>

          <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white shrink-0 group-hover:translate-x-1 transition-transform duration-200 pointer-events-none">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      </div>

      {drafts.length > 0 && (
        <ActiveDrafts
          drafts={drafts}
          onResume={handleResumeDraft}
          onDelete={handleDeleteDraft}
        />
      )}

      <RecentReports
        reports={reports}
        onViewAllClick={handleViewAllClick}
        onReportClick={handleReportClick}
      />
    </div>
  );
}
