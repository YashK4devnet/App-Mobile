import React from 'react';

export default function MobileLayout({ header, bottomNav, fab, children }) {
  return (
    <div className="audit-theme h-screen w-screen bg-[#f8fafc] flex justify-center items-center font-sans antialiased text-[#0f172a] overflow-hidden relative">
      {/* Content Container */}
      <div className="absolute inset-0 flex flex-col overflow-hidden z-10">

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
