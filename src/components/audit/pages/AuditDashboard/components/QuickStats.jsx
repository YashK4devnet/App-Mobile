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
        <div className="bg-white border border-[#ff7700]/20 rounded-2xl p-4 flex flex-col items-center justify-center shadow-xs">
          <span className="text-2xl font-bold text-[#0f172a] mb-1">{totalAssigned}</span>
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold text-center leading-tight">Total Assigned</span>
        </div>
        <div className="bg-white border border-[#ff7700]/20 rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden shadow-xs">
          <div className="absolute top-0 right-0 w-8 h-8 bg-blue-500/10 rounded-bl-full"></div>
          <span className="text-2xl font-bold text-blue-600 mb-1">{inProgressCount}</span>
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold text-center leading-tight">In Progress</span>
        </div>
        <div className="bg-white border border-[#ff7700]/20 rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden shadow-xs">
          <div className="absolute top-0 right-0 w-8 h-8 bg-[#ff7700]/10 rounded-bl-full"></div>
          <span className="text-2xl font-bold text-[#ff7700] mb-1">{completedCount}</span>
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold text-center leading-tight">Completed</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white border border-[#ff7700]/20 rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden shadow-xs">
          <div className="absolute top-0 right-0 w-8 h-8 bg-amber-500/10 rounded-bl-full"></div>
          <span className="text-2xl font-bold text-amber-600 mb-1">{waitingCount}</span>
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold text-center leading-tight">Waiting Approval</span>
        </div>
        <div className="bg-white border border-[#ff7700]/20 rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden shadow-xs">
          <div className="absolute top-0 right-0 w-8 h-8 bg-emerald-500/10 rounded-bl-full"></div>
          <span className="text-2xl font-bold text-emerald-600 mb-1">{approvedCount}</span>
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold text-center leading-tight">Approved</span>
        </div>
        <div className="bg-white border border-[#ff7700]/20 rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden shadow-xs">
          <div className="absolute top-0 right-0 w-8 h-8 bg-rose-500/10 rounded-bl-full"></div>
          <span className="text-2xl font-bold text-rose-600 mb-1">{rejectedCount}</span>
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold text-center leading-tight">Rejected</span>
        </div>
      </div>
    </div>
  );
}
