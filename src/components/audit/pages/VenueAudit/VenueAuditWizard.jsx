import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuditWizard } from '../../hooks/useAuditWizard';
import Header from '../../components/Header';
import BottomNav from '../../components/BottomNav';
import AuditIndex from '../../components/AuditIndex';
import ProgressBar from '../../components/ProgressBar';
import LiveProgressBar from '../../components/LiveProgressBar';
import FormRenderer from '../../components/FormRenderer';
import VenueSelectPage from '../../components/VenueSelectPage';
import AuditSuccessOverlay from '../../components/AuditSuccessOverlay';
import SubsectionAccordion from '../../components/SubsectionAccordion';
import {
  VENUE_REPORT_INFO_SCHEMA,
  VENUE_PERSONNEL_INFO_SCHEMA,
  LOCATION_DETAILS_SCHEMA,
  CONTACT_DETAILS_SCHEMA,
  ACCESSIBILITY_DETAILS_SCHEMA,
  ADMINISTRATIVE_DETAILS_SCHEMA,
  SYSTEM_DETAILS_SCHEMA,
  LAB_DETAILS_SCHEMA,
  CCTV_DETAILS_SCHEMA,
  CONCLUSION_SCHEMA
} from './schemas/auditSchemas';
import { 
  CheckIcon, 
  ChevronDownIcon, 
  ExclamationCircleIcon,
  BuildingIcon,
  DocumentIcon,
  GlobeIcon,
  CogIcon,
  UserIcon
} from '../../components/Icons';
import {
  generateInitialState,
  validateSchema,
  isSchemaEmpty,
  calculateSchemaProgress,
  calculateGlobalProgress
} from './services/venueAuditService';
import { updateFullAuditRecord } from '../../services/venueService';

const SUBSECTION_SCHEMAS = {
  'ReportInfo': VENUE_REPORT_INFO_SCHEMA,
  'PersonnelInfo': VENUE_PERSONNEL_INFO_SCHEMA,
  'A.1': LOCATION_DETAILS_SCHEMA,
  'A.2': CONTACT_DETAILS_SCHEMA,
  'A.3': ACCESSIBILITY_DETAILS_SCHEMA,
  'A.4': ADMINISTRATIVE_DETAILS_SCHEMA,
  'B.1': SYSTEM_DETAILS_SCHEMA,
  'B.3': LAB_DETAILS_SCHEMA,
  'B.4': CCTV_DETAILS_SCHEMA,
  'Conclusion': CONCLUSION_SCHEMA
};

const STEPS = [
  { id: 'ReportInfo' },
  { id: 'PersonnelInfo' },
  { id: 'A.1' },
  { id: 'A.2' },
  { id: 'A.3' },
  { id: 'A.4' },
  { id: 'B.1' },
  { id: 'B.3' },
  { id: 'B.4' },
  { id: 'Conclusion' }
];

const SECTION_TO_PAYLOAD_KEY = {
  'ReportInfo': 'report',
  'PersonnelInfo': 'auditeeAuditor',
  'A.1': 'venue',
  'A.2': 'venue',
  'A.3': 'accessibility',
  'A.4': 'administrativeDetails',
  'B.1': 'systemDetails',
  'B.3': 'labDetails',
  'B.4': 'cctvDetails',
  'Conclusion': 'conclusion'
};

// Initialize dynamically from schemas
const INITIAL_AUDIT_STATE = generateInitialState(SUBSECTION_SCHEMAS);

export default function VenueAuditWizard() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialVenue = location.state?.venue || null;
  const odooData = location.state?.odooData || null;

  const [viewMode, setViewMode] = useState('index');
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

  const {
    currentSubsection, setCurrentSubsection,
    control, getValues, watch, setValue,
    errors,
    isInitializing,
    getSectionStatus,
    handleSectionSelect,
    handleNextClick, handlePrevClick
  } = useAuditWizard({
    schemas: SUBSECTION_SCHEMAS,
    steps: STEPS,
    initialStateGenerator: (schemas) => generateInitialState(schemas, odooData),
    validateSchema,
    isSchemaEmpty,
    calculateGlobalProgress,
    initialVenue,
    auditName: 'Venue Audit Report',
    nextAuditMonths: 3,
    apiSyncFunction: updateFullAuditRecord,
    sectionToPayloadKey: SECTION_TO_PAYLOAD_KEY,
    onComplete: () => setShowSuccessOverlay(true),
    onExitForm: () => setViewMode('index')
  });



  // Get current form data for status checks (doesn't trigger re-render on keystrokes)
  const currentData = getValues();
  const progressPercent = calculateGlobalProgress(SUBSECTION_SCHEMAS, currentData);

  const statusReportInfo = getSectionStatus('ReportInfo', currentData);
  const statusPersonnel = getSectionStatus('PersonnelInfo', currentData);
  const statusA1 = getSectionStatus('A.1', currentData);
  const statusA2 = getSectionStatus('A.2', currentData);
  const statusA3 = getSectionStatus('A.3', currentData);
  const statusA4 = getSectionStatus('A.4', currentData);
  const statusB1 = getSectionStatus('B.1', currentData);
  const statusB3 = getSectionStatus('B.3', currentData);
  const statusB4 = getSectionStatus('B.4', currentData);
  const statusConclusion = getSectionStatus('Conclusion', currentData);

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#4ecdc4] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white/50 text-sm">Loading Draft...</p>
        </div>
      </div>
    );
  }

  // Rendering Helpers
  const renderIndexView = () => {
    const getItemsCount = (sectionId) => {
      const { total } = calculateSchemaProgress(SUBSECTION_SCHEMAS[sectionId], getValues());
      return `${total} items`;
    };

    const auditGroups = [
      {
        title: 'PREFATORY AUDIT',
        sections: [
          { id: 'ReportInfo', title: '1. Report Information', itemsCount: getItemsCount('ReportInfo'), status: statusReportInfo, icon: DocumentIcon },
          { id: 'PersonnelInfo', title: '2. Auditee & Auditor Information', itemsCount: getItemsCount('PersonnelInfo'), status: statusPersonnel, icon: UserIcon }
        ]
      },
      {
        title: 'PART A. VENUE DETAILS',
        sections: [
          { id: 'A.1', title: 'A.1 Location Details', itemsCount: getItemsCount('A.1'), status: statusA1, icon: GlobeIcon },
          { id: 'A.2', title: 'A.2 Contact Details', itemsCount: getItemsCount('A.2'), status: statusA2, icon: UserIcon },
          { id: 'A.3', title: 'A.3 Accessibility Details', itemsCount: getItemsCount('A.3'), status: statusA3, icon: DocumentIcon },
          { id: 'A.4', title: 'A.4 Administrative Details', itemsCount: getItemsCount('A.4'), status: statusA4, icon: BuildingIcon }
        ]
      },
      {
        title: 'PART B. SYSTEM DETAILS',
        sections: [
          { id: 'B.1', title: 'B.1 System Overview & Count', itemsCount: getItemsCount('B.1'), status: statusB1, icon: CogIcon },
          { id: 'B.3', title: 'B.3 Lab Details', itemsCount: getItemsCount('B.3'), status: statusB3, icon: BuildingIcon },
          { id: 'B.4', title: 'B.4 CCTV Details', itemsCount: getItemsCount('B.4'), status: statusB4, icon: CogIcon }
        ]
      },
      {
        title: 'CONCLUSION',
        sections: [
          { id: 'Conclusion', title: 'Final Review & Signatures', itemsCount: getItemsCount('Conclusion'), status: statusConclusion, icon: DocumentIcon }
        ]
      }
    ];

    return (
      <div className="flex flex-col h-full w-full relative">
        <Header 
          title="Venue Assessment" 
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
    const subProgress = calculateSchemaProgress(SUBSECTION_SCHEMAS[currentSubsection], getValues());
    
    // Header pill
    const currentIndex = STEPS.findIndex(s => s.id === currentSubsection) + 1;
    const stepPill = (
      <span className="text-[11px] font-black text-[#ff6b6b] bg-[#ff6b6b]/20 px-2.5 py-1 rounded-full">
        {currentIndex} / {STEPS.length}
      </span>
    );

    const subsections = [
      { id: 'ReportInfo', label: '1. Report Information', status: statusReportInfo },
      { id: 'PersonnelInfo', label: '2. Auditee & Auditor Information', status: statusPersonnel },
      { id: 'A.1', label: 'A.1 Location Details', status: statusA1 },
      { id: 'A.2', label: 'A.2 Contact Details', status: statusA2 },
      { id: 'A.3', label: 'A.3 Accessibility Details', status: statusA3 },
      { id: 'A.4', label: 'A.4 Administrative Details', status: statusA4 },
      { id: 'B.1', label: 'B.1 System Details', status: statusB1 },
      { id: 'B.3', label: 'B.3 Lab Details', status: statusB3 },
      { id: 'B.4', label: 'B.4 CCTV Details', status: statusB4 },
      { id: 'Conclusion', label: 'Conclusion', status: statusConclusion }
    ];

    const currentSubObj = subsections.find(s => s.id === currentSubsection);

    return (
      <div className="flex flex-col h-full w-full relative bg-transparent">
        <Header 
          title="Venue Audit Details" 
          showBack={true} 
          onBackClick={() => {
            setViewMode('index');
            setIsAccordionOpen(false);
          }} 
          headerRight={stepPill}
        />
        
        {/* Subsection Progress Indicator (Sticky) */}
        <LiveProgressBar 
          schema={SUBSECTION_SCHEMAS[currentSubsection]}
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
              schema={SUBSECTION_SCHEMAS[currentSubsection]}
              control={control}
              errors={errors}
              watch={watch}
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
            <button
              onClick={handleNextClick}
              className="flex-1 bg-[#ff6b6b] hover:bg-rose-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-rose-900/20 transition-all active:scale-95 cursor-pointer"
            >
              {currentSubsection === STEPS[STEPS.length - 1]?.id ? 'Submit Audit' : 'Save & Next'}
            </button>
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
        title="Audit Assessment Saved"
        message="The venue assessment has been completed and verified successfully."
      />
    </div>
  );
}
