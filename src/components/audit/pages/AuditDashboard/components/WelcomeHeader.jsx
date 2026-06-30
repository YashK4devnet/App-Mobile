import React from 'react';

export default function WelcomeHeader({ user }) {
  const greeting = user?.greeting || "Good morning,";
  const name = user?.name || "John Doe";
  
  return (
    <div className="mb-6 mt-2 select-none">
      <p className="text-slate-500 text-sm font-semibold tracking-tight leading-none mb-1">
        {greeting}
      </p>
      <h2 className="text-[28px] font-extrabold text-slate-800 leading-tight mb-2">
        {name}
      </h2>
      <div className="w-10 h-0.75 bg-[#F98A15] rounded-full"></div>
    </div>
  );
}
