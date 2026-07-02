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
      className="flex justify-between items-center px-5 py-4 bg-[#0F0F23]/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-10 shrink-0 select-none"
      style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 1rem)' }}
    >
      <button 
        onClick={handleBack} 
        className="p-1 text-white hover:bg-white/10 rounded-lg active:scale-90 transition-all cursor-pointer"
        aria-label="Go Back"
      >
        <ArrowLeftIcon className="w-6 h-6 text-white" />
      </button>
      
      <h1 className="text-[18px] font-medium tracking-wide text-white drop-shadow-md flex-1 text-center truncate px-2">
        {title}
      </h1>
      
      {headerRight ? (
        headerRight
      ) : (
        <button 
          onClick={onNotificationClick} 
          className="p-1 text-white hover:bg-white/10 rounded-lg relative active:scale-90 transition-all cursor-pointer"
          aria-label="Open Notifications"
        >
          <BellIcon className="w-6 h-6" />
          {hasNotifications && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#ff6b6b] rounded-full border-2 border-[#0F0F23]" />
          )}
        </button>
      )}
    </header>
  );
}

