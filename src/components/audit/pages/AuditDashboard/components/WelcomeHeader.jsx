import React from 'react';

export default function WelcomeHeader({ user }) {
  const greeting = user?.greeting || "Good morning,";
  const name = user?.name || "John Doe";
  
  return (
    <div className="mb-6 mt-2 select-none">
      <p className="text-white/70 text-sm font-light tracking-widest uppercase leading-none mb-2">
        {greeting}
      </p>
      <h2 className="text-[28px] font-light text-white tracking-wide leading-tight mb-3">
        {name}
      </h2>
      <div className="w-12 h-1 bg-gradient-to-r from-[#ff6b6b] to-[#4ecdc4] rounded-full"></div>
    </div>
  );
}
