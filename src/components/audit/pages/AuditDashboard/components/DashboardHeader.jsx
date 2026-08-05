import React from 'react';
import { getGreeting } from '../../../utils/formatting';
import { useNavigate } from 'react-router-dom';

export default function DashboardHeader({ totalAssigned, userName = "User" }) {
  const navigate = useNavigate();
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-[#0f172a] tracking-tight mb-1">
          {getGreeting()}, {userName}
        </h1>
        <p className="text-sm text-slate-500 font-medium">
          You have {totalAssigned} assigned audits
        </p>
      </div>
      <button
        onClick={() => navigate('/audit/reports')}
        className="px-4 py-2 bg-[#ff7700] hover:bg-[#ea580c] text-white rounded-xl text-[12px] font-bold active:scale-95 transition-all whitespace-nowrap shadow-sm cursor-pointer"
      >
        View All
      </button>
    </div>
  );
}
