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
  VENUE_REPORT_INFO_SCHEMA,
  VENUE_PERSONNEL_INFO_SCHEMA,
  LOCATION_DETAILS_SCHEMA,
  CONTACT_DETAILS_SCHEMA,
  ACCESSIBILITY_DETAILS_SCHEMA,
  ADMINISTRATIVE_DETAILS_SCHEMA,
  SYSTEM_DETAILS_SCHEMA,
  LAB_DETAILS_SCHEMA,
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

const SUBSECTION_SCHEMAS = {
  'ReportInfo': VENUE_REPORT_INFO_SCHEMA,
  'PersonnelInfo': VENUE_PERSONNEL_INFO_SCHEMA,
  'A.1': LOCATION_DETAILS_SCHEMA,
  'A.2': CONTACT_DETAILS_SCHEMA,
  'A.3': ACCESSIBILITY_DETAILS_SCHEMA,
  'A.4': ADMINISTRATIVE_DETAILS_SCHEMA,
  'B.1': SYSTEM_DETAILS_SCHEMA,
  'B.3': LAB_DETAILS_SCHEMA,
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
  { id: 'Conclusion' }
];

// Initialize dynamically from schemas
const INITIAL_AUDIT_STATE = generateInitialState(SUBSECTION_SCHEMAS);

export default function VenueAuditWizard() {
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
    auditName: 'Venue Audit Report',
    nextAuditMonths: 3
  });

  // Set default datetime to now if empty on mount
  useEffect(() => {
    if (!formData.auditDateTime) {
      const now = new Date();
      const offset = now.getTimezoneOffset() * 60000;
      const localISOTime = (new Date(now - offset)).toISOString().slice(0, 16);
      setFormData(prev => {
        if (!prev.auditDateTime) {
          return { ...prev, auditDateTime: localISOTime };
        }
        return prev;
      });
    }
  }, []);

  const statusReportInfo = getSectionStatus('ReportInfo');
  const statusPersonnel = getSectionStatus('PersonnelInfo');
  const statusA1 = getSectionStatus('A.1');
  const statusA2 = getSectionStatus('A.2');
  const statusA3 = getSectionStatus('A.3');
  const statusA4 = getSectionStatus('A.4');
  const statusB1 = getSectionStatus('B.1');
  const statusB3 = getSectionStatus('B.3');
  const statusConclusion = getSectionStatus('Conclusion');

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
          { id: 'B.3', title: 'B.3 Lab Details', itemsCount: getItemsCount('B.3'), status: statusB3, icon: BuildingIcon }
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
      { id: 'PersonnelInfo', label: '2. Auditee & Auditor Information', status: statusPersonnel },
      { id: 'A.1', label: 'A.1 Location Details', status: statusA1 },
      { id: 'A.2', label: 'A.2 Contact Details', status: statusA2 },
      { id: 'A.3', label: 'A.3 Accessibility Details', status: statusA3 },
      { id: 'A.4', label: 'A.4 Administrative Details', status: statusA4 },
      { id: 'B.1', label: 'B.1 System Details', status: statusB1 },
      { id: 'B.3', label: 'B.3 Lab Details', status: statusB3 },
      { id: 'Conclusion', label: 'Conclusion', status: statusConclusion }
    ];

    const currentSubObj = subsections.find(s => s.id === currentSubsection);

    return (
      <div className="flex flex-col h-full w-full relative bg-white">
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
              className={`w-5 h-5 text-slate-500 transition-transform duration-350 ${
                isAccordionOpen ? 'rotate-180' : ''
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
                    className={`w-full px-5 py-3 flex items-center justify-between text-[13px] transition-all hover:bg-slate-50 cursor-pointer ${
                      isActive ? 'font-bold text-[#F98A15] bg-[#FFF4E8]/20' : 'text-slate-700 font-medium'
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
          {/* Form Content */}
          <div className="transition-all duration-300 ease-in-out pt-3 bg-white px-5 pt-2 pb-6">
            <FormRenderer
              schema={SUBSECTION_SCHEMAS[currentSubsection]}
              formData={formData}
              errors={errors}
              onChange={handleFieldChange}
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
              Audit Assessment Saved
            </h4>
            <p className="text-xs text-slate-400 font-bold mb-6">
              The venue assessment has been completed and verified successfully.
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
