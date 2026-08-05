import React from 'react';

const getStatusColor = (status) => {
  switch (status) {
    case 'Active': return 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20';
    case 'Needs Attention': return 'text-amber-600 bg-amber-500/10 border-amber-500/20';
    case 'Critical': return 'text-rose-600 bg-rose-500/10 border-rose-500/20';
    default: return 'text-slate-600 bg-slate-100 border-slate-200';
  }
};

export default React.memo(function VenueCard({ venue, onClick }) {
  const statusClasses = getStatusColor(venue.status);

  return (
    <div
      onClick={onClick}
      className="w-full bg-white border border-[#ff7700]/20 rounded-2xl p-4 cursor-pointer hover:border-[#ff7700]/40 transition-all duration-200 hover:scale-[1.01] active:scale-[0.98] animate-fade-in group relative overflow-hidden shadow-xs"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-[#0f172a] font-semibold text-[16px] leading-tight">
            {venue.name}
          </h3>
          <p className="text-slate-500 text-[12px] mt-1 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
