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
  POWER_REPORT_INFO_SCHEMA,
  POWER_VENUE_INFO_SCHEMA,
  POWER_SECTION_1_SCHEMA,
  POWER_SECTION_2_SCHEMA,
  POWER_SECTION_3_SCHEMA,
  POWER_SECTION_4_SCHEMA,
  POWER_SECTION_5_SCHEMA,
  POWER_SECTION_6_SCHEMA,
  POWER_SECTION_7_SCHEMA,
  POWER_SECTION_8_SCHEMA,
  POWER_SECTION_9_SCHEMA,
  POWER_SECTION_10_SCHEMA,
  POWER_PERSONNEL_INFO_SCHEMA
} from './schemas/powerAuditSchemas';
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
} from './services/powerAuditService';

const SUBSECTION_SCHEMAS = {
  'ReportInfo': POWER_REPORT_INFO_SCHEMA,
  'VenueInfo': POWER_VENUE_INFO_SCHEMA,
  'PersonnelInfo': POWER_PERSONNEL_INFO_SCHEMA,
  'Section1': POWER_SECTION_1_SCHEMA,
  'Section2': POWER_SECTION_2_SCHEMA,
  'Section3': POWER_SECTION_3_SCHEMA,
  'Section4': POWER_SECTION_4_SCHEMA,
  'Section5': POWER_SECTION_5_SCHEMA,
  'Section6': POWER_SECTION_6_SCHEMA,
  'Section7': POWER_SECTION_7_SCHEMA,
  'Section8': POWER_SECTION_8_SCHEMA,
  'Section9': POWER_SECTION_9_SCHEMA,
  'Section10': POWER_SECTION_10_SCHEMA
};

const STEPS = [
  { id: 'ReportInfo' },
  { id: 'VenueInfo' },
  { id: 'PersonnelInfo' },
  { id: 'Section1' },
  { id: 'Section2' },
  { id: 'Section3' },
  { id: 'Section4' },
  { id: 'Section5' },
  { id: 'Section6' },
  { id: 'Section7' },
  { id: 'Section8' },
  { id: 'Section9' },
  { id: 'Section10' }
];

// Initialize dynamically from schemas
const INITIAL_POWER_AUDIT_STATE = generateInitialState(SUBSECTION_SCHEMAS);

export default function PowerAuditWizard() {
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
    auditName: 'Venue Power Audit Report',
    nextAuditMonths: 3
  });

  const statusReportInfo = getSectionStatus('ReportInfo');
  const statusVenue = getSectionStatus('VenueInfo');
  const statusPersonnel = getSectionStatus('PersonnelInfo');
  const statusSec1 = getSectionStatus('Section1');
  const statusSec2 = getSectionStatus('Section2');
  const statusSec3 = getSectionStatus('Section3');
  const statusSec4 = getSectionStatus('Section4');
  const statusSec5 = getSectionStatus('Section5');
  const statusSec6 = getSectionStatus('Section6');
  const statusSec7 = getSectionStatus('Section7');
  const statusSec8 = getSectionStatus('Section8');
  const statusSec9 = getSectionStatus('Section9');
  const statusSec10 = getSectionStatus('Section10');

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
      const { total } = calculateSchemaProgress(SUBSECTION_SCHEMAS[sectionId], formData);
      return `${total} items`;
    };

    const auditGroups = [
      {
        title: 'PREFATORY AUDIT',
        sections: [
          { id: 'ReportInfo', title: '1. Report Information', itemsCount: getItemsCount('ReportInfo'), status: statusReportInfo, icon: DocumentIcon },
          { id: 'VenueInfo', title: '2. Venue Information', itemsCount: getItemsCount('VenueInfo'), status: statusVenue, icon: BuildingIcon },
          { id: 'PersonnelInfo', title: '3. Auditee & Auditor Information', itemsCount: getItemsCount('PersonnelInfo'), status: statusPersonnel, icon: UserIcon },
          { id: 'Section1', title: '4. Supply Transformer', itemsCount: getItemsCount('Section1'), status: statusSec1, icon: BuildingIcon },
          { id: 'Section2', title: '5. Mains Supply/ LT panel checks', itemsCount: getItemsCount('Section2'), status: statusSec2, icon: BuildingIcon },
          { id: 'Section3', title: '6. Diesel Generator', itemsCount: getItemsCount('Section3'), status: statusSec3, icon: BuildingIcon },
          { id: 'Section4', title: '7. DG Running checks', itemsCount: getItemsCount('Section4'), status: statusSec4, icon: BuildingIcon },
          { id: 'Section5', title: '8. UPS (Uninterruptible Power Supply)', itemsCount: getItemsCount('Section5'), status: statusSec5, icon: BuildingIcon },
          { id: 'Section6', title: '9. UPS Batteries', itemsCount: getItemsCount('Section6'), status: statusSec6, icon: BuildingIcon },
          { id: 'Section7', title: '10. Equipment functionality checks', itemsCount: getItemsCount('Section7'), status: statusSec7, icon: BuildingIcon },
          { id: 'Section8', title: '11. Maintenance Records checks', itemsCount: getItemsCount('Section8'), status: statusSec8, icon: BuildingIcon },
          { id: 'Section9', title: '12. Electrician, Tools & Spares', itemsCount: getItemsCount('Section9'), status: statusSec9, icon: BuildingIcon },
          { id: 'Section10', title: '13. Nameplate & Documentation', itemsCount: getItemsCount('Section10'), status: statusSec10, icon: BuildingIcon }
        ]
      }
    ];

    return (
      <div className="flex flex-col h-full w-full relative">
        <Header 
          title="Power System Assessment" 
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
      <span className="text-[11px] font-black text-[#ff6b6b] bg-[#ff6b6b]/20 px-2.5 py-1 rounded-full">
        {currentIndex} / {STEPS.length}
      </span>
    );

    const subsections = [
      { id: 'ReportInfo', label: '1. Report Information', status: statusReportInfo },
      { id: 'VenueInfo', label: '2. Venue Information', status: statusVenue },
      { id: 'PersonnelInfo', label: '3. Auditee & Auditor Information', status: statusPersonnel },
      { id: 'Section1', label: '4. Supply Transformer', status: statusSec1 },
      { id: 'Section2', label: '5. Mains Supply/ LT panel checks', status: statusSec2 },
      { id: 'Section3', label: '6. Diesel Generator', status: statusSec3 },
      { id: 'Section4', label: '7. DG Running checks', status: statusSec4 },
      { id: 'Section5', label: '8. UPS (Uninterruptible Power Supply)', status: statusSec5 },
      { id: 'Section6', label: '9. UPS Batteries', status: statusSec6 },
      { id: 'Section7', label: '10. Equipment functionality checks', status: statusSec7 },
      { id: 'Section8', label: '11. Maintenance Records checks', status: statusSec8 },
      { id: 'Section9', label: '12. Electrician, Tools & Spares', status: statusSec9 },
      { id: 'Section10', label: '13. Nameplate & Documentation', status: statusSec10 }
    ];

    const currentSubObj = subsections.find(s => s.id === currentSubsection);

    return (
      <div className="flex flex-col h-full w-full relative bg-transparent">
        <Header 
          title="Power Audit Details" 
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
        <div className="relative bg-transparent border-b border-white/10 z-30">
          <button
            type="button"
            onClick={() => setIsAccordionOpen(!isAccordionOpen)}
            className="w-full px-5 py-3.5 flex justify-between items-center text-left hover:bg-white/5 transition-colors cursor-pointer"
          >
            <span className="text-[14px] font-bold text-white tracking-tight">
              {currentSubObj?.label}
            </span>
            <ChevronDownIcon 
              className={`w-5 h-5 text-white/50 transition-transform duration-350 ${
                isAccordionOpen ? 'rotate-180' : ''
              }`} 
            />
          </button>

          {isAccordionOpen && (
            <div className="absolute top-full left-0 right-0 bg-[#0F0F23] border-b border-white/20 shadow-2xl z-40 divide-y divide-white/10 animate-slide-down">
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
                    className={`w-full px-5 py-3 flex items-center justify-between text-[13px] transition-all hover:bg-white/5 cursor-pointer ${
                      isActive ? 'font-bold text-white bg-white/10' : 'text-white/70 font-medium'
                    }`}
                  >
                    <span>{sub.label}</span>
                    <div className="flex items-center gap-2">
                      {isCompleted && (
                        <span className="w-5 h-5 bg-[#4ecdc4] rounded-full flex items-center justify-center">
                          <CheckIcon className="w-3.5 h-3.5 text-white" />
                        </span>
                      )}
                      {hasErrors && (
                        <span className="w-5 h-5 bg-[#ff6b6b] rounded-full flex items-center justify-center">
                          <ExclamationCircleIcon className="w-3.5 h-3.5 text-white" />
                        </span>
                      )}
                      {isActive && (
                        <span className="text-[10px] uppercase font-black tracking-wider text-[#ff6b6b] bg-[#ff6b6b]/20 px-2 py-0.5 rounded">
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
          <div className="transition-all duration-300 ease-in-out pt-3 bg-transparent px-5 pt-2 pb-6">
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
              {currentSubsection === 'Section10' ? 'Submit Audit' : 'Save & Next'}
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
      {showSuccessOverlay && (
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-6 animate-fade-in">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 text-center max-w-sm w-full shadow-2xl border border-white/20 scale-100 transition-transform duration-300">
            <div className="w-16 h-16 bg-[#4ecdc4]/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#4ecdc4]/40">
              <CheckIcon className="w-8 h-8 text-[#4ecdc4]" />
            </div>
            <h4 className="text-lg font-bold text-white mb-1 leading-tight">
              Power Audit Saved
            </h4>
            <p className="text-xs text-white/50 font-bold mb-6">
              The power system audit has been completed and verified successfully.
            </p>
            <button
              type="button"
              onClick={() => navigate('..')}
              className="w-full py-3.5 bg-[#ff6b6b] hover:bg-rose-600 text-white font-bold rounded-xl shadow-lg shadow-rose-900/20 active:scale-[0.98] transition-all text-[14px] cursor-pointer"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
