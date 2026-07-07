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

export default function VenueCard({ venue, onClick }) {
  const statusClasses = getStatusColor(venue.status);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 cursor-pointer hover:bg-white/10 transition-colors group relative overflow-hidden"
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

      <div className="flex items-center gap-4 mt-4 text-[13px] text-white/70">
        <div className="flex items-center gap-1.5">
           <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          {venue.type}
        </div>
        <div className="flex items-center gap-1.5">
           <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {new Date(venue.lastAuditDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
        <span className="text-[12px] text-white/50">Total Reports</span>
        <span className="text-[12px] font-bold text-white bg-white/10 px-2 py-0.5 rounded">
          {venue.totalReports}
        </span>
      </div>
      
      {venue.pendingReports > 0 && (
        <div className="mt-2 flex items-center justify-between">
          <span className="text-[12px] text-white/50">Pending Reports</span>
          <span className="text-[12px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {venue.pendingReports}
          </span>
        </div>
      )}
    </motion.div>
  );
}
