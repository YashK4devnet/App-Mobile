import React, { useState, useEffect } from 'react';
import { BuildingIcon, ChevronRightIcon } from './Icons';
import { fetchSavedVenues, createFullAuditRecord } from '../services/venueService';

export default function VenueSelectPage({ onSelectVenue, onNewVenue }) {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const loadVenues = () => {
    setLoading(true);
    setError(null);
    fetchSavedVenues()
      .then((data) => {
        setVenues(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load venues');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadVenues();
  }, []);

  const filteredVenues = (Array.isArray(venues) ? venues : []).filter((venue) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      (venue.venueName && venue.venueName.toLowerCase().includes(query)) ||
      (venue.city && venue.city.toLowerCase().includes(query)) ||
      (venue.state && venue.state.toLowerCase().includes(query)) ||
      (venue.region && venue.region.toLowerCase().includes(query)) ||
      (venue.address && venue.address.toLowerCase().includes(query))
    );
  });

  const [creatingRecord, setCreatingRecord] = useState(false);

  const handleSelectVenue = async (venue) => {
    setCreatingRecord(true);
    try {
      const payload = {
        venue: {
          id: venue.id,
          venueName: venue.venueName || "",
          region: venue.region || "",
          state: venue.state || "",
          city: venue.city || "",
          address: venue.address || "",
          pinCode: venue.pinCode || ""
        },
        report: {
          reportType: "venue_audit"
        },
        contacts: {},
        auditeeAuditor: {},
        accessibility: {},
        administrativeDetails: {},
        systemDetails: {},
        labDetails: {},
        conclusion: {}
      };

      const data = await createFullAuditRecord(payload);
      
      if (data) {
        const updatedVenue = {
          ...venue,
          report_id: data.report_id,
          venue_id: data.venue_id
        };
        onSelectVenue(updatedVenue);
        return;
      }
    } catch (err) {
      console.error("API error, proceeding with offline mode:", err);
    } finally {
      setCreatingRecord(false);
    }
    
    // Proceed if API fails (offline backups keep IndexedDB flow)
    onSelectVenue(venue);
  };

  return (
    <div className="h-full flex flex-col bg-transparent select-none pb-safe relative">
      
      {/* Intro Header */}
      <div className="px-5 pt-6 pb-4 bg-transparent border-b border-white/10 shrink-0">
        <h2 className="text-lg font-light tracking-wide text-white">
          Select Saved Venue
        </h2>
        <p className="text-xs text-white/70 font-light mt-2 leading-relaxed">
          Select an existing venue to pre-fill its location and contact metadata, or start a fresh audit from scratch.
        </p>
      </div>

      {/* Search Bar */}
      <div className="px-5 py-3.5 bg-transparent border-b border-white/10 shrink-0">
        <div className="relative flex items-center">
          <span className="absolute left-3.5 text-white/50">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search venue name, city, state..."
            className="w-full bg-white/5 backdrop-blur-xl border-b-2 border-white/20 border-t-0 border-l-0 border-r-0 rounded-none pl-11 pr-10 py-2.5 text-[14px] font-light transition-all focus:border-[#4ecdc4] outline-none text-white placeholder-white/40 focus:shadow-[0_4px_20px_rgba(78,205,196,0.3)]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 text-slate-400 hover:text-slate-600 transition-colors p-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Full-screen Loading Overlay for Record Creation */}
      {creatingRecord && (
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center animate-fade-in">
          <div className="w-10 h-10 border-4 border-[#4ecdc4] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-white text-sm font-medium tracking-wide">Creating Full Audit Record...</p>
        </div>
      )}

      {/* Venue List */}
      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-28 scrollbar-none space-y-4">
        {loading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map((n) => (
              <div key={n} className="w-full bg-white/5 border border-white/10 rounded-3xl p-4 flex items-center">
                <div className="w-12 h-12 bg-white/10 rounded-2xl shrink-0" />
                <div className="ml-4 flex-1 pr-2 space-y-2">
                  <div className="h-4 bg-white/10 rounded w-2/3" />
                  <div className="h-3 bg-white/10 rounded w-1/3" />
                  <div className="h-3 bg-white/10 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center text-[#ff6b6b] mb-3">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h4 className="text-sm font-light text-white tracking-wide">Connection Failed</h4>
            <p className="text-xs text-white/70 font-light mt-2 max-w-[260px] leading-relaxed">
              Could not retrieve venues from the server. Please check the network settings or try again.
            </p>
            <button
              onClick={loadVenues}
              className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-light tracking-widest uppercase rounded-lg transition-all cursor-pointer"
            >
              Retry Connection
            </button>
          </div>
        ) : filteredVenues.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center text-white/40 mb-3">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h4 className="text-sm font-light text-white tracking-wide">No venues found</h4>
            <p className="text-xs text-white/70 font-light mt-1 max-w-[200px] leading-relaxed">
              We couldn't find any venues matching "{searchQuery}"
            </p>
          </div>
        ) : (
          filteredVenues.map((venue) => (
            <button
              key={venue.id}
              onClick={() => handleSelectVenue(venue)}
              disabled={creatingRecord}
              className="w-full text-left bg-white/5 backdrop-blur-xl border border-white/10 hover:border-[#4ecdc4] hover:bg-white/10 hover:shadow-[0_4px_20px_rgba(78,205,196,0.2)] active:scale-[0.98] transition-all duration-300 rounded-3xl p-4 flex items-center cursor-pointer group"
            >
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 transition-colors group-hover:bg-[#4ecdc4]/20">
                <BuildingIcon className="w-6 h-6 text-[#4ecdc4]" />
              </div>
              
              <div className="ml-4 flex-1 pr-2">
                <h3 className="text-[15px] font-light text-white mb-1 tracking-wide leading-tight group-hover:text-[#4ecdc4] transition-colors">
                  {venue.venueName}
                </h3>
                <p className="text-[10px] text-white/50 font-light uppercase tracking-widest mb-1">
                  {venue.city}, {venue.state} ({venue.region} Region)
                </p>
                <p className="text-[11px] text-white/70 font-light line-clamp-1">
                  {venue.address}
                </p>
              </div>

              <div className="shrink-0 ml-1 flex items-center justify-center text-white/30 group-hover:text-[#4ecdc4] transition-colors">
                <ChevronRightIcon className="w-5 h-5" />
              </div>
            </button>
          ))
        )}
      </div>

      {/* Sticky Bottom Footer */}
      <div className="bg-[#0F0F23]/80 backdrop-blur-xl border-t border-white/10 p-4 pb-safe shrink-0 shadow-[0_-4px_12px_rgba(0,0,0,0.3)]">
        <button
          onClick={onNewVenue}
          className="w-full py-3.5 bg-transparent border-2 border-[#ff6b6b] text-[#ff6b6b] hover:bg-[#ff6b6b] hover:text-[#0F0F23] text-sm font-medium tracking-widest uppercase rounded-[50px] shadow-[0_0_20px_rgba(255,107,107,0.2)] hover:shadow-[0_0_30px_rgba(255,107,107,0.4)] active:scale-95 transition-all cursor-pointer text-center"
        >
          Start New Audit for Other Venue
        </button>
      </div>

    </div>
  );
}
