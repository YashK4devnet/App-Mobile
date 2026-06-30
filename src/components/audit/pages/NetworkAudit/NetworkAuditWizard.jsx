import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuditWizard } from '../../hooks/useAuditWizard';
import Header from '../../components/Header';
import BottomNav from '../../components/BottomNav';
import AuditIndex from '../../components/AuditIndex';
import ProgressBar from '../../components/ProgressBar';
import FormRenderer from '../../components/FormRenderer';
import VenueSelectPage from '../../components/VenueSelectPage';
import {
  NETWORK_REPORT_INFO_SCHEMA,
  NETWORK_VENUE_INFO_SCHEMA,
  NETWORK_PERSONNEL_INFO_SCHEMA,
  NETWORK_ARCHITECTURE_SCHEMA,
  PUBLIC_NETWORK_HARDENING_SCHEMA,
  NETWORK_INFRASTRUCTURE_SCHEMA,
  WAN_INFRASTRUCTURE_SCHEMA,
  SYSTEM_CONFIGURATION_SCHEMA,
  NETWORK_CONFIGURATION_SCHEMA,
  BACKUP_DEVICES_SCHEMA,
  NETWORK_SECURITY_COMPLIANCE_SCHEMA,
  NETWORK_PHOTO_EVIDENCE_SCHEMA,
  NETWORK_OBSERVATIONS_SCHEMA
} from './schemas/networkAuditSchemas';
import {
  CheckIcon,
  ChevronDownIcon,
  ExclamationCircleIcon,
  BuildingIcon,
  UserIcon,
  DocumentIcon
} from '../../components/Icons';
import {
  generateInitialState,
  validateSchema,
  isSchemaEmpty,
  calculateSchemaProgress,
  calculateGlobalProgress
} from './services/networkAuditService';

const SUBSECTION_SCHEMAS = {
  'ReportInfo': NETWORK_REPORT_INFO_SCHEMA,
  'VenueInfo': NETWORK_VENUE_INFO_SCHEMA,
  'PersonnelInfo': NETWORK_PERSONNEL_INFO_SCHEMA,
  'NetworkArchitecture': NETWORK_ARCHITECTURE_SCHEMA,
  'PublicNetworkHardening': PUBLIC_NETWORK_HARDENING_SCHEMA,
  'NetworkInfrastructure': NETWORK_INFRASTRUCTURE_SCHEMA,
  'WanInfrastructure': WAN_INFRASTRUCTURE_SCHEMA,
  'SystemConfiguration': SYSTEM_CONFIGURATION_SCHEMA,
  'NetworkConfiguration': NETWORK_CONFIGURATION_SCHEMA,
  'BackupDevices': BACKUP_DEVICES_SCHEMA,
  'NetworkSecurityCompliance': NETWORK_SECURITY_COMPLIANCE_SCHEMA,
  'PhotoEvidence': NETWORK_PHOTO_EVIDENCE_SCHEMA,
  'Observations': NETWORK_OBSERVATIONS_SCHEMA
};

const STEPS = [
  { id: 'ReportInfo' },
  { id: 'VenueInfo' },
  { id: 'PersonnelInfo' },
  { id: 'NetworkArchitecture' },
  { id: 'PublicNetworkHardening' },
  { id: 'NetworkInfrastructure' },
  { id: 'WanInfrastructure' },
  { id: 'SystemConfiguration' },
  { id: 'NetworkConfiguration' },
  { id: 'BackupDevices' },
  { id: 'NetworkSecurityCompliance' },
  { id: 'PhotoEvidence' },
  { id: 'Observations' }
];

// Initialize dynamically from schemas
const INITIAL_NETWORK_AUDIT_STATE = generateInitialState(SUBSECTION_SCHEMAS);

export default function NetworkAuditWizard() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialVenue = location.state?.venue || null;

  const {
    viewMode, setViewMode,
    currentSubsection, setCurrentSubsection,
    formData, setFormData,
    errors, setErrors,
    showSuccessOverlay, setShowSuccessOverlay,
    isInitializing,
    isAccordionOpen, setIsAccordionOpen,
    handleFieldChange, getSectionStatus,
    progressPercent, handleSectionSelect,
    handleNextClick, handlePrevClick
  } = useAuditWizard({
    schemas: SUBSECTION_SCHEMAS,
    steps: STEPS,
    initialStateGenerator: generateInitialState,
    validateSchema,
    isSchemaEmpty,
    calculateGlobalProgress,
    initialVenue,
    auditName: 'Venue Network Audit Report',
    nextAuditMonths: 6
  });

  const statusReportInfo = getSectionStatus('ReportInfo');
  const statusVenue = getSectionStatus('VenueInfo');
  const statusPersonnel = getSectionStatus('PersonnelInfo');
  const statusNetworkArchitecture = getSectionStatus('NetworkArchitecture');
  const statusPublicNetworkHardening = getSectionStatus('PublicNetworkHardening');
  const statusNetworkInfrastructure = getSectionStatus('NetworkInfrastructure');
  const statusWanInfrastructure = getSectionStatus('WanInfrastructure');
  const statusSystemConfiguration = getSectionStatus('SystemConfiguration');
  const statusNetworkConfiguration = getSectionStatus('NetworkConfiguration');
  const statusBackupDevices = getSectionStatus('BackupDevices');
  const statusNetworkSecurityCompliance = getSectionStatus('NetworkSecurityCompliance');
  const statusPhotoEvidence = getSectionStatus('PhotoEvidence');
  const statusObservations = getSectionStatus('Observations');

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 text-sm">Loading Draft...</p>
        </div>
      </div>
    );
  }

  // Rendering Helpers
  const renderIndexView = () => {
    const getItemsCount = (sectionId) => {
      const { total } = calculateSchemaProgress(SUBSECTION_SCHEMAS[sectionId], formData);
      return `${total} items`;
    };

    const auditGroups = [
      {
        title: 'PREFATORY AUDIT',
        sections: [
          { id: 'ReportInfo', title: '1. Report Information', itemsCount: getItemsCount('ReportInfo'), status: statusReportInfo, icon: DocumentIcon },
          { id: 'VenueInfo', title: '2. Venue Information', itemsCount: getItemsCount('VenueInfo'), status: statusVenue, icon: BuildingIcon },
          { id: 'PersonnelInfo', title: '3. Auditee & Auditor Information', itemsCount: getItemsCount('PersonnelInfo'), status: statusPersonnel, icon: UserIcon }
        ]
      },
      {
        title: 'NETWORK AUDIT',
        sections: [
          { id: 'NetworkArchitecture', title: '4. Network Architecture', itemsCount: getItemsCount('NetworkArchitecture'), status: statusNetworkArchitecture, icon: DocumentIcon },
          { id: 'PublicNetworkHardening', title: '5. Public Network Hardening', itemsCount: getItemsCount('PublicNetworkHardening'), status: statusPublicNetworkHardening, icon: DocumentIcon },
          { id: 'NetworkInfrastructure', title: '6. Network Infrastructure', itemsCount: getItemsCount('NetworkInfrastructure'), status: statusNetworkInfrastructure, icon: DocumentIcon },
          { id: 'WanInfrastructure', title: '7. Wan Infrastructure', itemsCount: getItemsCount('WanInfrastructure'), status: statusWanInfrastructure, icon: DocumentIcon },
          { id: 'SystemConfiguration', title: '8. System Configuration', itemsCount: getItemsCount('SystemConfiguration'), status: statusSystemConfiguration, icon: DocumentIcon },
          { id: 'NetworkConfiguration', title: '9. Network Configuration', itemsCount: getItemsCount('NetworkConfiguration'), status: statusNetworkConfiguration, icon: DocumentIcon },
          { id: 'BackupDevices', title: '10. Backup Devices', itemsCount: getItemsCount('BackupDevices'), status: statusBackupDevices, icon: DocumentIcon },
          { id: 'NetworkSecurityCompliance', title: '11. Network Security Compliance', itemsCount: getItemsCount('NetworkSecurityCompliance'), status: statusNetworkSecurityCompliance, icon: DocumentIcon },
          { id: 'PhotoEvidence', title: '12. Photo Evidence of Devices', itemsCount: getItemsCount('PhotoEvidence'), status: statusPhotoEvidence, icon: DocumentIcon },
          { id: 'Observations', title: '13. Observations', itemsCount: getItemsCount('Observations'), status: statusObservations, icon: DocumentIcon }
        ]
      }
    ];

    return (
      <div className="flex flex-col h-full w-full relative animate-fade-in">
        <Header 
          title="Network System Assessment" 
          showBack={true} 
          onBackClick={() => navigate('..')} 
        />
        <div className="flex-1 overflow-hidden">
          <AuditIndex
            groups={auditGroups}
            onSectionSelect={handleSectionSelect}
            progressPercent={progressPercent}
          />
        </div>
        <BottomNav />
      </div>
    );
  };

  const renderFormView = () => {
    const isFirst = currentSubsection === 'ReportInfo';
    const subProgress = calculateSchemaProgress(SUBSECTION_SCHEMAS[currentSubsection], formData);

    // Header pill
    const currentIndex = STEPS.findIndex(s => s.id === currentSubsection) + 1;
    const stepPill = (
      <span className="text-[11px] font-black text-[#F98A15] bg-[#FFF4E8] px-2.5 py-1 rounded-full">
        {currentIndex} / {STEPS.length}
      </span>
    );

    const subsections = [
      { id: 'ReportInfo', label: '1. Report Information', status: statusReportInfo },
      { id: 'VenueInfo', label: '2. Venue Information', status: statusVenue },
      { id: 'PersonnelInfo', label: '3. Auditee & Auditor Information', status: statusPersonnel },
      { id: 'NetworkArchitecture', label: '4. Network Architecture', status: statusNetworkArchitecture },
      { id: 'PublicNetworkHardening', label: '5. Public Network Hardening', status: statusPublicNetworkHardening },
      { id: 'NetworkInfrastructure', label: '6. Network Infrastructure', status: statusNetworkInfrastructure },
      { id: 'WanInfrastructure', label: '7. Wan Infrastructure', status: statusWanInfrastructure },
      { id: 'SystemConfiguration', label: '8. System Configuration', status: statusSystemConfiguration },
      { id: 'NetworkConfiguration', label: '9. Network Configuration', status: statusNetworkConfiguration },
      { id: 'BackupDevices', label: '10. Backup Devices', status: statusBackupDevices },
      { id: 'NetworkSecurityCompliance', label: '11. Network Security Compliance', status: statusNetworkSecurityCompliance },
      { id: 'PhotoEvidence', label: '12. Photo Evidence of Devices', status: statusPhotoEvidence },
      { id: 'Observations', label: '13. Observations', status: statusObservations }
    ];

    const currentSubObj = subsections.find(s => s.id === currentSubsection);

    return (
      <div className="flex flex-col h-full w-full relative bg-white animate-fade-in">
        <Header 
          title="Network Audit Details" 
          showBack={true} 
          onBackClick={() => {
            setViewMode('index');
            setIsAccordionOpen(false);
          }} 
          headerRight={stepPill}
        />

        {/* Subsection Progress Indicator (Sticky) */}
        <ProgressBar
          percent={subProgress.percent}
          filled={subProgress.filled}
          total={subProgress.total}
          label="Subsection Progress"
        />

        {/* Subsection Selector Accordion */}
        <div className="relative bg-white border-b border-slate-100 z-30">
          <button
            type="button"
            onClick={() => setIsAccordionOpen(!isAccordionOpen)}
            className="w-full px-5 py-3.5 flex justify-between items-center text-left hover:bg-slate-50/50 transition-colors cursor-pointer"
          >
            <span className="text-[14px] font-bold text-[#F98A15] tracking-tight">
              {currentSubObj?.label}
            </span>
            <ChevronDownIcon
              className={`w-5 h-5 text-slate-500 transition-transform duration-350 ${isAccordionOpen ? 'rotate-180' : ''
                }`}
            />
          </button>

          {isAccordionOpen && (
            <div className="absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-xl z-40 divide-y divide-slate-100 animate-slide-down">
              {subsections.map((sub) => {
                const isActive = sub.id === currentSubsection;
                const isCompleted = sub.status === 'valid';
                const hasErrors = sub.status === 'invalid';

                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => {
                      setCurrentSubsection(sub.id);
                      setIsAccordionOpen(false);
                      setErrors({});
                      const container = document.getElementById('audit-form-container');
                      if (container) container.scrollTo({ top: 0 });
                    }}
                    className={`w-full px-5 py-3 flex items-center justify-between text-[13px] transition-all hover:bg-slate-50 cursor-pointer ${isActive ? 'font-bold text-[#F98A15] bg-[#FFF4E8]/20' : 'text-slate-700 font-medium'
                      }`}
                  >
                    <span>{sub.label}</span>
                    <div className="flex items-center gap-2">
                      {isCompleted && (
                        <span className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                          <CheckIcon className="w-3.5 h-3.5 text-white" />
                        </span>
                      )}
                      {hasErrors && (
                        <span className="w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center">
                          <ExclamationCircleIcon className="w-3.5 h-3.5 text-white" />
                        </span>
                      )}
                      {isActive && (
                        <span className="text-[10px] uppercase font-black tracking-wider text-[#F98A15] bg-[#FFF4E8] px-2 py-0.5 rounded">
                          Active
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div id="audit-form-container" className="flex-1 overflow-y-auto scrollbar-none pb-28">
          <div className="transition-all duration-300 ease-in-out pt-3 bg-white px-5 pt-2 pb-6">
            <FormRenderer
              schema={SUBSECTION_SCHEMAS[currentSubsection]}
              formData={formData}
              errors={errors}
              onChange={handleFieldChange}
              useAccordions={true}
            />
          </div>
        </div>

        {/* Action Footer */}
        <div className="bg-white border-t border-slate-200 p-4 pb-safe z-10 shrink-0 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
          <div className="flex gap-3">
            <button
              onClick={handlePrevClick}
              className="px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-all active:scale-95 cursor-pointer"
            >
              {isFirst ? 'Exit' : 'Previous'}
            </button>
            <button
              onClick={handleNextClick}
              className="flex-1 bg-slate-800 hover:bg-slate-900 text-white text-sm font-bold rounded-xl shadow-lg shadow-slate-900/20 transition-all active:scale-95 cursor-pointer"
            >
              {currentSubsection === STEPS[STEPS.length - 1]?.id ? 'Submit Audit' : 'Save & Next'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full w-full absolute inset-0 bg-white z-0">
      {viewMode === 'index' ? (
        renderIndexView()
      ) : (
        renderFormView()
      )}

      {/* Premium Success Overlay */}
      {showSuccessOverlay && (
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-6 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 text-center max-w-sm w-full shadow-2xl border border-slate-100/50 scale-100 transition-transform duration-300">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
              <CheckIcon className="w-8 h-8 text-emerald-500" />
            </div>
            <h4 className="text-lg font-bold text-slate-800 mb-1 leading-tight">
              Network Audit Saved
            </h4>
            <p className="text-xs text-slate-400 font-bold mb-6">
              The network system audit has been completed and verified successfully.
            </p>
            <button
              type="button"
              onClick={() => navigate('..')}
              className="w-full py-3.5 bg-[#F98A15] hover:bg-[#e07b0f] text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all text-[14px] cursor-pointer"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
