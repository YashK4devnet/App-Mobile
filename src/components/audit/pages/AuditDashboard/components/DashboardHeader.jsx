import React from 'react';
import { getGreeting } from '../../../utils/formatting';

export default function DashboardHeader({ totalAssigned, userName = "Yash" }) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-white tracking-tight mb-1">
          {getGreeting()}, {userName}
        </h1>
        <p className="text-sm text-white/60 font-medium">
          You have {totalAssigned} assigned audits
        </p>
      </div>
      <button
        onClick={() => console.log('View all assigned audits clicked')}
        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[12px] font-bold active:scale-95 transition-all whitespace-nowrap"
      >
        View All
      </button>
    </div>
  );
}
