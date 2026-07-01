import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BellIcon, ArrowLeftIcon } from './Icons';

export default function Header({ 
  onNotificationClick, 
  hasNotifications = true,
  title = "Management System",
  onBackClick,
  headerRight
}) {
  const navigate = useNavigate();
  const handleBack = onBackClick || (() => navigate('/dashboard'));

  return (
    <header 
      className="flex justify-between items-center px-5 py-4 bg-white border-b border-slate-100 sticky top-0 z-10 shrink-0 select-none"
      style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 1rem)' }}
    >
      <button 
        onClick={handleBack} 
        className="p-1 text-slate-800 hover:bg-slate-50 rounded-lg active:scale-90 transition-transform cursor-pointer"
        aria-label="Go Back"
      >
        <ArrowLeftIcon className="w-6 h-6 text-slate-700" />
      </button>
      
      <h1 className="text-[16px] font-bold text-slate-800 tracking-tight flex-1 text-center truncate px-2">
        {title}
      </h1>
      
      {headerRight ? (
        headerRight
      ) : (
        <button 
          onClick={onNotificationClick} 
          className="p-1 text-slate-800 hover:bg-slate-50 rounded-lg relative active:scale-90 transition-transform cursor-pointer"
          aria-label="Open Notifications"
        >
          <BellIcon className="w-6 h-6" />
          {hasNotifications && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#F98A15] rounded-full border-2 border-white" />
          )}
        </button>
      )}
    </header>
  );
}

