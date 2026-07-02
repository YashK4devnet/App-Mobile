import React from 'react';

export default function MobileLayout({ header, bottomNav, fab, children }) {
  return (
    <div className="audit-theme h-screen w-screen bg-[#0F0F23] flex justify-center items-center font-sans antialiased text-white overflow-hidden relative">
      {/* Dark theme radial gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,107,107,0.1)_0%,transparent_50%),radial-gradient(circle_at_80%_20%,rgba(78,205,196,0.1)_0%,transparent_50%)] pointer-events-none"></div>
      
      <div className="absolute inset-0 flex flex-col overflow-hidden">

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
