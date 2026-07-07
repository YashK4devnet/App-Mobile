import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuditReports } from './hooks/useAuditReports';
import { useAssignedVenues } from './hooks/useAssignedVenues';
import FilterPills from './components/FilterPills';
import ReportCard from './components/ReportCard';
import VenueCard from './components/VenueCard';
import Header from '../../components/Header'; // Reusing your global header

const FILTERS = ["All", "Assigned", "Completed", "Waiting for Approval", "Approved", "Rejected"];

export default function AuditReportsPage({ hideHeader = false }) {
  const navigate = useNavigate();
  const { venueName: rawVenueName } = useParams();
  const venueName = rawVenueName ? decodeURIComponent(rawVenueName) : null;
  
  const { reports, isLoading: isReportsLoading, error: reportsError } = useAuditReports();
  const { venues, isLoading: isVenuesLoading, error: venuesError } = useAssignedVenues();
  
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredVenues = useMemo(() => {
    return venues.filter(venue => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return venue.name.toLowerCase().includes(query) || venue.location.toLowerCase().includes(query) || venue.id.toLowerCase().includes(query);
      }
      return true;
    });
  }, [venues, searchQuery]);

  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      // Filter by selected venue (from URL params)
      if (venueName && report.venueName !== venueName) return false;
      
      // Filter by Status
      if (activeFilter !== "All" && report.status !== activeFilter) return false;
      
      // Filter by Search Query (matching venueName or ID)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = report.venueName.toLowerCase().includes(query);
        const matchesId = report.id.toLowerCase().includes(query);
        if (!matchesName && !matchesId) return false;
      }

      return true;
    });
  }, [reports, activeFilter, searchQuery, venueName]);

  const handleBack = () => {
    if (venueName) {
      navigate(-1);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {!hideHeader && (
        <Header 
          title={venueName ? `Reports - ${venueName}` : "Select a Venue"} 
          showBack={true} 
          onBackClick={handleBack} 
        />
      )}

      {/* Sticky Search and Filter Controls */}
      <div className="sticky top-[-16px] -mt-4 z-20 bg-[#0F0F23]/95 backdrop-blur-md -mx-5 px-5 pt-4 pb-3 flex flex-col gap-3 border-b border-white/5">
        <div className="relative group">
          <input
            type="text"
            className="w-full bg-white/5 backdrop-blur-md border border-white/10 text-white text-[15px] rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-[#4ecdc4]/50 focus:ring-1 focus:ring-[#4ecdc4]/50 transition-all placeholder-white/30"
            placeholder={venueName ? "Search by venue or report ID..." : "Search venues by name or location..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
            <svg className="w-5 h-5 text-white group-focus-within:text-[#4ecdc4] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {venueName && (
          <FilterPills 
            filters={FILTERS} 
            activeFilter={activeFilter} 
            onSelectFilter={setActiveFilter} 
          />
        )}
      </div>

      {/* Content Area */}
      <div className="pb-6">
        {!venueName ? (
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
              <AnimatePresence mode="popLayout">
                {filteredVenues.map(venue => (
                  <VenueCard 
                    key={venue.id} 
                    venue={venue} 
                    onClick={() => {
                      setSearchQuery("");
                      navigate(`/audit/reports/${encodeURIComponent(venue.name)}`);
                    }}
                  />
                ))}
              </AnimatePresence>
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
              <h2 className="text-[17px] font-semibold text-white/90 px-1 pt-1">Reports for {venueName}</h2>
              <AnimatePresence mode="popLayout">
                {filteredReports.map(report => (
                  <ReportCard 
                    key={report.id} 
                    report={report} 
                    onClick={() => console.log('Navigate to report', report.id)}
                  />
                ))}
              </AnimatePresence>
            </div>
          )
        )}
      </div>
    </div>
  );
}
