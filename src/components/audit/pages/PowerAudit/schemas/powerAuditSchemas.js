export const POWER_REPORT_INFO_SCHEMA = [
  { name: 'reportName', label: 'Report Name', type: 'text', required: true, placeholder: 'e.g. Q2 Assessment' },
  { name: 'auditDate', label: 'Audit Date', type: 'date', required: true },
  { name: 'auditManager', label: 'Audit Manager', type: 'text', required: true, placeholder: 'e.g. Jane Smith' },
  { name: 'previousAuditDate', label: 'Previous Audit Date', type: 'date', required: true },
  { name: 'reportNumber', label: 'Report Number', type: 'text', readOnly: true },
  { name: 'systemAuditName', label: 'System Audit Name', type: 'text', readOnly: true, value: 'Venue Power Audit Report' },
  { name: 'version', label: 'Version', type: 'number', required: true, placeholder: 'e.g. 1' },
  { name: 'nextAuditDate', label: 'Next Audit Date', type: 'date' }
];

export const POWER_VENUE_INFO_SCHEMA = [
  { name: 'region', label: 'Region', type: 'select', options: ['North', 'South', 'East', 'West', 'Central'] },
  { name: 'state', label: 'State', type: 'text' },
  { name: 'city', label: 'City', type: 'text' },
  { name: 'venueName', label: 'Venue Name', type: 'text' },
  { name: 'address', label: 'Address', type: 'text' },
  { name: 'pinCode', label: 'Pin Code', type: 'text' },
  { name: 'isMapAccurate', label: 'Is Google Map location accurate?', type: 'radio', options: ['yes', 'no'] },
  { name: 'totalNodes', label: 'Total Nodes', type: 'number', placeholder: 'e.g. 100' }
];

export const POWER_PERSONNEL_INFO_SCHEMA = [
  // Auditee
  { type: 'heading', label: 'Auditee Information', className: 'text-white/50 border-white/10' },
  { name: 'auditeeName', label: 'Name', type: 'text', required: true },
  { name: 'auditeeRole', label: 'Role', type: 'text', required: true, placeholder: 'e.g. CS / Venue Management Representative' },
  { name: 'auditeeContact', label: 'Contact Number & Email ID', type: 'text', required: true },

  // Auditor
  { type: 'heading', label: 'Auditor Details', className: 'text-[#F98A15] border-[#F98A15]/30 mt-6' },
  { name: 'auditorName', label: 'Name (Auditor)', type: 'text', required: true },
  { name: 'auditorRole', label: 'Role', type: 'text', disabled: true, value: 'Auditor' },
  { name: 'auditorContact', label: 'Contact Number & Email ID', type: 'text', required: true },

  { name: 'auditorSignature', label: "Auditor's Signature", type: 'signature', required: true },
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
  {
    name: 'q1_1_a',
    type: 'power-question',
    label: 'Check Transformer for any abnormality',
    evidence: 'Visual',
    findingsHint: 'Check for availability of fencing around the transformer'
  },
  {
    name: 'q1_1_b',
    type: 'power-question',
    label: 'Check Transformer for any abnormality',
    evidence: 'Visual',
    findingsHint: 'Check for Blue colour of silica gel & any oil leakage'
  },
  {
    name: 'q1_1_c',
    type: 'power-question',
    label: 'Check Transformer for any abnormality',
    evidence: 'Visual',
    findingsHint: 'Check for any Tree or burning material near transformer'
  },
  {
    name: 'q1_1_d',
    type: 'power-question',
    label: 'Check Earth Pit',
    evidence: 'Visual',
    findingsHint: 'No break in earthing wire/ metal strip, wet earth pit'
  }
];

export const POWER_SECTION_2_SCHEMA = [
  {
    name: 'q2_1',
    type: 'power-question',
    label: 'Check all panels are properly closed',
    evidence: 'Visual',
    findingsHint: 'Check wire entry points/front & back covers of panels'
  },
  {
    name: 'q2_2',
    type: 'power-question',
    label: 'Check rubber mat for LT panels & UPS',
    evidence: 'Visual',
    findingsHint: 'Industrial grade rubber mat in front of LT panel & UPS'
  },
  {
    name: 'q2_3',
    type: 'power-question',
    label: 'Check condition of cable lugs/joints',
    evidence: 'Visual',
    findingsHint: 'Check black marks/sparking/burning smell'
  },
  {
    name: 'q2_4',
    type: 'power-question',
    label: 'Input Voltage (Phase to Neutral Voltage)',
    evidence: 'LT panel',
    findingsHint: '200 V - 240 V'
  },
  {
    name: 'q2_5',
    type: 'power-question',
    label: 'Electrical Frequency',
    evidence: 'LT panel',
    findingsHint: '49 Hz - 51 Hz'
  },
  {
    name: 'q2_6',
    type: 'power-question',
    label: 'R, Y, B load in KVA/Amps on each phase',
    evidence: 'LT panel',
    findingsHint: 'Maximum load difference between phases 15%'
  },
  {
    name: 'q2_7',
    type: 'power-question',
    label: 'Total load of centre in KVA (all equipment ON)',
    evidence: 'LT panel',
    findingsHint: 'NA - Maximum load limit 80% of Sanctioned load'
  },
  {
    name: 'q2_8',
    type: 'power-question',
    label: 'Status of Main supply availability at center',
    evidence: 'VH/CS',
    findingsHint: 'Regular supply / Interrupting supply'
  }
];

export const POWER_SECTION_3_SCHEMA = [
  { type: 'heading', label: 'Diesel Generator', className: 'text-white/50 border-white/10' },
  {
    name: 'q3_0_1',
    type: 'power-photo-question',
    label: 'Check all panels are properly closed',
    evidence: 'Visual',
    findingsHint: 'Check wire entry points/front & back covers of panels'
  },
  {
    name: 'q3_0_2',
    type: 'power-photo-question',
    label: 'Check rubber mat for LT panels & UPS',
    evidence: 'Visual',
    findingsHint: 'Industrial grade rubber mat in front of LT panel & UPS'
  },
  {
    name: 'q3_0_3',
    type: 'power-photo-question',
    label: 'Check condition of cable lugs/joints',
    evidence: 'Visual',
    findingsHint: 'Check black marks/sparking/burning smell'
  },
  {
    name: 'q3_0_4',
    type: 'power-photo-question',
    label: 'Input Voltage (Phase to Neutral Voltage)',
    evidence: 'LT panel',
    findingsHint: '200 V - 240 V'
  },
  {
    name: 'q3_0_5',
    type: 'power-photo-question',
    label: 'Electrical Frequency',
    evidence: 'LT panel',
    findingsHint: '49 Hz - 51 Hz'
  },
  {
    name: 'q3_0_6',
    type: 'power-photo-question',
    label: 'R, Y, B load in KVA/Amps on each phase',
    evidence: 'LT panel',
    findingsHint: 'Maximum load difference between phases 15%'
  },
  {
    name: 'q3_0_7',
    type: 'power-photo-question',
    label: 'Total load of centre in KVA (all equipment ON)',
    evidence: 'LT panel',
    findingsHint: 'NA - Maximum load limit 80% of Sanctioned load'
  },
  {
    name: 'q3_0_8',
    type: 'power-photo-question',
    label: 'Status of Main supply availability at center',
    evidence: 'VH/CS',
    findingsHint: 'Regular supply / Interrupting supply'
  },


  { type: 'heading', label: 'DG checks in stop condition checks', className: 'text-[#F98A15] border-[#F98A15]/30 mt-6' },
  {
    name: 'q3_1_a',
    type: 'power-question',
    label: 'Provision for connecting mobile DG',
    evidence: 'Visual',
    findingsHint: 'Check provision for connecting mobile DG'
  },
  {
    name: 'q3_1_b',
    type: 'power-question',
    label: 'Check DG surroundings/bottom clean',
    evidence: 'Visual',
    findingsHint: 'Check surroundings are clear for air & exhaust flow and bottom is clean'
  },
  {
    name: 'q3_1_c',
    type: 'power-question',
    label: 'DG Battery cranking voltage',
    evidence: 'DG panel',
    findingsHint: 'Voltage should be above 9V'
  },
  {
    name: 'q3_1_d',
    type: 'power-question',
    label: 'DG Battery warranty',
    evidence: 'DG Battery doc.',
    findingsHint: 'Should be under warranty'
  },
  {
    name: 'q3_1_e',
    type: 'power-question',
    label: 'Fuel Level in Tank',
    evidence: 'DG panel',
    findingsHint: 'NA | 90% before exam day'
  },
  {
    name: 'q3_1_f',
    type: 'power-question',
    label: 'Check coolant level',
    evidence: 'Visual',
    findingsHint: '70% | 90%'
  },
  {
    name: 'q3_1_g',
    type: 'power-question',
    label: 'Lubricating oil level',
    evidence: 'Dipstick',
    findingsHint: 'Between low and high level mark of dip stick'
  },
  {
    name: 'q3_1_h',
    type: 'power-question',
    label: 'Check DG belt condition',
    evidence: 'Visual',
    findingsHint: 'No oil/water on belt, no cracks on belt'
  },
  {
    name: 'q3_1_i',
    type: 'power-question',
    label: 'DG Earthing checks',
    evidence: 'Visual',
    findingsHint: 'No break in earthing wire/ metal strip, wet earth pit'
  }
];

export const POWER_SECTION_4_SCHEMA = [
  {
    name: 'q4_1',
    type: 'power-question',
    label: 'Check DG auto starting',
    evidence: 'Panel',
    findingsHint: 'If auto starting provision available'
  },
  {
    name: 'q4_2',
    type: 'power-question',
    label: 'DG Voltage (Phase to Neutral)',
    evidence: 'DG panel',
    findingsHint: '200 V - 240 V'
  },
  {
    name: 'q4_3',
    type: 'power-question',
    label: 'Electrical Frequency',
    evidence: 'DG panel',
    findingsHint: '49 Hz - 51 Hz'
  },
  {
    name: 'q4_4',
    type: 'power-question',
    label: 'DG load in KVA (15 min with all equipment ON)',
    evidence: 'DG panel',
    findingsHint: '50% load - Max 80% of DG capacity'
  },
  {
    name: 'q4_5',
    type: 'power-question',
    label: 'R, Y, B load in KVA/Amps on each phase',
    evidence: 'DG panel',
    findingsHint: 'Maximum load difference between phases 15%'
  },
  {
    name: 'q4_6',
    type: 'power-question',
    label: 'Fuel / Lub oil / Coolant leakage',
    evidence: 'Visual',
    findingsHint: 'No leakage'
  },
  {
    name: 'q4_7',
    type: 'power-question',
    label: 'Lube Oil Pressure',
    evidence: 'DG panel',
    findingsHint: '4 bar - 7 bar'
  },
  {
    name: 'q4_8',
    type: 'power-question',
    label: 'Coolant temperature',
    evidence: 'DG panel',
    findingsHint: '40°C - 85°C (alarm) & 90°C (trip)'
  },
  {
    name: 'q4_9',
    type: 'power-question',
    label: 'Check Exhaust Gases colour',
    evidence: 'Visual',
    findingsHint: 'Exhaust should not be black'
  }
];

export const POWER_SECTION_5_SCHEMA = [
  { type: 'heading', label: 'UPS (Uninterruptible Power Supply)', className: 'text-white/50 border-white/10' },
  {
    name: 'q5_0_1',
    type: 'power-photo-question',
    label: 'No. of UPS with capacity in KVA'
  },
  {
    name: 'q5_0_2',
    type: 'power-photo-question',
    label: 'Type of UPS'
  },
  {
    name: 'q5_0_3',
    type: 'power-photo-question',
    label: 'UPS make (Brand and Year of Manufacture)'
  },

  { type: 'heading', label: 'UPS Equipment', className: 'text-[#F98A15] border-[#F98A15]/30 mt-6' },
  {
    name: 'q5_1_1',
    type: 'power-question',
    label: 'Input Voltage (Phase to Neutral)',
    evidence: 'UPS panel',
    findingsHint: '200 V - 240 V'
  },
  {
    name: 'q5_1_2',
    type: 'power-question',
    label: 'Output Voltage (Phase to Neutral)',
    evidence: 'UPS panel',
    findingsHint: '200 V - 240 V'
  },
  {
    name: 'q5_1_3',
    type: 'power-question',
    label: 'Electrical Frequency output',
    evidence: 'UPS panel',
    findingsHint: '49 Hz - 51 Hz'
  },
  {
    name: 'q5_1_4',
    type: 'power-question',
    label: 'Load on Phase (R Y B) in Amps or % (all equipment ON)',
    evidence: 'UPS panel',
    findingsHint: 'Maximum load difference between phases 15%'
  },
  {
    name: 'q5_1_5',
    type: 'power-question',
    label: 'Load on UPS in KVA (all equipment ON)',
    evidence: 'UPS panel',
    findingsHint: 'Max. load 80% of UPS capacity'
  },
  {
    name: 'q5_1_6',
    type: 'power-question',
    label: 'Earth to Neutral Voltage',
    evidence: 'Multimeter',
    findingsHint: '0 V - 2 V'
  },
  {
    name: 'q5_1_7',
    type: 'power-question',
    label: 'UPS Battery Charging %',
    evidence: 'UPS panel',
    findingsHint: '90% - 100%'
  },
  {
    name: 'q5_1_8',
    type: 'power-question',
    label: 'UPS backup time in minutes',
    evidence: 'UPS panel',
    findingsHint: '15 min (check batteries if low backup)'
  },
  {
    name: 'q5_1_9',
    type: 'power-question',
    label: 'Check UPS bypass provision availability',
    evidence: 'Visual',
    findingsHint: 'If no provision, keep thimbled wires for bypassing UPS during emergency'
  },
  {
    name: 'q5_1_10',
    type: 'power-question',
    label: 'Check UPS fans working and filter dust free',
    evidence: 'Visual',
    findingsHint: 'No abnormal noise from fans; clean UPS if dust observed'
  },
  {
    name: 'q5_1_11',
    type: 'power-question',
    label: 'UPS Room temperature',
    evidence: 'Thermometer',
    findingsHint: '23°C - 24°C'
  },
  {
    name: 'q5_1_12',
    type: 'power-question',
    label: 'Check dedicated earthing of UPS',
    evidence: 'Visual',
    findingsHint: 'Check earthing of UPS'
  },
  {
    name: 'q5_1_13',
    type: 'power-question',
    label: 'Check MCBs not overloaded',
    evidence: 'Clamp meter',
    findingsHint: 'Max. 80% load of MCB rating'
  }
];

export const POWER_SECTION_6_SCHEMA = [
  { type: 'heading', label: 'UPS Batteries', className: 'text-white/50 border-white/10' },

  {
    name: 'q6_0_2',
    type: 'power-photo-question',
    label: 'Battery AH'
  },
  {
    name: 'q6_0_3',
    type: 'power-photo-question',
    label: 'Battery Make/Model/Year'
  },

  { type: 'heading', label: 'Battery System', className: 'text-[#F98A15] border-[#F98A15]/30 mt-6' },
  {
    name: 'q6_1_1',
    type: 'power-question',
    label: 'UPS Battery warranty',
    evidence: 'Battery docs.',
    findingsHint: 'Check UPS Battery are under warranty'
  },
  {
    name: 'q6_1_2',
    type: 'power-question',
    label: 'Check UPS batteries for acid marks or bulging',
    evidence: 'Inspection',
    findingsHint: 'No acid leak or bulging indications'
  },
  {
    name: 'q6_1_3',
    type: 'power-question',
    label: 'Check MCB/MCCB fitted for supply from Batteries to UPS',
    evidence: 'Visual',
    findingsHint: 'MCB/MCCB should be of correct rating'
  },
  {
    name: 'q6_1_4',
    type: 'power-question',
    label: 'Check voltage of batteries on float mode',
    evidence: 'Multimeter',
    findingsHint: '13 V - 13.5 V'
  },
  {
    name: 'q6_1_5',
    type: 'power-question',
    label: 'Room Temperature',
    evidence: 'Inspection',
    findingsHint: '23°C - 24°C'
  }
];

export const POWER_SECTION_7_SCHEMA = [
  {
    name: 'q7_1',
    type: 'power-question',
    label: "Checks for all the equipment's integration and functionality",
    evidence: 'Switch on all equipments (Desktops, server, A/C, Fan, Lights etc)'
  },
  {
    name: 'q7_2',
    type: 'power-question',
    label: "Checks for all the equipment's integration and functionality",
    evidence: 'Put DG in manual mode and switch off raw power supply from panel'
  },
  {
    name: 'q7_3',
    type: 'power-question',
    label: "Checks for all the equipment's integration and functionality",
    evidence: 'Check UPS supply changed to battery mode and no PC / MCB tripped'
  },
  {
    name: 'q7_4',
    type: 'power-question',
    label: "Checks for all the equipment's integration and functionality",
    evidence: 'Check battery backup for 15 minutes and record readings'
  },
  {
    name: 'q7_5',
    type: 'power-question',
    label: "Checks for all the equipment's integration and functionality",
    evidence: 'Put DG in auto mode and check if DG starts. Start all equipment'
  },
  {
    name: 'q7_6',
    type: 'power-question',
    label: "Checks for all the equipment's integration and functionality",
    evidence: 'Check power supply from DG to UPS and verify all desktops/MCB. Run DG for 30 minutes'
  },
  {
    name: 'q7_7',
    type: 'power-question',
    label: "Checks for all the equipment's integration and functionality",
    evidence: 'Switch ON raw power supply and check DG auto shutdown'
  },
  {
    name: 'q7_8',
    type: 'power-question',
    label: "Checks for all the equipment's integration and functionality",
    evidence: 'Check UPS raw power supply availability and readings for abnormalities'
  }
];

export const POWER_SECTION_8_SCHEMA = [
  {
    name: 'q8_1',
    type: 'power-question',
    label: 'Last UPS maintenance date',
    evidence: 'records',
    findingsHint: 'Quarterly checks should be done'
  },
  {
    name: 'q8_2',
    type: 'power-question',
    label: 'Last UPS Battery maintenance date',
    evidence: 'records',
    findingsHint: 'Quarterly checks should be done'
  },
  {
    name: 'q8_3',
    type: 'power-question',
    label: 'Last DG maintenance date',
    evidence: 'records',
    findingsHint: 'Quarterly checks should be done'
  },
  {
    name: 'q8_4',
    type: 'power-question',
    label: 'Last AC maintenance date',
    evidence: 'records',
    findingsHint: 'Quarterly checks should be done'
  },
  {
    name: 'q8_5',
    type: 'power-question',
    label: 'Letter to EB for uninterrupted power supply',
    evidence: 'records',
    findingsHint: 'Check letter for latest exam'
  },
  {
    name: 'q8_6',
    type: 'power-question',
    label: 'Last Annual Shutdown maintenance date',
    evidence: 'records',
    findingsHint: 'Annually should be done'
  }
];

export const POWER_SECTION_9_SCHEMA = [
  {
    name: 'q9_1',
    type: 'power-question',
    label: 'Check knowledge of electrician',
    evidence: 'Interview',
    findingsHint: 'Certified and experienced electrician should be available'
  },
  {
    name: 'q9_2',
    type: 'power-question',
    label: 'Check availability of tools',
    evidence: 'Tool kit',
    findingsHint: 'Multimeter, clamp meter, tester, screw drivers, plier and adjustable spanner'
  },
  {
    name: 'q9_3',
    type: 'power-question',
    label: 'Check availability of spares',
    evidence: 'DG spares',
    findingsHint: 'Coolant, lube oil, belt, fuse, spare battery wire, MCBs (16A+), spare wires for emergency connections'
  }
];

export const POWER_SECTION_10_SCHEMA = [
  {
    name: 'equipmentDocuments',
    type: 'document-list',
    label: 'Nameplate & Documentation of Equipment(s)',
    required: false
  },
  { type: 'heading', label: 'Signatures & Verification', className: 'text-[#F98A15] border-[#F98A15]/30 mt-8' },
  {
    name: 'auditorSignatureDate',
    type: 'signature',
    label: "Auditor's Signature & Date",
    required: true
  },
  {
    name: 'csManagerSignature',
    type: 'signature',
    label: "CS/Venue Manager Signature",
    required: true
  },
  {
    name: 'electricianSignatureDate',
    type: 'signature',
    label: "Electrician Signature & Date",
    required: true
  }
];

