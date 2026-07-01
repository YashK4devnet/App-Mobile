import React, { useState, useEffect } from 'react';
import { BuildingIcon, ChevronRightIcon } from './Icons';
import { fetchSavedVenues } from '../services/venueService';

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

  return (
    <div className="h-full flex flex-col bg-slate-50 select-none pb-safe">
      
      {/* Intro Header */}
      <div className="px-5 pt-6 pb-4 bg-slate-50 border-b border-slate-200/60 shrink-0">
        <h2 className="text-base font-black text-slate-800 tracking-tight">
          Select Saved Venue
        </h2>
        <p className="text-xs text-slate-500 font-semibold mt-1 leading-normal">
          Select an existing venue to pre-fill its location and contact metadata, or start a fresh audit from scratch.
        </p>
      </div>

      {/* Search Bar */}
      <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200/60 shrink-0">
        <div className="relative flex items-center">
          <span className="absolute left-3.5 text-slate-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search venue name, city, state..."
            className="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-10 py-2.5 text-[14px] font-medium transition-all focus:ring-1 focus:ring-[#F98A15] outline-none text-slate-800 placeholder-slate-400 focus:border-[#F98A15] shadow-sm"
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

      {/* Venue List */}
      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-28 scrollbar-none space-y-4">
        {loading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map((n) => (
              <div key={n} className="w-full bg-white border border-slate-100 rounded-2xl p-4 flex items-center shadow-sm">
                <div className="w-12 h-12 bg-slate-100 rounded-xl shrink-0" />
                <div className="ml-4 flex-1 pr-2 space-y-2">
                  <div className="h-4 bg-slate-100 rounded w-2/3" />
                  <div className="h-3 bg-slate-100 rounded w-1/3" />
                  <div className="h-3 bg-slate-100 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-3">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h4 className="text-sm font-bold text-slate-800">Connection Failed</h4>
            <p className="text-xs text-slate-500 mt-2 max-w-[260px] leading-relaxed">
              Could not retrieve venues from the server. Please check the network settings or try again.
            </p>
            <button
              onClick={loadVenues}
              className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition-all cursor-pointer"
            >
              Retry Connection
            </button>
          </div>
        ) : filteredVenues.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-3">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h4 className="text-sm font-bold text-slate-700">No venues found</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-[200px] leading-relaxed">
              We couldn't find any venues matching "{searchQuery}"
            </p>
          </div>
        ) : (
          filteredVenues.map((venue) => (
            <button
              key={venue.id}
              onClick={() => onSelectVenue(venue)}
              className="w-full text-left bg-white border border-slate-200 hover:border-[#F98A15]/50 active:scale-[0.98] transition-all rounded-2xl p-4 flex items-center shadow-sm cursor-pointer group"
            >
              <div className="w-12 h-12 bg-[#FFF4E8] rounded-xl flex items-center justify-center shrink-0">
                <BuildingIcon className="w-6 h-6 text-[#F98A15]" />
              </div>
              
              <div className="ml-4 flex-1 pr-2">
                <h3 className="text-[14px] font-bold text-slate-800 mb-0.5 tracking-tight group-hover:text-[#F98A15] transition-colors leading-tight">
                  {venue.venueName}
                </h3>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                  {venue.city}, {venue.state} ({venue.region} Region)
                </p>
                <p className="text-xs text-slate-500 font-medium line-clamp-1">
                  {venue.address}
                </p>
              </div>

              <div className="shrink-0 ml-1 flex items-center justify-center text-slate-400 group-hover:text-[#F98A15] transition-colors">
                <ChevronRightIcon className="w-5 h-5" />
              </div>
            </button>
          ))
        )}
      </div>

      {/* Sticky Bottom Footer */}
      <div className="bg-white border-t border-slate-200 p-4 pb-safe shrink-0 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
        <button
          onClick={onNewVenue}
          className="w-full py-3.5 bg-[#F98A15] hover:bg-[#e07b0f] text-white text-sm font-bold rounded-xl shadow-lg shadow-orange-500/20 active:scale-95 transition-all cursor-pointer text-center"
        >
          Start New Audit for Other Venue
        </button>
      </div>

    </div>
  );
}
