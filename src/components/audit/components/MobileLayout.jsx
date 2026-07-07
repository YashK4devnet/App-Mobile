import React from 'react';
import { useLocation } from 'react-router-dom';

export default function MobileLayout({ header, bottomNav, fab, children }) {
  const location = useLocation();
  const path = location.pathname;

  // Determine active section
  const isReports = path.includes('/reports');
  const isSettings = path.includes('/settings');
  const isHome = !isReports && !isSettings;

  return (
    <div className="audit-theme h-screen w-screen bg-[#0F0F23] flex justify-center items-center font-sans antialiased text-white overflow-hidden relative">
      
      {/* --- Gradient Background Layers (Hardware Accelerated Crossfade) --- */}
      
      {/* 1. Home Gradient: Teal / Cyan dominant */}
      <div 
        className={`absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(78,205,196,0.15)_0%,transparent_50%),radial-gradient(circle_at_20%_80%,rgba(69,183,209,0.1)_0%,transparent_50%)] pointer-events-none transition-opacity duration-700 ease-in-out ${isHome ? 'opacity-100' : 'opacity-0'}`}
      />
      
      {/* 2. Reports Gradient: Coral / Teal dominant */}
      <div 
        className={`absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,107,107,0.15)_0%,transparent_50%),radial-gradient(circle_at_80%_80%,rgba(78,205,196,0.1)_0%,transparent_50%)] pointer-events-none transition-opacity duration-700 ease-in-out ${isReports ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* 3. Settings Gradient: Cyan / Coral dominant */}
      <div 
        className={`absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(69,183,209,0.15)_0%,transparent_50%),radial-gradient(circle_at_50%_90%,rgba(255,107,107,0.1)_0%,transparent_50%)] pointer-events-none transition-opacity duration-700 ease-in-out ${isSettings ? 'opacity-100' : 'opacity-0'}`}
      />

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
