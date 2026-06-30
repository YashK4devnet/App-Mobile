import React from 'react';

export default function AuditReportsPage() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center select-none animate-pulse">
      <div className="w-16 h-16 bg-[#FFF4E8] rounded-full flex items-center justify-center text-[#F98A15] mb-4 shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-1 tracking-tight">Reports</h3>
      <p className="text-xs text-slate-400 max-w-[240px] font-bold">
        Access your detailed audit history and export report files.
      </p>
    </div>
  );
}
