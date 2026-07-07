import { useLocation, useNavigate } from 'react-router-dom';
import { HouseIcon, DocumentIcon, CogIcon } from './Icons';

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const basePath = '/audit';
  const tabs = [
    { id: 'home', label: 'Home', icon: HouseIcon },
    { id: 'reports', label: 'Reports', icon: DocumentIcon },
    { id: 'settings', label: 'Settings', icon: CogIcon },
  ];

  const activeIndex = tabs.findIndex(tab => {
    if (tab.id === 'home') {
      return location.pathname === basePath || location.pathname === `${basePath}/` || location.pathname.includes('/home');
    }
    return location.pathname.includes(`/${tab.id}`);
  });
  
  const safeActiveIndex = activeIndex === -1 ? 0 : activeIndex;

  return (
    <nav className="absolute bottom-0 left-0 right-0 bg-[#0F0F23]/80 backdrop-blur-2xl border-t border-white/10 flex justify-between items-center z-10 shrink-0 select-none pb-safe">
      <div className="flex w-full justify-around pt-3 pb-4 relative">
        
        {/* Sleek Sliding Pill Background */}
        <div 
          className="absolute left-0 top-2 bottom-3 w-[33.333%] transition-transform duration-300 ease-out z-0 pointer-events-none flex justify-center items-center"
          style={{ transform: `translateX(${safeActiveIndex * 100}%)` }}
        >
          {/* Extremely subtle transparent glass pill */}
          <div className="w-[60%] h-full rounded-[14px] bg-white/[0.03] border border-white/[0.05]" />
        </div>

        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = tab.id === 'home' 
            ? (location.pathname === basePath || location.pathname === `${basePath}/` || location.pathname.includes('/home'))
            : location.pathname.includes(`/${tab.id}`);
          
          return (
            <button
              key={tab.id}
              onClick={() => {
                const target = tab.id === 'home' ? basePath : `${basePath}/${tab.id}`;
                navigate(target);
              }}
              className="flex flex-col items-center justify-center gap-1 text-[11px] font-light tracking-widest uppercase transition-all relative flex-1 cursor-pointer z-10"
              style={{ color: isActive ? '#4ECDC4' : 'rgba(255, 255, 255, 0.4)' }}
            >
              <IconComponent className="w-6 h-6 transition-transform active:scale-90" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
