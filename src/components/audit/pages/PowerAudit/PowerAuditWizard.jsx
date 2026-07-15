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
  POWER_PERSONNEL_INFO_SCHEMA,
  POWER_SIGNATURES_SCHEMA
} from './schemas/powerAuditSchemas';
import { generatePowerQuestionsSchema } from '../NetworkAudit/schemas/schemaGenerator';
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
  savePowerSection
} from './services/powerAuditService';
import { updateFullAuditRecord } from '../../services/venueService';

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
  'Section10': POWER_SECTION_10_SCHEMA,
  'Signatures': POWER_SIGNATURES_SCHEMA
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
  { id: 'Section10' },
  { id: 'Signatures' }
];

const SECTION_TO_PAYLOAD_KEY = {
  'ReportInfo': 'report',
  'VenueInfo': 'venue',
  'PersonnelInfo': 'auditeeAuditor',
  'Section1': 'section1',
  'Section2': 'section2',
  'Section3': 'section3',
  'Section4': 'section4',
  'Section5': 'section5',
  'Section6': 'section6',
  'Section7': 'section7',
  'Section8': 'section8',
  'Section9': 'section9',
  'Section10': 'section10',
  'Signatures': 'signatures'
};

// Initialize dynamically from schemas
const INITIAL_POWER_AUDIT_STATE = generateInitialState(SUBSECTION_SCHEMAS);

export default function PowerAuditWizard() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialVenue = location.state?.venue || null;

  const [viewMode, setViewMode] = useState('index');
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  
  const odooData = location.state?.odooData || null;

  const dynamicSchemas = odooData ? {
    'ReportInfo': POWER_REPORT_INFO_SCHEMA,
    'VenueInfo': POWER_VENUE_INFO_SCHEMA,
    'PersonnelInfo': POWER_PERSONNEL_INFO_SCHEMA,
    'Section1': [
      { type: 'heading', label: '1. Supply Transformer and Earth Pit', className: 'text-white/50 border-white/10' },
      ...generatePowerQuestionsSchema(odooData.supplyTransferLines || odooData.supply_transfer_lines, 'supply_transfer_lines'),
      { type: 'heading', label: 'Transformer and Earth Pit Questionnaire', className: 'text-[#F98A15] border-[#F98A15]/30 mt-6' },
      ...generatePowerQuestionsSchema(odooData.transferEarthPitLines || odooData.transfer_earth_pit_lines, 'transfer_earth_pit_lines')
    ],
    'Section2': generatePowerQuestionsSchema(odooData.mainSupplyLtPanelLines || odooData.main_supply_lt_panel_lines, 'main_supply_lt_panel_lines'),
    'Section3': [
      { type: 'heading', label: 'Diesel Generator', className: 'text-white/50 border-white/10' },
      ...generatePowerQuestionsSchema(odooData.diselGeneratorLines || odooData.disel_generator_lines, 'disel_generator_lines'),
      { type: 'heading', label: 'DG checks in stop condition checks', className: 'text-[#F98A15] border-[#F98A15]/30 mt-6' },
      ...generatePowerQuestionsSchema(odooData.dgCheckInStopLines || odooData.dg_check_in_stop_lines, 'dg_check_in_stop_lines')
    ],
    'Section4': generatePowerQuestionsSchema(odooData.dgRunningCheckLines || odooData.dg_running_check_lines, 'dg_running_check_lines'),
    'Section5': [
       { type: 'heading', label: 'UPS (Uninterruptible Power Supply)', className: 'text-white/50 border-white/10' },
       ...generatePowerQuestionsSchema(odooData.upsLines || odooData.ups_lines, 'ups_lines'),
       { type: 'heading', label: 'UPS Equipment', className: 'text-[#F98A15] border-[#F98A15]/30 mt-6' },
       ...generatePowerQuestionsSchema(odooData.upsEquipmentLines || odooData.ups_equipment_lines, 'ups_equipment_lines')
    ],
    'Section6': [
       { type: 'heading', label: 'UPS Batteries', className: 'text-white/50 border-white/10' },
       ...generatePowerQuestionsSchema(odooData.upsBatteriesLines || odooData.ups_batteries_lines, 'ups_batteries_lines'),
       { type: 'heading', label: 'Battery System', className: 'text-[#F98A15] border-[#F98A15]/30 mt-6' },
       ...generatePowerQuestionsSchema(odooData.upsBatteriesSystemLines || odooData.ups_batteries_system_lines, 'ups_batteries_system_lines')
    ],
    'Section7': generatePowerQuestionsSchema(odooData.electricalEarthingLines || odooData.electrical_earthing_lines, 'electrical_earthing_lines'),
    'Section8': generatePowerQuestionsSchema(odooData.maintenanceRecordLines || odooData.maintenance_record_lines, 'maintenance_record_lines'),
    'Section9': generatePowerQuestionsSchema(odooData.toolsSparesLines || odooData.tools_spares_lines, 'tools_spares_lines'),
    'Section10': POWER_SECTION_10_SCHEMA,
    'Signatures': POWER_SIGNATURES_SCHEMA
  } : null;
  
  const activeSchemas = dynamicSchemas || SUBSECTION_SCHEMAS;

  const {
    currentSubsection, setCurrentSubsection,
    control, getValues, watch, setValue,
    errors,
    isInitializing,
    getSectionStatus,
    handleSectionSelect,
    handleNextClick, handlePrevClick
  } = useAuditWizard({
    schemas: activeSchemas,
    steps: STEPS,
    initialStateGenerator: (schemas) => generateInitialState(schemas, odooData),
    validateSchema,
    isSchemaEmpty,
    calculateGlobalProgress,
    initialVenue,
    auditName: 'Venue Power Audit Report',
    nextAuditMonths: 6,
    saveSectionData: savePowerSection,
    sectionToPayloadKey: SECTION_TO_PAYLOAD_KEY,
    onComplete: () => setShowSuccessOverlay(true),
    onExitForm: () => setViewMode('index')
  });

  const currentData = getValues();
  const progressPercent = calculateGlobalProgress(activeSchemas, currentData);

  const statusReportInfo = getSectionStatus('ReportInfo', currentData);
  const statusVenue = getSectionStatus('VenueInfo', currentData);
  const statusPersonnel = getSectionStatus('PersonnelInfo', currentData);
  const statusSec1 = getSectionStatus('Section1', currentData);
  const statusSec2 = getSectionStatus('Section2', currentData);
  const statusSec3 = getSectionStatus('Section3', currentData);
  const statusSec4 = getSectionStatus('Section4', currentData);
  const statusSec5 = getSectionStatus('Section5', currentData);
  const statusSec6 = getSectionStatus('Section6', currentData);
  const statusSec7 = getSectionStatus('Section7', currentData);
  const statusSec8 = getSectionStatus('Section8', currentData);
  const statusSec9 = getSectionStatus('Section9', currentData);
  const statusSec10 = getSectionStatus('Section10', currentData);

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
      const { total } = calculateSchemaProgress(activeSchemas[sectionId], getValues());
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
          { id: 'Section10', title: '13. Nameplate & Documentation', itemsCount: getItemsCount('Section10'), status: statusSec10, icon: BuildingIcon },
          { id: 'Signatures', title: '14. Signatures', itemsCount: getItemsCount('Signatures'), status: getSectionStatus('Signatures', getValues()), icon: DocumentIcon }
        ]
      }
    ];

    return (
      <div className="flex flex-col h-full w-full relative">
        <Header 
          title="Power System Assessment" 
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
    const subProgress = calculateSchemaProgress(activeSchemas[currentSubsection], getValues());
    
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
      { id: 'Section10', label: '13. Nameplate & Documentation', status: statusSec10 },
      { id: 'Signatures', label: '14. Signatures', status: getSectionStatus('Signatures', getValues()) }
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
        <LiveProgressBar 
          schema={activeSchemas[currentSubsection]}
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
              schema={activeSchemas[currentSubsection]}
              control={control}
              errors={errors}
              useAccordions={true}
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
      <AuditSuccessOverlay 
        show={showSuccessOverlay} 
        title="Power Audit Saved"
        message="The power system audit has been completed and verified successfully."
      />
    </div>
  );
}
