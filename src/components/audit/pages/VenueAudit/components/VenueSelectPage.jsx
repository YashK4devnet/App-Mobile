import React from 'react';
import { BuildingIcon, ChevronRightIcon } from '../../../components/Icons';
import { SAVED_VENUES } from '../services/mockVenueData';

export default function VenueSelectPage({ onSelectVenue, onNewVenue }) {
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

      {/* Venue List */}
      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-28 scrollbar-none space-y-4">
        {SAVED_VENUES.map((venue) => (
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
        ))}
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
