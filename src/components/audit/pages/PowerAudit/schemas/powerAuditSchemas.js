const createPowerQuestion = (name, label, evidence = '', findingsHint = '') => ({
  name,
  label,
  type: 'object',
  subType: 'power-question',
  fields: [
    { name: 'findings', label: `Findings${findingsHint ? ` (${findingsHint})` : ''}`, type: 'textarea', placeholder: 'Enter findings here...' },
    { name: 'score', label: 'Score', type: 'select', options: [{label: 'S', value: 's'}, {label: 'NS', value: 'ns'}, {label: 'U', value: 'u'}, {label: 'NA', value: 'na'}] },
    { name: 'image', label: `Evidence Image${evidence ? ` (${evidence})` : ''}`, type: 'image-upload' }
  ]
});

const createPowerPhotoQuestion = (name, label, evidence = '', findingsHint = '') => ({
  name,
  label,
  type: 'object',
  subType: 'power-photo-question',
  fields: [
    { name: 'findings', label: `Findings${findingsHint ? ` (${findingsHint})` : ''}`, type: 'textarea', placeholder: 'Enter findings here...' },
    { name: 'image', label: `Evidence Image${evidence ? ` (${evidence})` : ''}`, type: 'image-upload' }
  ]
});

const createCustomQuestions = (sectionName, additionalFields) => {
  const defaultFields = [
    { name: 'evidence', label: 'Evidence', type: 'textarea', placeholder: 'Enter evidence here...' },
    { name: 'findings', label: 'Findings', type: 'textarea', placeholder: 'Enter findings here...' },
    { name: 'score', label: 'Score', type: 'select', options: [{label: 'S', value: 's'}, {label: 'NS', value: 'ns'}, {label: 'U', value: 'u'}, {label: 'NA', value: 'na'}] },
    { name: 'image', label: 'Evidence Image', type: 'image-upload' }
  ];

  return {
    name: `customQuestions_${sectionName}`,
    label: 'Additional Custom Questions',
    type: 'array',
    subType: 'custom-questions',
    itemLabel: 'Custom Question',
    fields: [
      { name: 'questionTitle', label: 'Custom Question Title', type: 'text', required: true, placeholder: 'Enter question' },
      ...(additionalFields || defaultFields)
    ]
  };
};

export const POWER_REPORT_INFO_SCHEMA = [
  { name: 'reportName', label: 'Report Name', type: 'text', required: true, placeholder: 'e.g. Q2 Assessment', readOnly: true },
  { name: 'auditDate', label: 'Audit Date', type: 'date', required: true, readOnly: true },
  { name: 'auditManager', label: 'Audit Manager', type: 'text', required: true, placeholder: 'e.g. Jane Smith', readOnly: true },
  { name: 'previousAuditDate', label: 'Previous Audit Date', type: 'date', required: true, readOnly: true },
  { name: 'reportNumber', label: 'Report Number', type: 'text', readOnly: true },
  { name: 'systemAuditName', label: 'System Audit Name', type: 'text', readOnly: true, value: 'Venue Power Audit Report' },
  { name: 'version', label: 'Version', type: 'number', required: true, placeholder: 'e.g. 1', readOnly: true },
  { name: 'nextAuditDate', label: 'Next Audit Date', type: 'date', readOnly: true }
];

export const POWER_VENUE_INFO_SCHEMA = [
  { name: 'region', label: 'Region', type: 'select', options: ['North', 'South', 'East', 'West', 'Central'], readOnly: true },
  { name: 'state', label: 'State', type: 'text', readOnly: true },
  { name: 'city', label: 'City', type: 'text', readOnly: true },
  { name: 'name', label: 'Venue Name', type: 'text', readOnly: true },
  { name: 'completeAddress', label: 'Address', type: 'text', readOnly: true },
  { name: 'pinCode', label: 'Pin Code', type: 'text', readOnly: true },
  { name: 'googleMapLocationStatus', label: 'Is Google Map location accurate?', type: 'radio', options: ['yes', 'no'], readOnly: true },
  { name: 'totalNodes', label: 'Total Nodes', type: 'number', placeholder: 'e.g. 100' }
];

export const POWER_PERSONNEL_INFO_SCHEMA = [
  // Auditee
  { type: 'heading', label: 'Auditee Information', className: 'text-white/50 border-white/10' },
  { name: 'auditeeName', label: 'Name', type: 'text', required: true, readOnly: true },
  { name: 'auditeeRole', label: 'Role', type: 'text', required: true, placeholder: 'e.g. CS / Venue Management Representative', readOnly: true },
  { name: 'auditeeContact', label: 'Contact Number & Email ID', type: 'text', required: true, readOnly: true },

  // Auditor
  { type: 'heading', label: 'Auditor Details', className: 'text-[#F98A15] border-[#F98A15]/30 mt-6' },
  { name: 'auditorName', label: 'Name (Auditor)', type: 'text', required: true, readOnly: true },
  { name: 'auditorRole', label: 'Role', type: 'text', disabled: true, value: 'Auditor' },
  { name: 'auditorContact', label: 'Contact Number & Email ID', type: 'text', required: true, readOnly: true },

  // Signatures
  { type: 'heading', label: 'Signatures & Verification', className: 'text-white/50 border-white/10 mt-6' },
  { name: 'auditorSignature', label: 'Auditor Signature', type: 'signature', required: true },
  { name: 'venueManagerSignature', label: 'Venue Manager Signature', type: 'signature', required: true },
  { name: 'electricianSignature', label: 'Electrician Signature', type: 'signature', required: true },
  { name: 'centerSeal', label: 'Center Seal', type: 'image-upload', required: true }
];

export const POWER_SECTION_1_SCHEMA = [
  { type: 'heading', label: '1. Supply Transformer and Earth Pit', className: 'text-white/50 border-white/10' },
  { name: 'transformerRatingKva', label: '1. Transformer Rating in KVA', type: 'text', placeholder: 'e.g. 500' },
  { name: 'transformerPhase', label: 'Transformer Phase', type: 'text', placeholder: 'e.g. 3-phase or Single phase' },
  { name: 'sanctionedLoadKva', label: '2. Sanctioned Load in KVA', type: 'number', placeholder: 'e.g. 100' },
  { name: 'solarPowerCapacityKva', label: '3. Solar Power Capacity in KVA', type: 'number', placeholder: 'e.g. 50' },
  { name: 'solarPowerType', label: 'a. Solar Power ON Grid / OFF Grid', type: 'text', placeholder: 'e.g. ON Grid' },

  { type: 'heading', label: 'Transformer and Earth Pit Questionnaire', className: 'text-[#F98A15] border-[#F98A15]/30 mt-6' },
  createPowerQuestion('q1_1_a', 'Check Transformer for any abnormality', 'Visual', 'Check for availability of fencing around the transformer'),
  createPowerQuestion('q1_1_b', 'Check Transformer for any abnormality', 'Visual', 'Check for Blue colour of silica gel & any oil leakage'),
  createPowerQuestion('q1_1_c', 'Check Transformer for any abnormality', 'Visual', 'Check for any Tree or burning material near transformer'),
  createPowerQuestion('q1_1_d', 'Check Earth Pit', 'Visual', 'No break in earthing wire/ metal strip, wet earth pit'),
  createCustomQuestions('sec1', [
    { name: 'findings', label: 'Findings', type: 'textarea', placeholder: 'Enter findings here...' },
    { name: 'phase', label: 'Phase', type: 'select', options: [{label: 'Single Phase', value: 'single'}, {label: 'Three Phase', value: 'three'}] },
    { name: 'image', label: 'Evidence Image', type: 'image-upload' }
  ])
];

export const POWER_SECTION_2_SCHEMA = [
  createPowerQuestion('q2_1', 'Check all panels are properly closed', 'Visual', 'Check wire entry points/front & back covers of panels'),
  createPowerQuestion('q2_2', 'Check rubber mat for LT panels & UPS', 'Visual', 'Industrial grade rubber mat in front of LT panel & UPS'),
  createPowerQuestion('q2_3', 'Check condition of cable lugs/joints', 'Visual', 'Check black marks/sparking/burning smell'),
  createPowerQuestion('q2_4', 'Input Voltage (Phase to Neutral Voltage)', 'LT panel', '200 V - 240 V'),
  createPowerQuestion('q2_5', 'Electrical Frequency', 'LT panel', '49 Hz - 51 Hz'),
  createPowerQuestion('q2_6', 'R, Y, B load in KVA/Amps on each phase', 'LT panel', 'Maximum load difference between phases 15%'),
  createPowerQuestion('q2_7', 'Total load of centre in KVA (all equipment ON)', 'LT panel', 'NA - Maximum load limit 80% of Sanctioned load'),
  createPowerQuestion('q2_8', 'Status of Main supply availability at center', 'VH/CS', 'Regular supply / Interrupting supply'),
  createCustomQuestions('sec2')
];

export const POWER_SECTION_3_SCHEMA = [
  { type: 'heading', label: 'Diesel Generator', className: 'text-white/50 border-white/10' },
  createPowerPhotoQuestion('q3_0_1', 'Check all panels are properly closed', 'Visual', 'Check wire entry points/front & back covers of panels'),
  createPowerPhotoQuestion('q3_0_2', 'Check rubber mat for LT panels & UPS', 'Visual', 'Industrial grade rubber mat in front of LT panel & UPS'),
  createPowerPhotoQuestion('q3_0_3', 'Check condition of cable lugs/joints', 'Visual', 'Check black marks/sparking/burning smell'),
  createPowerPhotoQuestion('q3_0_4', 'Input Voltage (Phase to Neutral Voltage)', 'LT panel', '200 V - 240 V'),
  createPowerPhotoQuestion('q3_0_5', 'Electrical Frequency', 'LT panel', '49 Hz - 51 Hz'),
  createPowerPhotoQuestion('q3_0_6', 'R, Y, B load in KVA/Amps on each phase', 'LT panel', 'Maximum load difference between phases 15%'),
  createPowerPhotoQuestion('q3_0_7', 'Total load of centre in KVA (all equipment ON)', 'LT panel', 'NA - Maximum load limit 80% of Sanctioned load'),
  createPowerPhotoQuestion('q3_0_8', 'Status of Main supply availability at center', 'VH/CS', 'Regular supply / Interrupting supply'),

  { type: 'heading', label: 'DG checks in stop condition checks', className: 'text-[#F98A15] border-[#F98A15]/30 mt-6' },
  createPowerQuestion('q3_1_a', 'Provision for connecting mobile DG', 'Visual', 'Check provision for connecting mobile DG'),
  createPowerQuestion('q3_1_b', 'Check DG surroundings/bottom clean', 'Visual', 'Check surroundings are clear for air & exhaust flow and bottom is clean'),
  createPowerQuestion('q3_1_c', 'DG Battery cranking voltage', 'DG panel', 'Voltage should be above 9V'),
  createPowerQuestion('q3_1_d', 'DG Battery warranty', 'DG Battery doc.', 'Should be under warranty'),
  createPowerQuestion('q3_1_e', 'Fuel Level in Tank', 'DG panel', 'NA | 90% before exam day'),
  createPowerQuestion('q3_1_f', 'Check coolant level', 'Visual', '70% | 90%'),
  createPowerQuestion('q3_1_g', 'Lubricating oil level', 'Dipstick', 'Between low and high level mark of dip stick'),
  createPowerQuestion('q3_1_h', 'Check DG belt condition', 'Visual', 'No oil/water on belt, no cracks on belt'),
  createPowerQuestion('q3_1_i', 'DG Earthing checks', 'Visual', 'No break in earthing wire/ metal strip, wet earth pit'),
  createCustomQuestions('sec3')
];

export const POWER_SECTION_4_SCHEMA = [
  createPowerQuestion('q4_1', 'Check DG auto starting', 'Panel', 'If auto starting provision available'),
  createPowerQuestion('q4_2', 'DG Voltage (Phase to Neutral)', 'DG panel', '200 V - 240 V'),
  createPowerQuestion('q4_3', 'Electrical Frequency', 'DG panel', '49 Hz - 51 Hz'),
  createPowerQuestion('q4_4', 'DG load in KVA (15 min with all equipment ON)', 'DG panel', '50% load - Max 80% of DG capacity'),
  createPowerQuestion('q4_5', 'R, Y, B load in KVA/Amps on each phase', 'DG panel', 'Maximum load difference between phases 15%'),
  createPowerQuestion('q4_6', 'Fuel / Lub oil / Coolant leakage', 'Visual', 'No leakage'),
  createPowerQuestion('q4_7', 'Lube Oil Pressure', 'DG panel', '4 bar - 7 bar'),
  createPowerQuestion('q4_8', 'Coolant temperature', 'DG panel', '40°C - 85°C (alarm) & 90°C (trip)'),
  createPowerQuestion('q4_9', 'Check Exhaust Gases colour', 'Visual', 'Exhaust should not be black'),
  createCustomQuestions('sec4')
];

export const POWER_SECTION_5_SCHEMA = [
  { type: 'heading', label: 'UPS (Uninterruptible Power Supply)', className: 'text-white/50 border-white/10' },
  createPowerPhotoQuestion('q5_0_1', 'No. of UPS with capacity in KVA'),
  createPowerPhotoQuestion('q5_0_2', 'Type of UPS'),
  createPowerPhotoQuestion('q5_0_3', 'UPS make (Brand and Year of Manufacture)'),

  { type: 'heading', label: 'UPS Equipment', className: 'text-[#F98A15] border-[#F98A15]/30 mt-6' },
  createPowerQuestion('q5_1_1', 'Input Voltage (Phase to Neutral)', 'UPS panel', '200 V - 240 V'),
  createPowerQuestion('q5_1_2', 'Output Voltage (Phase to Neutral)', 'UPS panel', '200 V - 240 V'),
  createPowerQuestion('q5_1_3', 'Electrical Frequency output', 'UPS panel', '49 Hz - 51 Hz'),
  createPowerQuestion('q5_1_4', 'Load on Phase (R Y B) in Amps or % (all equipment ON)', 'UPS panel', 'Maximum load difference between phases 15%'),
  createPowerQuestion('q5_1_5', 'Load on UPS in KVA (all equipment ON)', 'UPS panel', 'Max. load 80% of UPS capacity'),
  createPowerQuestion('q5_1_6', 'Earth to Neutral Voltage', 'Multimeter', '0 V - 2 V'),
  createPowerQuestion('q5_1_7', 'UPS Battery Charging %', 'UPS panel', '90% - 100%'),
  createPowerQuestion('q5_1_8', 'UPS backup time in minutes', 'UPS panel', '15 min (check batteries if low backup)'),
  createPowerQuestion('q5_1_9', 'Check UPS bypass provision availability', 'Visual', 'If no provision, keep thimbled wires for bypassing UPS during emergency'),
  createPowerQuestion('q5_1_10', 'Check UPS fans working and filter dust free', 'Visual', 'No abnormal noise from fans; clean UPS if dust observed'),
  createPowerQuestion('q5_1_11', 'UPS Room temperature', 'Thermometer', '23°C - 24°C'),
  createPowerQuestion('q5_1_12', 'Check dedicated earthing of UPS', 'Visual', 'Check earthing of UPS'),
  createPowerQuestion('q5_1_13', 'Check MCBs not overloaded', 'Clamp meter', 'Max. 80% load of MCB rating'),
  createCustomQuestions('sec5')
];

export const POWER_SECTION_6_SCHEMA = [
  { type: 'heading', label: 'UPS Batteries', className: 'text-white/50 border-white/10' },

  createPowerPhotoQuestion('q6_0_2', 'Battery AH'),
  createPowerPhotoQuestion('q6_0_3', 'Battery Make/Model/Year'),

  { type: 'heading', label: 'Battery System', className: 'text-[#F98A15] border-[#F98A15]/30 mt-6' },
  createPowerQuestion('q6_1_1', 'UPS Battery warranty', 'Battery docs.', 'Check UPS Battery are under warranty'),
  createPowerQuestion('q6_1_2', 'Check UPS batteries for acid marks or bulging', 'Inspection', 'No acid leak or bulging indications'),
  createPowerQuestion('q6_1_3', 'Check MCB/MCCB fitted for supply from Batteries to UPS', 'Visual', 'MCB/MCCB should be of correct rating'),
  createPowerQuestion('q6_1_4', 'Check voltage of batteries on float mode', 'Multimeter', '13 V - 13.5 V'),
  createPowerQuestion('q6_1_5', 'Room Temperature', 'Inspection', '23°C - 24°C'),
  createCustomQuestions('sec6')
];

export const POWER_SECTION_7_SCHEMA = [
  createPowerQuestion('q7_1', "Checks for all the equipment's integration and functionality", 'Switch on all equipments (Desktops, server, A/C, Fan, Lights etc)'),
  createPowerQuestion('q7_2', "Checks for all the equipment's integration and functionality", 'Put DG in manual mode and switch off raw power supply from panel'),
  createPowerQuestion('q7_3', "Checks for all the equipment's integration and functionality", 'Check UPS supply changed to battery mode and no PC / MCB tripped'),
  createPowerQuestion('q7_4', "Checks for all the equipment's integration and functionality", 'Check battery backup for 15 minutes and record readings'),
  createPowerQuestion('q7_5', "Checks for all the equipment's integration and functionality", 'Put DG in auto mode and check if DG starts. Start all equipment'),
  createPowerQuestion('q7_6', "Checks for all the equipment's integration and functionality", 'Check power supply from DG to UPS and verify all desktops/MCB. Run DG for 30 minutes'),
  createPowerQuestion('q7_7', "Checks for all the equipment's integration and functionality", 'Switch ON raw power supply and check DG auto shutdown'),
  createPowerQuestion('q7_8', "Checks for all the equipment's integration and functionality", 'Check UPS raw power supply availability and readings for abnormalities'),
  createCustomQuestions('sec7')
];

export const POWER_SECTION_8_SCHEMA = [
  createPowerQuestion('q8_1', 'Last UPS maintenance date', 'records', 'Quarterly checks should be done'),
  createPowerQuestion('q8_2', 'Last UPS Battery maintenance date', 'records', 'Quarterly checks should be done'),
  createPowerQuestion('q8_3', 'Last DG maintenance date', 'records', 'Quarterly checks should be done'),
  createPowerQuestion('q8_4', 'Last AC maintenance date', 'records', 'Quarterly checks should be done'),
  createPowerQuestion('q8_5', 'Letter to EB for uninterrupted power supply', 'records', 'Check letter for latest exam'),
  createPowerQuestion('q8_6', 'Last Annual Shutdown maintenance date', 'records', 'Annually should be done'),
  createCustomQuestions('sec8')
];

export const POWER_SECTION_9_SCHEMA = [
  createPowerQuestion('q9_1', 'Check knowledge of electrician', 'Interview', 'Certified and experienced electrician should be available'),
  createPowerQuestion('q9_2', 'Check availability of tools', 'Tool kit', 'Multimeter, clamp meter, tester, screw drivers, plier and adjustable spanner'),
  createPowerQuestion('q9_3', 'Check availability of spares', 'DG spares', 'Coolant, lube oil, belt, fuse, spare battery wire, MCBs (16A+), spare wires for emergency connections'),
  createCustomQuestions('sec9')
];

export const POWER_SECTION_10_SCHEMA = [
  {
    name: 'equipmentDocuments',
    type: 'array',
    subType: 'document-list',
    label: 'Nameplate & Documentation of Equipment(s)',
    itemLabel: 'Document',
    fields: [
      { name: 'doc_name', label: 'Document Name', type: 'text', placeholder: 'Enter document name' },
      { name: 'doc_image', label: 'Document Image', type: 'image-upload' }
    ]
  }
];

export const POWER_SECTION_11_SCHEMA = [
  {
    type: 'heading',
    label: 'Observations',
    className: 'text-[#F98A15] border-[#F98A15]/30 mt-6'
  },
  {
    name: 'obs_list',
    label: 'Observations List',
    type: 'array',
    subType: 'numbered-text-list',
    itemLabel: 'Observation',
    fields: [
      { name: 'observation', label: 'Observation Detail', type: 'textarea', placeholder: 'Enter observation' }
    ]
  }
];

export const POWER_SIGNATURES_SCHEMA = [
  { name: 'auditorSignature', label: 'Auditor Signature', type: 'signature' },
  { name: 'venueManagerSignature', label: 'Venue Manager Signature', type: 'signature' },
  { name: 'electricianSignature', label: 'Electrician Signature', type: 'signature' },
  { name: 'centerSeal', label: 'Center Seal', type: 'image-upload' }
];
