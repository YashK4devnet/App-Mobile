import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuditReports } from './hooks/useAuditReports';
import { useAssignedVenues } from './hooks/useAssignedVenues';
import FilterPills from './components/FilterPills';
import ReportCard from './components/ReportCard';
import VenueCard from './components/VenueCard';
import Header from '../../components/Header'; // Reusing your global header
import PullToRefresh from '../../components/PullToRefresh';
import { useDebounce } from '../../hooks/useDebounce';
import { Virtuoso } from 'react-virtuoso';
import { reportApiService } from '../../services/reportApiService';

const FILTERS = ["All", "Assigned", "Completed", "Waiting for Approval", "Approved", "Rejected"];

export default function AuditReportsPage({ hideHeader = false }) {
  const navigate = useNavigate();
  const { venueId } = useParams();
  
  const { venues, isLoading: isVenuesLoading, error: venuesError, connectionError: venuesConnectionError, refreshVenues } = useAssignedVenues();
  const selectedVenue = venues.find(v => v.id === venueId);
  const venueName = selectedVenue ? selectedVenue.name : null;
  
  const { reports, isLoading: isReportsLoading, error: reportsError, refreshReports } = useAuditReports(venueId);
  
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  
  const [fetchingReportId, setFetchingReportId] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  const containerRef = useRef(null);
  const [scrollParent, setScrollParent] = useState(null);

  useEffect(() => {
    // Find the closest scrollable ancestor to act as the virtuoso scroll parent
    if (containerRef.current) {
      let parent = containerRef.current.parentElement;
      while (parent) {
        const style = window.getComputedStyle(parent);
        if (style.overflowY === 'auto' || style.overflowY === 'scroll') {
          setScrollParent(parent);
          break;
        }
        parent = parent.parentElement;
      }
    }
  }, [venueId]);

  const filteredVenues = useMemo(() => {
    return venues.filter(venue => {
      if (debouncedSearchQuery) {
        const query = debouncedSearchQuery.toLowerCase();
        return venue.name.toLowerCase().includes(query) || venue.location.toLowerCase().includes(query) || venue.id.toLowerCase().includes(query);
      }
      return true;
    });
  }, [venues, debouncedSearchQuery]);

  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      
      // Filter by Status
      if (activeFilter !== "All" && report.status !== activeFilter) return false;
      
      // Filter by Search Query (matching venueName or ID)
      if (debouncedSearchQuery) {
        const query = debouncedSearchQuery.toLowerCase();
        const matchesName = report.venueName.toLowerCase().includes(query);
        const matchesId = report.id.toLowerCase().includes(query);
        if (!matchesName && !matchesId) return false;
      }

      return true;
    });
  }, [reports, activeFilter, debouncedSearchQuery]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleRefresh = async () => {
    if (venueId) {
      await refreshReports();
    } else {
      await refreshVenues();
    }
  };

  const handleReportClick = async (report) => {
    try {
      setFetchingReportId(report.id);
      setFetchError(null);
      
      const reportData = await reportApiService.fetchReport(report.id);
      
      let path = '';
      if (reportData.reportType === 'network_audit') path = `/audit/network-audit/${report.id}`;
      else if (reportData.reportType === 'power_audit') path = `/audit/power-audit/${report.id}`;
      else if (reportData.reportType === 'venue_audit') path = `/audit/venue-audit/${report.id}`;
      else {
        // Fallback mapping just in case the API type differs from our expected standard
        if (report.reportType === 'network') path = `/audit/network-audit/${report.id}`;
        else if (report.reportType === 'power') path = `/audit/power-audit/${report.id}`;
        else if (report.reportType === 'venue') path = `/audit/venue-audit/${report.id}`;
        else path = `/audit/${report.reportType || 'network'}-audit/${report.id}`; 
      }
      
      navigate(path, { state: { odooData: reportData } });
      
    } catch (err) {
      console.error(err);
      setFetchError(`Failed to load report ${report.id}. Are you offline with no cache?`);
    } finally {
      setFetchingReportId(null);
    }
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="flex flex-col gap-4 min-h-screen" ref={containerRef}>
      {venuesConnectionError && !fetchError && (
        <div className="flex items-center gap-2.5 px-4 py-3 bg-rose-500/10 border border-rose-500/25 text-rose-200 text-[13px] rounded-2xl shadow-lg backdrop-blur-md animate-fadeIn">
          <svg className="w-4 h-4 text-rose-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div className="flex-1">
            <span className="font-semibold">Offline Mode.</span> Showing cached venues and reports. Pull down to retry connection.
          </div>
        </div>
      )}
      
      {fetchError && (
        <div className="flex items-center gap-2.5 px-4 py-3 bg-rose-500/10 border border-rose-500/25 text-rose-200 text-[13px] rounded-2xl shadow-lg backdrop-blur-md animate-fadeIn">
          <svg className="w-4 h-4 text-rose-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div className="flex-1">
            {fetchError}
          </div>
          <button onClick={() => setFetchError(null)} className="p-1 hover:bg-white/10 rounded-full transition-colors">
            <svg className="w-4 h-4 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}
      {!hideHeader && (
        <Header 
          title={venueName ? `Reports - ${venueName}` : "Select a Venue"} 
          showBack={true} 
          onBackClick={handleBack} 
        />
      )}

      {/* Sticky Search and Filter Controls */}
      <div className="sticky top-[-16px] -mt-4 z-20 bg-transparent -mx-5 px-5 pt-4 pb-3 flex flex-col gap-3">
        <div className="relative group">
          <input
            type="text"
            className="w-full bg-white/5 backdrop-blur-md border border-white/10 text-white text-[15px] rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-[#4ecdc4]/50 focus:ring-1 focus:ring-[#4ecdc4]/50 transition-all placeholder-white/30"
            placeholder={venueId ? "Search by venue or report ID..." : "Search venues by name or location..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
            <svg className="w-5 h-5 text-white group-focus-within:text-[#4ecdc4] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {venueId && (
          <FilterPills 
            filters={FILTERS} 
            activeFilter={activeFilter} 
            onSelectFilter={setActiveFilter} 
          />
        )}
      </div>

      {/* Content Area */}
      <div className="pb-6">
        {!venueId ? (
          // Venues View
          isVenuesLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-full h-32 bg-white/5 animate-pulse rounded-2xl border border-white/5" />
              ))}
            </div>
          ) : venuesError ? (
            <div className="flex flex-col items-center justify-center h-48 text-center px-4">
              <div className="w-12 h-12 rounded-full bg-rose-500/20 flex items-center justify-center mb-3 text-rose-400">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-white/80 font-medium">{venuesError}</p>
            </div>
          ) : filteredVenues.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-48 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-white/30">
                 <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-white/90 font-medium mb-1">No venues found</h3>
              <p className="text-[13px] text-white/50">Try adjusting your search query.</p>
            </motion.div>
          ) : (
            <div className="flex flex-col gap-4">
              <h2 className="text-[17px] font-semibold text-white/90 px-1 pt-1">Assigned Venues</h2>
              {scrollParent ? (
                <Virtuoso
                  customScrollParent={scrollParent}
                  data={filteredVenues}
                  itemContent={(index, venue) => (
                    <div className="pb-4">
                      <VenueCard 
                        venue={venue} 
                        onClick={() => {
                          setSearchQuery("");
                          navigate(`/audit/reports/${encodeURIComponent(venue.id)}`);
                        }}
                      />
                    </div>
                  )}
                />
              ) : null}
            </div>
          )
        ) : (
          // Reports View
          isReportsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-full h-32 bg-white/5 animate-pulse rounded-2xl border border-white/5" />
              ))}
            </div>
          ) : reportsError ? (
            <div className="flex flex-col items-center justify-center h-48 text-center px-4">
              <div className="w-12 h-12 rounded-full bg-rose-500/20 flex items-center justify-center mb-3 text-rose-400">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-white/80 font-medium">{reportsError}</p>
            </div>
          ) : filteredReports.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-48 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-white/30">
                 <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-white/90 font-medium mb-1">No reports found</h3>
              <p className="text-[13px] text-white/50">Try adjusting your filters or search query.</p>
            </motion.div>
          ) : (
            <div className="flex flex-col gap-4">
              <h2 className="text-[17px] font-semibold text-white/90 px-1 pt-1">
                {venueName ? `Reports for ${venueName}` : 'Reports'}
              </h2>
              {scrollParent ? (
                <Virtuoso
                  customScrollParent={scrollParent}
                  data={filteredReports}
                  itemContent={(index, report) => (
                    <div className="pb-4 relative">
                      <ReportCard 
                        report={report} 
                        onClick={() => handleReportClick(report)}
                      />
                      {fetchingReportId === report.id && (
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] rounded-[24px] flex items-center justify-center z-10 mx-5 mb-4 border border-white/5">
                           <div className="flex flex-col items-center gap-2">
                             <div className="w-6 h-6 border-2 border-[#4ecdc4]/30 border-t-[#4ecdc4] rounded-full animate-spin"></div>
                             <span className="text-[12px] font-medium text-[#4ecdc4]">Loading Data...</span>
                           </div>
                        </div>
                      )}
                    </div>
                  )}
                />
              ) : null}
            </div>
          )
        )}
      </div>
    </div>
    </PullToRefresh>
  );
}

