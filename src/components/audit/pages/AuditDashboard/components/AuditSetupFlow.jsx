import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../../../components/Header';
import VenueSelectPage from '../../../components/VenueSelectPage';
import { 
  BuildingIcon, 
  LightningIcon, 
  GlobeIcon, 
  ChevronRightIcon 
} from '../../../components/Icons';

export default function AuditSetupFlow() {
  const navigate = useNavigate();
  const location = useLocation();
  const [setupStep, setSetupStep] = useState(location.pathname.endsWith('/type') ? 'type-select' : 'venue-select');
  const [selectedVenue, setSelectedVenue] = useState(location.state?.venue || null);

  useEffect(() => {
    if (location.pathname.endsWith('/type')) {
      setSetupStep('type-select');
    } else {
      setSetupStep('venue-select');
      setSelectedVenue(null);
    }
  }, [location.pathname]);

  const handleSelectVenue = (venue) => {
    setSelectedVenue(venue);
    navigate('type', { state: { venue } });
  };

  const handleNewVenue = () => {
    const venue = { isNew: true };
    setSelectedVenue(venue);
    navigate('type', { state: { venue } });
  };

  const handleAuditTypeSelect = (auditTypeId) => {
    const venueData = selectedVenue?.isNew ? {} : selectedVenue;
    navigate(`../${auditTypeId}`, { state: { venue: venueData, loadDraft: false } });
  };

  const auditTypes = [
    {
      id: "venue-audit",
      title: "Venue Audit",
      description: "Inspect building structure, access and administrative details",
      icon: "building",
      enabled: true
    },
    {
      id: "power-audit",
      title: "Power System Audit",
      description: "Assess power supply, LT panels, generators and UPS systems",
      icon: "lightning",
      enabled: true
    },
    {
      id: "network-audit",
      title: "Network System Audit",
      description: "Analyze network infrastructure, switch counts and servers",
      icon: "globe",
      enabled: true
    }
  ];

  const resolveIcon = (iconName) => {
    switch (iconName) {
      case 'building': 
        return <BuildingIcon className="w-5 h-5 text-[#ff6b6b]" />;
      case 'lightning': 
        return <LightningIcon className="w-5 h-5 text-[#4ecdc4]" />;
      case 'globe': 
        return <GlobeIcon className="w-5 h-5 text-[#ff6b6b]" />;
      default: 
        return null;
    }
  };

  if (setupStep === 'venue-select') {
    return (
      <div className="flex flex-col h-full w-full relative bg-transparent animate-fade-in">
        <Header 
          title="Venue Selection" 
          showBack={true} 
          onBackClick={() => navigate('..')} 
        />
        <div className="flex-1 overflow-hidden">
          <VenueSelectPage 
            onSelectVenue={handleSelectVenue}
            onNewVenue={handleNewVenue}
          />
        </div>
      </div>
    );
  }

  // Step 2: Audit Type Selection
  return (
    <div className="flex flex-col h-full w-full relative bg-transparent select-none animate-fade-in">
      <Header 
        title="Select Audit Type" 
        showBack={true} 
        onBackClick={() => navigate(-1)} 
      />
      
      <div className="flex-1 overflow-y-auto px-5 py-5 scrollbar-none space-y-5">
        
        {/* Selected Venue Summary Card */}
        <div className="p-4 bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 bg-[#ff6b6b] rounded-xl flex items-center justify-center shrink-0 shadow-sm">
            <BuildingIcon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[9px] uppercase font-black tracking-wider text-[#ff6b6b] bg-[#ff6b6b]/20 px-2 py-0.5 rounded shadow-sm">
              {selectedVenue?.isNew ? 'New Location' : 'Selected Venue'}
            </span>
            <h4 className="text-[14px] font-bold text-white mt-1 truncate leading-tight">
              {selectedVenue?.isNew ? 'New Venue / Other Location' : selectedVenue?.venueName}
            </h4>
            {!selectedVenue?.isNew && (
              <p className="text-[11px] text-white/50 font-semibold truncate mt-0.5">
                {selectedVenue?.city}, {selectedVenue?.state}
              </p>
            )}
          </div>
        </div>

        {/* Section Header */}
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight">
            Select Audit Procedure
          </h3>
          <p className="text-[11px] text-white/50 font-semibold mt-0.5">
            Choose the audit template to perform for this location
          </p>
        </div>

        {/* Audit Types List */}
        <div className="space-y-3">
          {auditTypes.map((type) => {
            const isClickable = type.enabled;
            return (
              <button
                key={type.id}
                disabled={!isClickable}
                onClick={() => handleAuditTypeSelect(type.id)}
                className={`w-full flex items-center justify-between p-4 bg-white/5 backdrop-blur-md rounded-2xl border transition-all text-left duration-200 ${
                  isClickable 
                    ? 'border-white/20 hover:border-white/40 hover:bg-white/10 active:scale-[0.98] cursor-pointer' 
                    : 'border-white/10 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    isClickable ? 'bg-white/10' : 'bg-white/5'
                  }`}>
                    {resolveIcon(type.icon)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className={`text-[14px] font-bold leading-tight ${
                        isClickable ? 'text-white' : 'text-white/50'
                      }`}>
                        {type.title}
                      </h4>
                      {type.badge && (
                        <span className="text-[8px] font-black uppercase tracking-wider text-white/50 bg-white/10 px-1.5 py-0.5 rounded">
                          {type.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-white/50 font-medium mt-0.5 leading-tight">
                      {type.description}
                    </p>
                  </div>
                </div>
                {isClickable && <ChevronRightIcon className="w-5 h-5 text-white/30" />}
              </button>
            );
          })}
        </div>

      </div>

    </div>
  );
}
