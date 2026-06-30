import React from 'react';

export default function MobileLayout({ header, bottomNav, fab, children }) {
  return (
    <div className="audit-theme h-screen w-screen bg-slate-50 flex justify-center items-center font-sans antialiased text-slate-800 overflow-hidden">
      <div className="absolute inset-0 bg-[#F8F9FA] flex flex-col overflow-hidden shadow-sm border-x border-slate-100">

        {/* Top Header */}
        {header}

        {/* Content Container */}
        <div className="flex-1 relative overflow-hidden">
          {children}
        </div>

        {/* Floating Action Button */}
        {fab}

        {/* Bottom Nav */}
        {bottomNav}
      </div>
    </div>
  );
}
