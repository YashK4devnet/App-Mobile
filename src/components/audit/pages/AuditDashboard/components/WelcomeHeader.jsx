import React from 'react';

export default function WelcomeHeader({ user }) {
  const greeting = user?.greeting || "Good morning,";
  const name = user?.name || "User";
  
  return (
    <div className="mb-6 mt-2 select-none">
      <p className="text-slate-500 text-sm font-medium tracking-wider uppercase leading-none mb-2">
        {greeting}
      </p>
      <h2 className="text-[28px] font-bold text-[#0f172a] tracking-tight leading-tight mb-3">
        {name}
      </h2>
      <div className="w-12 h-1 bg-[#ff7700] rounded-full"></div>
    </div>
  );
}
