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

  return (
    <nav className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex justify-between items-center z-10 shrink-0 select-none pb-safe">
      <div className="flex w-full justify-around pt-3 pb-4">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = location.pathname.includes(tab.id) || (location.pathname.endsWith(basePath) && tab.id === 'home');
          
          return (
            <button
              key={tab.id}
              onClick={() => {
                const target = tab.id === 'home' ? basePath : `${basePath}/${tab.id}`;
                navigate(target);
              }}
              className="flex flex-col items-center justify-center gap-1 text-[11px] font-bold transition-all relative flex-1 cursor-pointer"
              style={{ color: isActive ? '#F98A15' : '#94A3B8' }}
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
