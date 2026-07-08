import React from 'react';
import { motion } from 'framer-motion';

const getStatusColor = (status) => {
  switch (status) {
    case 'Active': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
    case 'Needs Attention': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
    case 'Critical': return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
    default: return 'text-white/70 bg-white/5 border-white/10';
  }
};

export default React.memo(function VenueCard({ venue, onClick }) {
  const statusClasses = getStatusColor(venue.status);

  return (
    <div
      onClick={onClick}
      className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 cursor-pointer hover:bg-white/10 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] animate-fade-in group relative overflow-hidden"
    >
      {/* Decorative gradient orb */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-[#4ecdc4]/10 transition-colors" />

      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-white font-medium text-[16px] leading-tight">
            {venue.name}
          </h3>
          <p className="text-white/50 text-[12px] mt-1 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {venue.location}
          </p>
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${statusClasses}`}>
          {venue.status}
        </span>
      </div>

    </div>
  );
});
