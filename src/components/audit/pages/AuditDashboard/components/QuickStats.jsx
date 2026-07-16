import React from 'react';

export default function QuickStats({ 
  totalAssigned, 
  inProgressCount, 
  completedCount,
  waitingCount,
  approvedCount,
  rejectedCount
}) {
  return (
    <div className="flex flex-col gap-3 mb-8">
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-white mb-1">{totalAssigned}</span>
          <span className="text-[10px] uppercase tracking-wider text-white/50 font-semibold text-center leading-tight">Total Assigned</span>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-8 h-8 bg-blue-500/20 rounded-bl-full"></div>
          <span className="text-2xl font-bold text-blue-400 mb-1">{inProgressCount}</span>
          <span className="text-[10px] uppercase tracking-wider text-white/50 font-semibold text-center leading-tight">In Progress</span>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-8 h-8 bg-[#4ecdc4]/20 rounded-bl-full"></div>
          <span className="text-2xl font-bold text-[#4ecdc4] mb-1">{completedCount}</span>
          <span className="text-[10px] uppercase tracking-wider text-white/50 font-semibold text-center leading-tight">Completed</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-8 h-8 bg-amber-500/20 rounded-bl-full"></div>
          <span className="text-2xl font-bold text-amber-400 mb-1">{waitingCount}</span>
          <span className="text-[10px] uppercase tracking-wider text-white/50 font-semibold text-center leading-tight">Waiting Approval</span>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-8 h-8 bg-emerald-500/20 rounded-bl-full"></div>
          <span className="text-2xl font-bold text-emerald-400 mb-1">{approvedCount}</span>
          <span className="text-[10px] uppercase tracking-wider text-white/50 font-semibold text-center leading-tight">Approved</span>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-8 h-8 bg-rose-500/20 rounded-bl-full"></div>
          <span className="text-2xl font-bold text-rose-400 mb-1">{rejectedCount}</span>
          <span className="text-[10px] uppercase tracking-wider text-white/50 font-semibold text-center leading-tight">Rejected</span>
        </div>
      </div>
    </div>
  );
}
