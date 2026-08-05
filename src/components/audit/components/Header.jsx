import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeftIcon } from './Icons';

export default function Header({
  onNotificationClick,
  hasNotifications = true,
  title = "Management System",
  onBackClick,
  headerRight
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = onBackClick || (() => {
    const path = location.pathname;
    const isDashboard =
      path === '/audit' ||
      path === '/audit/home' ||
      path === '/audit/';

    if (isDashboard) {
      navigate('/dashboard');
    } else {
      navigate(-1);
    }
  });

  return (
    <header
      className="flex items-center px-5 py-4 bg-white/95 backdrop-blur-xl border-b border-[#ff7700]/18 sticky top-0 z-10 shrink-0 select-none shadow-xs"
      style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 1rem)' }}
    >
      <button
        onClick={handleBack}
        className="p-1.5 text-[#0f172a] hover:bg-[#ff7700]/10 rounded-lg active:scale-90 transition-all cursor-pointer"
        aria-label="Go Back"
      >
        <ArrowLeftIcon className="w-5 h-5 text-[#0f172a]" />
      </button>

      <h1 className="ml-3 text-[18px] font-bold tracking-tight text-[#0f172a] truncate">
        {title}
      </h1>

      {headerRight}
    </header>
  );
}