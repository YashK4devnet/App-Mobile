import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuditWizard } from '../../hooks/useAuditWizard';
import Header from '../../components/Header';
import BottomNav from '../../components/BottomNav';
import AuditIndex from '../../components/AuditIndex';
import ProgressBar from '../../components/ProgressBar';
import LiveProgressBar from '../../components/LiveProgressBar';
import FormRenderer from '../../components/FormRenderer';
import AuditSuccessOverlay from '../../components/AuditSuccessOverlay';
import SubsectionAccordion from '../../components/SubsectionAccordion';
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
  NETWORK_OBSERVATIONS_SCHEMA,
  NETWORK_SIGNATURES_SCHEMA
} from './schemas/networkAuditSchemas';
import { generateNetworkQuestionsSchema } from './schemas/schemaGenerator';
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
  calculateGlobalProgress,
  saveNetworkSection
} from './services/networkAuditService';

const STATIC_SUBSECTION_SCHEMAS = {
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
  { id: 'NetworkSecurityCompliance' },
  { id: 'PhotoEvidence' },
  { id: 'Observations' }
];

const SECTION_TO_PAYLOAD_KEY = {
  'ReportInfo': 'report',
  'VenueInfo': 'venue',
  'PersonnelInfo': 'auditeeAuditor',
  'NetworkArchitecture': 'networkArchitecture',
  'PublicNetworkHardening': 'publicNetworkHardening',
  'NetworkInfrastructure': 'networkInfrastructure',
  'WanInfrastructure': 'wanInfrastructure',
  'SystemConfiguration': 'systemConfiguration',
  'NetworkConfiguration': 'networkConfiguration',
  'BackupDevices': 'backupDevices',
  'NetworkSecurityCompliance': 'networkSecurityCompliance',
  'NetworkSecurityCompliance': 'networkSecurityCompliance',
  'PhotoEvidence': 'photoEvidence',
  'Observations': 'observations'
};

// Removed static initialization: const INITIAL_NETWORK_AUDIT_STATE = generateInitialState(SUBSECTION_SCHEMAS);

export default function NetworkAuditWizard() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialVenue = location.state?.venue || null;
  const odooData = location.state?.odooData || null; // Access payload from route state if passed

  const [viewMode, setViewMode] = useState('index');
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

  const dynamicSchemas = React.useMemo(() => {
    if (odooData) {
      return {
        'ReportInfo': NETWORK_REPORT_INFO_SCHEMA,
        'VenueInfo': NETWORK_VENUE_INFO_SCHEMA,
        'PersonnelInfo': NETWORK_PERSONNEL_INFO_SCHEMA,
        'NetworkArchitecture': generateNetworkQuestionsSchema(odooData.networkArchitectureLines || odooData.network_architecture_lines, 'network_architecture_lines'),
        'PublicNetworkHardening': generateNetworkQuestionsSchema(odooData.publicNetworkHardingLines || odooData.public_network_harding_lines, 'public_network_harding_line'),
        'NetworkInfrastructure': generateNetworkQuestionsSchema(odooData.networkInfrastructureLines || odooData.network_infrastructure_lines, 'network_infrastructure_lines'),
        'WanInfrastructure': generateNetworkQuestionsSchema(odooData.wanInfraLines || odooData.wan_infra_lines, 'wan_infra_lines'),
        'SystemConfiguration': generateNetworkQuestionsSchema(odooData.systemConfLines || odooData.system_conf_lines, 'system_conf_lines'),
        'NetworkConfiguration': generateNetworkQuestionsSchema(odooData.networkConfLines || odooData.network_conf_lines, 'network_conf_lines'),
        'BackupDevices': generateNetworkQuestionsSchema(odooData.backupDeviceLines || odooData.backup_device_lines, 'backup_device_lines'),
        'NetworkSecurityCompliance': generateNetworkQuestionsSchema(odooData.securityComplianceLines || odooData.security_compliance_lines, 'security_compliance_lines'),
        'PhotoEvidence': NETWORK_PHOTO_EVIDENCE_SCHEMA,
        'PhotoEvidence': NETWORK_PHOTO_EVIDENCE_SCHEMA,
        'Observations': NETWORK_OBSERVATIONS_SCHEMA
      };
    }
    return STATIC_SUBSECTION_SCHEMAS;
  }, [odooData]);

  const {
    currentSubsection, setCurrentSubsection,
    control, getValues, watch, setValue,
    errors,
    isInitializing,
    isReadOnly,
    getSectionStatus,
    handleSectionSelect,
    handleNextClick, handlePrevClick
  } = useAuditWizard({
    schemas: dynamicSchemas,
    steps: STEPS,
    initialStateGenerator: (schemas) => generateInitialState(schemas, odooData),
    validateSchema,
    isSchemaEmpty,
    calculateGlobalProgress,
    initialVenue,
    auditName: 'Networking Audit Report',
    nextAuditMonths: 3,
    saveSectionData: saveNetworkSection,
    sectionToPayloadKey: SECTION_TO_PAYLOAD_KEY,
    onComplete: () => setShowSuccessOverlay(true),
    onExitForm: () => setViewMode('index')
  });

  const currentData = getValues ? getValues() : {};
  
  // Safe calculation to prevent errors during schema load
  const progressPercent = dynamicSchemas && currentData
    ? calculateGlobalProgress(dynamicSchemas, currentData)
    : 0;

  const statusReportInfo = getSectionStatus('ReportInfo', currentData);
  const statusVenue = getSectionStatus('VenueInfo', currentData);
  const statusPersonnel = getSectionStatus('PersonnelInfo', currentData);
  const statusNetworkArchitecture = getSectionStatus('NetworkArchitecture', currentData);
  const statusPublicNetworkHardening = getSectionStatus('PublicNetworkHardening', currentData);
  const statusNetworkInfrastructure = getSectionStatus('NetworkInfrastructure', currentData);
  const statusWanInfrastructure = getSectionStatus('WanInfrastructure', currentData);
  const statusSystemConfiguration = getSectionStatus('SystemConfiguration', currentData);
  const statusNetworkConfiguration = getSectionStatus('NetworkConfiguration', currentData);
  const statusBackupDevices = getSectionStatus('BackupDevices', currentData);
  const statusNetworkSecurityCompliance = getSectionStatus('NetworkSecurityCompliance', currentData);
  const statusPhotoEvidence = getSectionStatus('PhotoEvidence', currentData);
  const statusObservations = getSectionStatus('Observations', currentData);
  const statusSignatures = getSectionStatus('Signatures', currentData);

  if (isInitializing || !dynamicSchemas) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#4ecdc4] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white/50 text-sm">Loading Data...</p>
        </div>
      </div>
    );
  }

  // Rendering Helpers
  const renderIndexView = () => {
    const getItemsCount = (sectionId) => {
      const { total } = calculateSchemaProgress(dynamicSchemas[sectionId], currentData);
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
          { id: 'Observations', title: '13. Observations & Signatures', itemsCount: getItemsCount('Observations'), status: statusObservations, icon: DocumentIcon }
        ]
      }
    ];

    return (
      <div className="flex flex-col h-full w-full relative animate-fade-in">
        <Header 
          title="Network System Assessment" 
          showBack={true} 
          onBackClick={() => navigate(-1)} 
        />
        <div className="flex-1 overflow-hidden">
          <AuditIndex
            groups={auditGroups}
            onSectionSelect={(sectionId) => {
              handleSectionSelect(sectionId);
              setViewMode('form');
            }}
            progressPercent={progressPercent}
          />
        </div>
        <BottomNav />
      </div>
    );
  };

  const renderFormView = () => {
    const isFirst = currentSubsection === 'ReportInfo';
    const subProgress = calculateSchemaProgress(dynamicSchemas[currentSubsection], currentData);
    
    // Header pill
    const currentIndex = STEPS.findIndex(s => s.id === currentSubsection) + 1;
    const stepPill = (
      <span className="text-[11px] font-black text-[#ff6b6b] bg-[#ff6b6b]/20 px-2.5 py-1 rounded-full">
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
      { id: 'Observations', label: '13. Observations & Signatures', status: statusObservations }
    ];

    const currentSubObj = subsections.find(s => s.id === currentSubsection);

    return (
      <div className="flex flex-col h-full w-full relative bg-transparent">
        <Header 
          title="Network Audit Details" 
          showBack={true} 
          onBackClick={() => {
            setViewMode('index');
            setIsAccordionOpen(false);
          }} 
          headerRight={stepPill}
        />
        
        {isReadOnly && (
          <div className="mx-5 mt-4 px-4 py-3 bg-rose-500/10 border border-rose-500/25 rounded-xl flex items-start gap-3 shrink-0 animate-fade-in">
            <ExclamationCircleIcon className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-rose-200 text-[13px] font-semibold leading-tight">Read-Only Mode</p>
              <p className="text-rose-200/70 text-[12px] mt-0.5">This report has been finalized and cannot be edited.</p>
            </div>
          </div>
        )}

        {/* Subsection Progress Indicator (Sticky) */}
        <LiveProgressBar 
          schema={dynamicSchemas[currentSubsection]}
          control={control}
          calculateProgressFn={calculateSchemaProgress}
        />

        {/* Subsection Selector Accordion */}
        <SubsectionAccordion 
          subsections={subsections}
          currentSubsection={currentSubsection}
          isOpen={isAccordionOpen}
          onToggle={() => setIsAccordionOpen(!isAccordionOpen)}
          onSelect={(subId) => {
            setCurrentSubsection(subId);
            setIsAccordionOpen(false);
            const container = document.getElementById('audit-form-container');
            if (container) container.scrollTo({ top: 0 });
          }}
        />

        <div id="audit-form-container" className="flex-1 overflow-y-auto scrollbar-none pb-28">
          {/* Form Content */}
          <div className="transition-all duration-300 ease-in-out pt-3 bg-transparent px-5 pt-2 pb-6">
            <FormRenderer
              schema={dynamicSchemas[currentSubsection]}
              control={control}
              errors={errors}
              useAccordions={true}
              watch={watch}
              globalDisabled={isReadOnly}
            />
          </div>
        </div>

        {/* Action Footer */}
        <div className="bg-white/5 backdrop-blur-md border-t border-white/10 p-4 pb-safe z-10 shrink-0">
          <div className="flex gap-3">
            <button
              onClick={handlePrevClick}
              className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-xl transition-all active:scale-95 cursor-pointer"
            >
              {isFirst ? 'Exit' : 'Previous'}
            </button>
            {!isReadOnly ? (
              <button
                onClick={handleNextClick}
                className="flex-1 bg-[#ff6b6b] hover:bg-rose-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-rose-900/20 transition-all active:scale-95 cursor-pointer"
              >
                {currentSubsection === STEPS[STEPS.length - 1]?.id ? 'Submit Audit' : 'Save & Next'}
              </button>
            ) : (
              <button
                onClick={handleNextClick}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-xl transition-all active:scale-95 cursor-pointer"
              >
                {currentSubsection === STEPS[STEPS.length - 1]?.id ? 'Exit' : 'Next'}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full w-full absolute inset-0 bg-transparent z-0">
      {viewMode === 'index' ? (
        renderIndexView()
      ) : (
        renderFormView()
      )}

      {/* Premium Success Overlay */}
      <AuditSuccessOverlay 
        show={showSuccessOverlay} 
        title="Network Audit Saved"
        message="The network system audit has been completed and verified successfully."
      />
    </div>
  );
}
