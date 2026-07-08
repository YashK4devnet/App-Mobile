// Centralized Schemas for Venue Audit Form Generation

export const VENUE_REPORT_INFO_SCHEMA = [
  { name: 'reportName', label: 'Report Name', type: 'text', required: true, placeholder: 'e.g. Q2 Assessment' },
  { name: 'auditDate', label: 'Audit Date', type: 'date', required: true },
  { name: 'auditManager', label: 'Audit Manager', type: 'text', required: true, placeholder: 'e.g. Jane Smith' },
  { name: 'previousAuditDate', label: 'Previous Audit Date', type: 'date', required: true },
  { name: 'reportNumber', label: 'Report Number', type: 'text', readOnly: true },
  { name: 'systemAuditName', label: 'System Audit Name', type: 'text', readOnly: true, value: 'Venue Audit Report' },
  { name: 'version', label: 'Version', type: 'number', required: true, placeholder: 'e.g. 1' },
  { name: 'nextAuditDate', label: 'Next Audit Date', type: 'date' }
];

export const VENUE_PERSONNEL_INFO_SCHEMA = [
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

export const LOCATION_DETAILS_SCHEMA = [
  { name: 'region', label: 'Region', type: 'text' },
  {
    type: 'row',
    fields: [
      { name: 'state', label: 'State', type: 'text' },
      { name: 'city', label: 'City', type: 'text' }
    ]
  },
  { name: 'venueName', label: 'Venue Name', type: 'text' },
  { name: 'address', label: 'Complete Venue Address', type: 'textarea', placeholder: 'Enter complete address' },
  { name: 'pinCode', label: 'Pin Code', type: 'pincode', placeholder: 'Enter 6-digit pin code' },
  { name: 'isMapAccurate', label: 'Google Map Location Accurate?', type: 'yes-no', noColor: 'orange' }
];

export const CONTACT_DETAILS_SCHEMA = [
  { name: 'ownerName', label: 'Venue Owner Name', type: 'text' },
  { name: 'ownerContact', label: 'Venue Owner Contact Number', type: 'phone' },
  { name: 'ownerEmail', label: 'Venue Owner Email ID', type: 'text' },
  { name: 'adminName', label: 'Venue Administrator Name', type: 'text' },
  { name: 'adminContact', label: 'Venue Administrator Contact', type: 'phone' },
  { name: 'itAdminName', label: 'System / IT Administrator Name', type: 'text' },
  { name: 'itAdminContact', label: 'System / IT Admin Contact', type: 'phone' },
  { name: 'venueEmail', label: 'Venue Email ID', type: 'text' },
  { name: 'landline', label: 'Venue Landline No', type: 'landline' },
  { name: 'correspondenceEmail', label: 'Any Other Correspondence Email', type: 'text' },
  { name: 'alternateContact', label: 'Alternate Contact No', type: 'phone' }
];

export const ACCESSIBILITY_DETAILS_SCHEMA = [
  { name: 'distCityCentre', label: 'Distance from City Centre', type: 'text', placeholder: 'e.g. 5 km' },
  { name: 'distAirport', label: 'Distance from Airport', type: 'text', placeholder: 'e.g. 15 km' },
  { name: 'distRailway', label: 'Distance from Railway Station', type: 'text', placeholder: 'e.g. 2.5 km' },
  {
    type: 'row',
    fields: [
      { name: 'distBusStop', label: 'Distance from Nearest Bus Stop', type: 'text', placeholder: 'e.g. 500 meters' },
      { name: 'busStopName', label: 'Nearest Bus Stop Name', type: 'text', placeholder: 'Enter stop name' }
    ]
  },
  {
    type: 'row',
    fields: [
      { name: 'distPoliceStation', label: 'Distance from Police Station', type: 'text', placeholder: 'e.g. 1.2 km' },
      { name: 'policeStationName', label: 'Police Station Name', type: 'text', placeholder: 'Enter station name' }
    ]
  },
  {
    type: 'row',
    fields: [
      { name: 'distHospital', label: 'Distance from Nearest Hospital', type: 'text', placeholder: 'e.g. 800 meters' },
      { name: 'hospitalName', label: 'Nearest Hospital Name', type: 'text', placeholder: 'Enter hospital name' }
    ]
  },
  { name: 'distFireStation', label: 'Distance from Fire Station', type: 'text', placeholder: 'e.g. 4 km' },
  { name: 'approachRoadQuality', label: 'Approach Road Quality', type: 'quality' },
  { name: 'convenienceFeedback', label: 'Overall Convenience Feedback', type: 'textarea', placeholder: 'Enter feedback' }
];

export const ADMINISTRATIVE_DETAILS_SCHEMA = [
  { type: 'heading', label: 'Basic Amenities & Security' },
  { name: 'washroomAvailable', label: 'Washroom Facility Available?', type: 'yes-no' },
  {
    type: 'group',
    className: 'grid grid-cols-2 gap-4 bg-white/5 p-3 rounded-xl border border-white/10 animate-fade-in',
    showIf: (data) => data.washroomAvailable === 'yes',
    fields: [
      { name: 'washroomQuality', label: 'Quality of Washrooms', type: 'quality' },
      { name: 'washroomCleanliness', label: 'Cleanliness of Washrooms', type: 'quality' }
    ]
  },
  { name: 'drinkingWaterAvailable', label: 'Safe Drinking Water Facilities Available?', type: 'yes-no' },
  { name: 'parkingAvailable', label: 'Open Space Available for Parking?', type: 'yes-no' },
  {
    type: 'group',
    className: 'bg-white/5 p-3 rounded-xl border border-white/10 animate-fade-in',
    showIf: (data) => data.parkingAvailable === 'yes',
    fields: [
      { name: 'parkingToiletAvailable', label: 'Separate Toilet Available at Parking?', type: 'yes-no' }
    ]
  },
  { name: 'securityGuardsAvailable', label: 'Male & Female Security Guards Available?', type: 'yes-no' },
  { name: 'femaleFriskingEnclosure', label: 'Enclosure Available for Female Frisking?', type: 'yes-no' },

  { type: 'heading', label: 'Candidate Facilities' },
  { name: 'storeBelongingsAvailable', label: 'Facility Available to Store Candidate Belongings?', type: 'yes-no' },
  { name: 'lockersAvailable', label: 'Lockers Available to Keep Candidate Electronic Gadgets?', type: 'yes-no' },
  { name: 'comfortableSeats', label: 'Does Computer Lab Have Comfortable Seats?', type: 'yes-no' },
  { name: 'adequateSpaceCandidates', label: 'Adequate Space Available Between Two Adjacent Candidates?', type: 'yes-no' },
  { name: 'approxSpaceSeats', label: 'Approximate Space Between Two Seats/Candidates', type: 'text', placeholder: 'e.g. 3 feet' },
  { name: 'liftFacility', label: 'Lift Facility Available If There Are Multiple Floors?', type: 'yes-no-na' },
  { name: 'wheelchairRamp', label: 'Wheel Chair/Ramp Facility Available for PH Candidates?', type: 'yes-no' },
  { name: 'groundFloorLab', label: 'Lab Available on Ground Floor for PH Candidates?', type: 'yes-no-na' },
  { name: 'phToilet', label: 'Separate Toilet Available for PH Candidates?', type: 'yes-no' },
  { name: 'sufficientLighting', label: 'Sufficient Lighting Available to Create an Exam Environment?', type: 'yes-no' },
  { name: 'acAdequate', label: 'Is the Air Conditioning Facility Adequate?', type: 'yes-no-na' },

  { type: 'heading', label: 'Manpower & Verification' },
  { name: 'totalManpower', label: 'Total Number of Venue Manpower Available', type: 'number', placeholder: 'e.g. 25', required: true },
  { name: 'manpowerType', label: 'Type of Staff/Manpower Engaged', type: 'text', placeholder: 'e.g. Technical, Security', required: true },
  { name: 'policeVerification', label: 'Background/Police Verification of Staff Available?', type: 'yes-no' },
  { name: 'staffComputerKnowledge', label: 'No. of Faculty/Staff with Computer Knowledge', type: 'number', placeholder: 'e.g. 10', required: true },

  { type: 'heading', label: 'Technical & IT Facilities' },
  { name: 'separateAreaScanningPrinting', label: 'Separate Area for Scanning/Printing?', type: 'yes-no' },
  {
    type: 'row',
    fields: [
      { name: 'printersCount', label: 'Number of Printers Available', type: 'number', placeholder: 'e.g. 2', required: true },
      { name: 'scannersCount', label: 'Number of Scanners Available', type: 'number', placeholder: 'e.g. 2', required: true }
    ]
  },
  {
    type: 'group',
    className: 'animate-fade-in',
    showIf: (data) => parseInt(data.printersCount) > 0,
    fields: [
      { name: 'printersType', label: 'Type of Printers', type: 'text', placeholder: 'e.g. Laserjet', required: true }
    ]
  },
  {
    type: 'group',
    className: 'animate-fade-in',
    showIf: (data) => parseInt(data.scannersCount) > 0,
    fields: [
      { name: 'scannersType', label: 'Type of Scanners', type: 'text', placeholder: 'e.g. Flatbed', required: true }
    ]
  },

  { type: 'heading', label: 'Campus & Safety' },
  { name: 'closedBoundary', label: 'Is the Entire Campus Inside a Closed Boundary?', type: 'yes-no' },
  { name: 'firstAidKit', label: 'First Aid Kit Available?', type: 'yes-no' },
  { name: 'fireExtinguishers', label: 'Fire Extinguishers & Safety Equipment Available?', type: 'yes-no' },
  { name: 'emergencyExit', label: 'Emergency Exit Available at the Venue?', type: 'yes-no' },
  {
    type: 'group',
    className: 'bg-white/5 p-3 rounded-xl border border-white/10 animate-fade-in',
    showIf: (data) => data.emergencyExit === 'yes',
    fields: [
      { name: 'emergencyExitEveryFloor', label: 'Emergency Exit Access Available on Every Floor?', type: 'yes-no-na' }
    ]
  },
  { name: 'visitorLogBook', label: 'Visitor Log Book Available and Clearly Maintained?', type: 'yes-no' },

  { type: 'heading', label: 'Feedback' },
  { name: 'adminFeedback', label: 'Overall Administrative Feedback', type: 'textarea', placeholder: 'Enter additional remarks...' }
];

export const SYSTEM_DETAILS_SCHEMA = [
  { type: 'heading', label: 'System Overview' },
  { name: 'totalSystemsAvailable', label: 'Total Number of Systems Available', type: 'number', placeholder: 'e.g. 200' },
  { name: 'machineMaintenance', label: 'Look & Feel and Maintenance of Machines', type: 'quality' },

  { type: 'heading', label: 'Node Counts (Available vs Working)' },
  { prefix: 'testNodes', label: 'Test Nodes', type: 'node-counts' },
  { prefix: 'bufferNodes', label: 'Buffer Nodes', type: 'node-counts' },
  { prefix: 'registrationNodes', label: 'Registration Desk Nodes', type: 'node-counts' },
  { prefix: 'aadharNodes', label: 'Aadhar Desk Nodes', type: 'node-counts' },
  { prefix: 'videoRecordingMachine', label: 'Video Recording Machine', type: 'node-counts' },

  { type: 'heading', label: 'Hardware & Specifications' },
  { name: 'processors', label: 'Processors', type: 'dynamic-list', typePlaceholder: 'e.g. Intel Core i5 / AMD Ryzen 5' },
  { name: 'osSpecifications', label: 'OS Specifications', type: 'dynamic-list', typePlaceholder: 'e.g. Windows 10 Pro / Ubuntu' },
  { name: 'ramDetails', label: 'RAM Details', type: 'dynamic-list', typePlaceholder: 'e.g. 8GB DDR4' },
  { name: 'hddDetails', label: 'HDD / Storage Details', type: 'dynamic-list', typePlaceholder: 'e.g. 500GB SSD' },
  { name: 'monitorTypes', label: 'Monitor Types', type: 'dynamic-list', typePlaceholder: 'e.g. 21-inch Dell LED' },

  { type: 'heading', label: 'Policies & Software' },
  { name: 'osLicenseOnAllNodes', label: 'OS License Available on All Client Nodes?', type: 'yes-no' },
  { name: 'allowFormatSystem', label: 'Centre Will Allow to Format the System if Needed?', type: 'yes-no' },
  { name: 'antivirusAvailable', label: 'Antivirus Available at the Center?', type: 'yes-no' },
  {
    type: 'group',
    className: 'bg-white/5 p-3 rounded-xl border border-white/10 space-y-4 animate-fade-in',
    showIf: (data) => data.antivirusAvailable === 'yes',
    fields: [
      { name: 'antivirusName', label: 'Name of Antivirus Installed on PC', type: 'text', placeholder: 'e.g. Windows Defender' },
      { name: 'antivirusDisablingPermitted', label: 'Disabling Antivirus Permitted?', type: 'yes-no' }
    ]
  },
  { name: 'remoteSoftwareStatus', label: 'Remote Software Status', type: 'text', placeholder: 'e.g. AnyDesk installed, TeamViewer disabled' },

  { type: 'heading', label: 'Feedback' },
  { name: 'systemFeedback', label: 'Overall System Feedback', type: 'textarea', placeholder: 'Enter remarks...' }
];

export const LAB_DETAILS_SCHEMA = [
  { type: 'heading', label: 'Lab Capacity' },
  {
    type: 'row',
    fields: [
      { name: 'totalLabsAvailable', label: 'Total Labs Available', type: 'number', placeholder: 'e.g. 10' },
      { name: 'totalLabsAllocated', label: 'Total Labs Allocated for Exam', type: 'number', placeholder: 'e.g. 8' }
    ]
  },

  { type: 'heading', label: 'Physical Arrangement' },
  { name: 'labsSameBuilding', label: 'Are All Labs in the Same Building?', type: 'yes-no' },
  {
    type: 'group',
    className: 'bg-white/5 p-3 rounded-xl border border-white/10 animate-fade-in',
    showIf: (data) => data.labsSameBuilding === 'no',
    fields: [
      { name: 'distanceBetweenBuildings', label: 'Distance Between Buildings', type: 'text', placeholder: 'e.g. 50 meters' }
    ]
  },
  { name: 'labsSameFloor', label: 'Are All Labs on the Same Floor?', type: 'yes-no' },
  { name: 'labsInBasement', label: 'Are There Any Labs in the Basement?', type: 'yes-no' },

  { type: 'heading', label: 'Node Distribution & Floors' },
  { name: 'labsFloorCount', label: 'Total Labs Floor Count', type: 'number', placeholder: 'e.g. 3' },
  { name: 'nodeBifurcation', label: 'Count of Nodes Bifurcation', type: 'nested-list' },

  { type: 'heading', label: 'Partition & Seating Matrix' },
  { name: 'partitionAvailability', label: 'Is Partition Available Between Nodes?', type: 'yes-no' },
  {
    type: 'group',
    className: 'bg-white/5 p-3 rounded-xl border border-white/10 animate-fade-in',
    showIf: (data) => data.partitionAvailability === 'yes',
    fields: [
      { name: 'partitionType', label: 'Specify Partition Type', type: 'text', placeholder: 'e.g. Cardboard, Wooden' }
    ]
  },
  { name: 'seatsLabelled', label: 'Are Seats Labelled Properly?', type: 'yes-no' },
  { name: 'seatingMatrixProvided', label: 'Is Seating Matrix Provided Outside the Lab?', type: 'yes-no' },

  { type: 'heading', label: 'Additional Facilities' },
  { name: 'dedicatedServerRoom', label: 'Is There a Dedicated Server Room?', type: 'yes-no' },
  { name: 'serverRoomInsideLab', label: 'Is the Server Room Inside the Lab?', type: 'yes-no' },
  { name: 'registrationDeskAvailable', label: 'Is a Registration Desk Available?', type: 'yes-no' },

  { type: 'heading', label: 'Feedback' },
  { name: 'labFeedback', label: 'Overall Lab Feedback', type: 'textarea', placeholder: 'Enter remarks...' }
];

export const CCTV_DETAILS_SCHEMA = [
  { type: 'heading', label: 'CCTV Camera Overview' },
  { name: 'cctvEntryExitCovered', label: 'Is CCTV camera covering complete entry and exit?', type: 'yes-no' },
  { name: 'cctvsInAllLabs', label: 'CCTVs available in all labs without any blind spots?', type: 'yes-no' },
  { name: 'serverRoomCctvCovered', label: 'Is the server room covered under the CCTV camera?', type: 'yes-no' },
  { name: 'registrationCctvAvailable', label: 'CCTV cameras available in registration area to capture movement and candidate faces?', type: 'yes-no' },
  { name: 'totalCctvCameras', label: 'Total no of cameras', type: 'number' },
  { name: 'cctvsConnectedToMonitors', label: 'All CCTV cameras are connected to the monitors?', type: 'yes-no' },

  { type: 'heading', label: 'Camera Count & Specifications' },
  { name: 'cctvNodeBifurcation', label: 'Specify count of CCTV camera (Floor & Lab wise)', type: 'nested-list' },
  { name: 'cctvHardwareSpecifications', label: 'Define the specifics of the resolution', type: 'dynamic-list', typePlaceholder: 'e.g. 1080p, 4MP' },


  { type: 'heading', label: 'Recording & DVR/NVR Details' },
  { name: 'cctvLiveFeedRecorded', label: 'Is the CCTV/LIVE feed being recorded?', type: 'yes-no' },
  {
    type: 'group',
    className: 'bg-white/5 p-3 rounded-xl border border-white/10 animate-fade-in',
    showIf: (data) => data.cctvLiveFeedRecorded === 'yes',
    fields: [
      { name: 'dvrNvrRecordingCapacity', label: 'Recording capacity of DVR/NVR?', type: 'text', placeholder: 'e.g. 1TB, 30 days' }
    ]
  },
  { name: 'venueReadyLiveCctv', label: 'Venue ready to give for live CCTV feeding?', type: 'yes-no' },
  { name: 'dvrOwnership', label: 'DVR belongs to the venue or to any third party?', type: 'text', placeholder: 'e.g. self owned or hired/borrowed' },
  { name: 'cctvPassageCovered', label: 'CCTV covering the passage area?', type: 'yes-no' },
  { name: 'dvrNvrType', label: 'Type of DVR/NVR', type: 'text', placeholder: 'e.g. DVR / NVR' },
  { name: 'dvrNvrMakeModel', label: 'Make and model no of the DVR/NVR', type: 'text' },

  { type: 'heading', label: 'Feedback' },
  { name: 'overallCctvFeedback', label: 'Overall CCTV coverage feedback', type: 'textarea', placeholder: 'Enter remarks...' }
];

export const CONCLUSION_SCHEMA = [
  { type: 'heading', label: 'Audit Details' },
  { name: 'auditDateTime', label: 'Audit Date & Time', type: 'datetime-local' },
  { name: 'auditDuration', label: 'Audit Duration', type: 'text', placeholder: 'e.g. 2 hours 30 mins' },
  { name: 'auditorName', label: 'Auditor Name', type: 'text', placeholder: 'e.g. R CHARAN KUMAR' },
  { type: 'heading', label: 'Final Assessment' },
  { name: 'overallVenueRating', label: 'Overall Venue Rating', type: 'rating-10' },
  { name: 'recommendedForExam', label: 'Is Venue Recommended for Exam?', type: 'yes-no' },
  { name: 'otherPersonnelDetails', label: 'Other Personnel Details', type: 'textarea', placeholder: 'Enter details of any other personnel present during audit...' },
  { type: 'heading', label: 'Signatures & Seals' },
  { name: 'auditorSignature', label: 'Auditor Signature', type: 'signature', required: true },
  { name: 'venueAdminSignature', label: 'Venue Administrator Signature & Seal', type: 'signature', required: true },
  { name: 'itAdminSignature', label: 'System / IT Administrator Signature & Seal', type: 'signature', required: true }
];
