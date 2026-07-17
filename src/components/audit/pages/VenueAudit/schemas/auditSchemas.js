// Centralized Schemas for Venue Audit Form Generation

export const VENUE_REPORT_INFO_SCHEMA = [
  { name: 'reportName', label: 'Report Name', type: 'text', required: true, placeholder: 'e.g. Q2 Assessment', readOnly: true },
  { name: 'auditDate', label: 'Audit Date', type: 'date', required: true, readOnly: true },
  { name: 'auditManager', label: 'Audit Manager', type: 'text', required: true, placeholder: 'e.g. Jane Smith', readOnly: true },
  { name: 'previousAuditDate', label: 'Previous Audit Date', type: 'date', required: true, readOnly: true },
  { name: 'reportNumber', label: 'Report Number', type: 'text', readOnly: true },
  { name: 'systemAuditName', label: 'System Audit Name', type: 'text', readOnly: true, value: 'Venue Readiness Audit Report' },
  { name: 'version', label: 'Version', type: 'number', required: true, placeholder: 'e.g. 1', readOnly: true },
  { name: 'nextAuditDate', label: 'Next Audit Date', type: 'date', readOnly: true }
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
  { name: 'auditorContact', label: 'Contact Number & Email ID', type: 'text', required: true }
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
  { name: 'name', label: 'Venue Name', type: 'text' },
  { name: 'completeAddress', label: 'Complete Venue Address', type: 'textarea', placeholder: 'Enter complete address' },
  { name: 'pinCode', label: 'Pin Code', type: 'pincode', placeholder: 'Enter 6-digit pin code' },
  { name: 'googleMapLocationStatus', label: 'Google Map Location Accurate?', type: 'yes-no', noColor: 'orange' }
];

export const CONTACT_DETAILS_SCHEMA = [
  { name: 'venueOwnerName', label: 'Venue Owner Name', type: 'text' },
  { name: 'venueOwnerContact', label: 'Venue Owner Contact Number', type: 'phone' },
  { name: 'venueOwnerEmail', label: 'Venue Owner Email ID', type: 'text' },
  { name: 'venueAdministratorName', label: 'Venue Administrator Name', type: 'text' },
  { name: 'venueAdministratorContact', label: 'Venue Administrator Contact', type: 'phone' },
  { name: 'systemItAdminName', label: 'System / IT Administrator Name', type: 'text' },
  { name: 'systemItAdminContact', label: 'System / IT Admin Contact', type: 'phone' },
  { name: 'email', label: 'Venue Email ID', type: 'text' },
  { name: 'venueLandlineNo', label: 'Venue Landline No', type: 'landline' },
  { name: 'otherCorrespondenceEmail', label: 'Any Other Correspondence Email', type: 'text' },
  { name: 'alternateContactNo', label: 'Alternate Contact No', type: 'phone' }
];

export const ACCESSIBILITY_DETAILS_SCHEMA = [
  { name: 'distanceFromCity', label: 'Distance from City Centre', type: 'select', options: [{ label: '<10km', value: 'more_10km' }, { label: '10km-20km', value: 'bw_10_20' }, { label: '>20km', value: 'less_20km' }] },
  { name: 'distanceFromAir', label: 'Distance from Airport', type: 'select', options: [{ label: '<10km', value: 'more_10km' }, { label: '10km-20km', value: 'bw_10_20' }, { label: '>20km', value: 'less_20km' }] },
  { name: 'distanceFromRail', label: 'Distance from Railway Station', type: 'select', options: [{ label: '<10km', value: 'more_10km' }, { label: '10km-20km', value: 'bw_10_20' }, { label: '>20km', value: 'less_20km' }] },
  {
    type: 'row',
    fields: [
      { name: 'distanceFromBus', label: 'Distance from Nearest Bus Stop', type: 'select', options: [{ label: '<10km', value: 'more_10km' }, { label: '10km-20km', value: 'bw_10_20' }, { label: '>20km', value: 'less_20km' }] },
      { name: 'nearBusStop', label: 'Nearest Bus Stop Name', type: 'text', placeholder: 'Enter stop name' }
    ]
  },
  {
    type: 'row',
    fields: [
      { name: 'distanceFromPolice', label: 'Distance from Police Station', type: 'select', options: [{ label: '<10km', value: 'more_10km' }, { label: '10km-20km', value: 'bw_10_20' }, { label: '>20km', value: 'less_20km' }] },
      { name: 'policeStationName', label: 'Police Station Name', type: 'text', placeholder: 'Enter station name' }
    ]
  },
  {
    type: 'row',
    fields: [
      { name: 'distanceFromHospital', label: 'Distance from Nearest Hospital', type: 'select', options: [{ label: '<10km', value: 'more_10km' }, { label: '10km-20km', value: 'bw_10_20' }, { label: '>20km', value: 'less_20km' }] },
      { name: 'hospitalName', label: 'Nearest Hospital Name', type: 'text', placeholder: 'Enter hospital name' }
    ]
  },
  { name: 'distanceFromFireStation', label: 'Distance from Fire Station', type: 'select', options: [{ label: '<10km', value: 'more_10km' }, { label: '10km-20km', value: 'bw_10_20' }, { label: '>20km', value: 'less_20km' }] },
  { name: 'roadQuality', label: 'Approach Road Quality', type: 'quality' },
  { name: 'convenienceFeedback', label: 'Overall Convenience Feedback', type: 'textarea', placeholder: 'Enter feedback' }
];

export const ADMINISTRATIVE_DETAILS_SCHEMA = [
  { type: 'heading', label: 'Basic Amenities & Security' },
  { name: 'washroomFacilityAvailable', label: 'Washroom Facility Available?', type: 'yes-no' },
  {
    type: 'group',
    className: 'grid grid-cols-2 gap-4 bg-white/5 p-3 rounded-xl border border-white/10 animate-fade-in',
    showIf: (data) => data.washroomFacilityAvailable === 'yes',
    fields: [
      { name: 'washroomQuality', label: 'Quality of Washrooms', type: 'select', options: [{ label: '0-3', value: '0_3' }, { label: '4-7', value: '4_7' }, { label: '8-10', value: '8_10' }] },
      { name: 'washroomCleanliness', label: 'Cleanliness of Washrooms', type: 'select', options: [{ label: '0-3', value: '0_3' }, { label: '4-7', value: '4_7' }, { label: '8-10', value: '8_10' }] }
    ]
  },
  { name: 'safeDrinkingWaterAvailable', label: 'Safe Drinking Water Facilities Available?', type: 'yes-no' },
  { name: 'parkingSpaceAvailable', label: 'Open Space Available for Parking?', type: 'yes-no' },
  {
    type: 'group',
    className: 'bg-white/5 p-3 rounded-xl border border-white/10 animate-fade-in',
    showIf: (data) => data.parkingSpaceAvailable === 'yes',
    fields: [
      { name: 'separateToiletAtParking', label: 'Separate Toilet Available at Parking?', type: 'yes-no' }
    ]
  },
  { name: 'securityGuardsAvailable', label: 'Male & Female Security Guards Available?', type: 'yes-no' },
  { name: 'femaleFriskingEnclosureAvailable', label: 'Enclosure Available for Female Frisking?', type: 'yes-no' },

  { type: 'heading', label: 'Candidate Facilities' },
  { name: 'candidateBelongingsStorage', label: 'Facility Available to Store Candidate Belongings?', type: 'yes-no' },
  { name: 'lockersAvailable', label: 'Lockers Available to Keep Candidate Electronic Gadgets?', type: 'yes-no' },
  { name: 'comfortableSeatsAvailable', label: 'Does Computer Lab Have Comfortable Seats?', type: 'yes-no' },
  { name: 'adequateSpaceBetweenCandidates', label: 'Adequate Space Available Between Two Adjacent Candidates?', type: 'yes-no' },
  { name: 'approximateSpaceBetweenCandidates', label: 'Approximate Space Between Two Seats/Candidates', type: 'select', options: [{ label: '3FT', value: '3ft' }, { label: 'More than 3FT', value: 'more_than_3ft' }] },
  { name: 'liftFacilityAvailable', label: 'Lift Facility Available If There Are Multiple Floors?', type: 'yes-no-na' },
  { name: 'wheelchairRampAvailable', label: 'Wheel Chair/Ramp Facility Available for PH Candidates?', type: 'yes-no' },
  { name: 'groundFloorLabAvailable', label: 'Lab Available on Ground Floor for PH Candidates?', type: 'yes-no-na' },
  { name: 'separateToiletForPh', label: 'Separate Toilet Available for PH Candidates?', type: 'yes-no' },
  { name: 'sufficientLightingAvailable', label: 'Sufficient Lighting Available to Create an Exam Environment?', type: 'yes-no' },
  { name: 'airConditioningAdequate', label: 'Is the Air Conditioning Facility Adequate?', type: 'yes-no-na' },

  { type: 'heading', label: 'Manpower & Verification' },
  { name: 'venueManpowerCount', label: 'Total Number of Venue Manpower Available', type: 'select', options: [{ label: '<10', value: 'lt_10' }, { label: '10-20', value: '10_20' }, { label: '>20', value: 'gt_20' }] },
  { name: 'staffType', label: 'Type of Staff/Manpower Engaged', type: 'select', options: [{ label: 'Employee', value: 'employee' }, { label: 'Contract', value: 'contract' }, { label: 'Mixed', value: 'mixed' }] },
  { name: 'backgroundVerificationAvailable', label: 'Background/Police Verification of Staff Available?', type: 'yes-no' },
  { name: 'computerKnowledgeStaffCount', label: 'No. of Faculty/Staff with Computer Knowledge', type: 'select', options: [{ label: '<10', value: 'lt_10' }, { label: '10-20', value: '10_20' }, { label: '>20', value: 'gt_20' }] },

  { type: 'heading', label: 'Technical & IT Facilities' },
  { name: 'separateScanningPrintingArea', label: 'Separate Area for Scanning/Printing?', type: 'yes-no' },

  { name: 'numberOfPrinters', label: 'Number of Printers Available', type: 'number', placeholder: 'e.g. 2', required: true },
  { name: 'printerType', label: 'Type of Printers', type: 'select', options: [{ label: 'Laser', value: 'laser' }, { label: 'DeskJet', value: 'deskjet' }] },
  { name: 'numberOfScanners', label: 'Number of Scanners Available', type: 'number', placeholder: 'e.g. 2', required: true },
  { name: 'scannerType', label: 'Type of Scanners', type: 'select', options: [{ label: 'FlatBed', value: 'flatbed' }, { label: 'Feeder', value: 'feeder' }] },


  { type: 'heading', label: 'Campus & Safety' },
  { name: 'campusBoundaryStatus', label: 'Is the Entire Campus Inside a Closed Boundary?', type: 'select', options: [{ label: 'Within Boundary', value: 'within_boundary' }, { label: 'Scattered', value: 'scattered' }] },
  { name: 'firstAidKitAvailable', label: 'First Aid Kit Available?', type: 'yes-no' },
  { name: 'fireSafetyEquipmentAvailable', label: 'Fire Extinguishers & Safety Equipment Available?', type: 'yes-no' },
  { name: 'emergencyExitAvailable', label: 'Emergency Exit Available at the Venue?', type: 'yes-no' },
  {
    type: 'group',
    className: 'bg-white/5 p-3 rounded-xl border border-white/10 animate-fade-in',
    showIf: (data) => data.emergencyExitAvailable === 'yes',
    fields: [
      { name: 'emergencyExitEachFloor', label: 'Emergency Exit Access Available on Every Floor?', type: 'yes-no-na' }
    ]
  },
  { name: 'visitorLogbookAvailable', label: 'Visitor Log Book Available and Clearly Maintained?', type: 'yes-no' },

  { type: 'heading', label: 'Feedback' },
  { name: 'overallAdministrativeFeedback', label: 'Overall Administrative Feedback', type: 'textarea', placeholder: 'Enter additional remarks...' }
];

export const SYSTEM_DETAILS_SCHEMA = [
  { type: 'heading', label: 'System Overview' },
  { name: 'totalSystemsAvailable', label: 'Total Number of Systems Available', type: 'number', placeholder: 'e.g. 200' },
  { name: 'machineLookAndFeel', label: 'Look & Feel and Maintenance of Machines', type: 'quality' },

  { type: 'heading', label: 'Node Counts (Available vs Working)' },
  { prefix: 'testNodes', label: 'Test Nodes', type: 'node-counts' },
  { prefix: 'bufferNodes', label: 'Buffer Nodes', type: 'node-counts' },
  { prefix: 'registrationDeskNodes', label: 'Registration Desk Nodes', type: 'node-counts' },
  { prefix: 'aadhaarDeskNodes', label: 'Aadhar Desk Nodes', type: 'node-counts' },
  { prefix: 'videoRecordingMachines', label: 'Video Recording Machine', type: 'node-counts' },

  { type: 'heading', label: 'Types of Processors' },
  { name: 'i3available', label: 'Number of available INTEL Core i3 processors', type: 'number' },
  { name: 'i3working', label: 'Number of working INTEL Core i3 processors', type: 'number' },
  { name: 'i3speed', label: 'speed of the INTEL Core i3 processors', type: 'number' },
  { name: 'i5available', label: 'Number of available INTEL Core i5 processors', type: 'number' },
  { name: 'i5working', label: 'Number of working INTEL Core i5 processors', type: 'number' },
  { name: 'i5speed', label: 'speed of the INTEL Core i5 processors', type: 'number' },
  { name: 'i7available', label: 'Number of available INTEL Core i7 processors', type: 'number' },
  { name: 'i7working', label: 'Number of working INTEL Core i7 processors', type: 'number' },
  { name: 'i7speed', label: 'speed of the INTEL Core i7 processors', type: 'number' },
  { type: 'heading', label: 'Types of OS' },
  { name: 'win7available', label: 'Number of available win7 pcs', type: 'number' },
  { name: 'win7working', label: 'Number of working win7 pcs', type: 'number' },
  { name: 'win8available', label: 'Number of available win8 pcs', type: 'number' },
  { name: 'win8working', label: 'Number of working win8 pcs', type: 'number' },
  { name: 'win10available', label: 'Number of available win10 pcs', type: 'number' },
  { name: 'win10working', label: 'Number of working win10 pcs', type: 'number' },
  { name: 'win11available', label: 'Number of available win11 pcs', type: 'number' },
  { name: 'win11working', label: 'Number of working win11 pcs', type: 'number' },
  { name: 'linuxavailable', label: 'Number of available linux pcs', type: 'number' },
  { name: 'linuxworking', label: 'Number of working linux pcs', type: 'number' },
  { name: 'otheravailable', label: 'Number of available other os pcs', type: 'number' },
  { name: 'otherworking', label: 'Number of working other os pcs', type: 'number' },
  { name: 'ieVersion', label: 'Internet explorer version available', type: 'select', options: ['IE8', 'IE9', 'IE10'] },
  { name: 'twoGBramAvail', label: 'Number of available 2GB ram', type: 'number' },
  { name: 'twoGBramWork', label: 'Number of working 2GB ram', type: 'number' },
  { name: 'fourGBramAvail', label: 'Number of available 4GB ram', type: 'number' },
  { name: 'fourGBramWork', label: 'Number of working 4GB ram', type: 'number' },
  { name: 'eightGBramAvail', label: 'Number of available 8GB ram', type: 'number' },
  { name: 'eightGBramWork', label: 'Number of working 8GB ram', type: 'number' },
  { name: 'hddAvail256', label: 'Number of available 256GB HDD', type: 'number' },
  { name: 'hddwork256', label: 'Number of working 256GB HDD', type: 'number' },
  { name: 'hddAvail512', label: 'Number of available 512GB HDD', type: 'number' },
  { name: 'hddwork512', label: 'Number of working 512GB HDD', type: 'number' },
  { name: 'hddAvail1', label: 'Number of available 1TB HDD', type: 'number' },
  { name: 'hddwork1', label: 'Number of working 1TB HDD', type: 'number' },
  { name: 'monitorAvail15', label: 'Number of available 15 inch monitors', type: 'number' },
  { name: 'monitorwork15', label: 'Number of working 15 inch monitors', type: 'number' },
  { name: 'monitorAvail17', label: 'Number of available 17 inch monitors', type: 'number' },
  { name: 'monitorwork17', label: 'Number of working 17 inch monitors', type: 'number' },
  { name: 'monitorAvail19', label: 'Number of available 19 inch monitors', type: 'number' },
  { name: 'monitorwork19', label: 'Number of working 19 inch monitors', type: 'number' },

  { type: 'heading', label: 'Policies & Software' },
  { name: 'osLicenseAvailable', label: 'OS License Available on All Client Nodes?', type: 'yes-no' },
  { name: 'systemFormatAllowed', label: 'Centre Will Allow to Format the System if Needed?', type: 'yes-no' },
  { name: 'antivirusAvailable', label: 'Antivirus Available at the Center?', type: 'yes-no' },
  {
    type: 'group',
    className: 'bg-white/5 p-3 rounded-xl border border-white/10 space-y-4 animate-fade-in',
    showIf: (data) => data.antivirusAvailable === 'yes',
    fields: [
      { name: 'antivirusName', label: 'Name of Antivirus Installed on PC', type: 'text', placeholder: 'e.g. Windows Defender' },
      { name: 'disableAntivirusPermitted', label: 'Disabling Antivirus Permitted?', type: 'yes-no' }
    ]
  },
  { name: 'remoteSoftwareFound', label: 'Remote Software Status', type: 'text', placeholder: 'e.g. AnyDesk installed, TeamViewer disabled' },

  { type: 'heading', label: 'Feedback' },
  { name: 'overallSystemFeedback', label: 'Overall System Feedback', type: 'textarea', placeholder: 'Enter remarks...' }
];

export const LAB_DETAILS_SCHEMA = [
  { type: 'heading', label: 'Lab Capacity' },
  {
    type: 'row',
    fields: [
      { name: 'totalLabsAvailable', label: 'Total Labs Available', type: 'number', placeholder: 'e.g. 10' },
      { name: 'totalLabsAllocatedExam', label: 'Total Labs Allocated for Exam', type: 'number', placeholder: 'e.g. 8' }
    ]
  },

  { type: 'heading', label: 'Physical Arrangement' },
  { name: 'labsSameBuilding', label: 'Are All Labs in the Same Building?', type: 'select', options: [{ label: 'One Building', value: 'one_building' }, { label: 'Different Buildings', value: 'different_buildings' }] },
  {
    type: 'group',
    className: 'bg-white/5 p-3 rounded-xl border border-white/10 animate-fade-in',
    showIf: (data) => data.labsSameBuilding === 'different_buildings',
    fields: [
      { name: 'distanceBetweenBuildings', label: 'Distance Between Buildings', type: 'select', options: [{ label: '<1KM', value: 'lt_1km' }, { label: '1-2KMS', value: '1_2km' }, { label: '>2KMS', value: 'gt_2km' }] }
    ]
  },
  { name: 'labsSameFloor', label: 'Are All Labs on the Same Floor?', type: 'select', options: [{ label: 'Same Floor', value: 'same_floor' }, { label: 'Different Floor', value: 'different_floors' }] },
  { name: 'labsInBasement', label: 'Are There Any Labs in the Basement?', type: 'yes-no' },

  { type: 'heading', label: 'Node Distribution & Floors' },
  { name: 'labsFloorCount', label: 'Total Labs Floor Count', type: 'number', placeholder: 'e.g. 3' },
  {
    name: 'nodeBifurcation',
    label: 'Count of Nodes Bifurcation',
    type: 'array',
    itemLabel: 'Floor',
    fields: [
      { name: 'floorName', label: 'Floor Name', type: 'text', placeholder: 'e.g. 1st Floor, Ground Floor', required: true },
      {
        name: 'labs',
        label: 'Labs on this floor',
        type: 'array',
        itemLabel: 'Lab',
        fields: [
          { name: 'labName', label: 'Lab Name', type: 'text', placeholder: 'e.g. Lab A', required: true },
          { name: 'nodesCount', label: 'Nodes Count', type: 'number', placeholder: 'e.g. 50', required: true }
        ]
      }
    ]
  },

  { type: 'heading', label: 'Partition & Seating Matrix' },
  { name: 'partitionAvailability', label: 'Is Partition Available Between Nodes?', type: 'select', options: [{ label: 'Available', value: 'available' }, { label: 'Not Available', value: 'not_available' }] },
  {
    type: 'group',
    className: 'bg-white/5 p-3 rounded-xl border border-white/10 animate-fade-in',
    showIf: (data) => data.partitionAvailability === 'available',
    fields: [
      { name: 'partitionType', label: 'Specify Partition Type', type: 'select', options: [{ label: 'Fixed', value: 'fixed' }, { label: 'Temporary', value: 'temporary' }] }
    ]
  },
  { name: 'seatsLabelled', label: 'Are Seats Labelled Properly?', type: 'yes-no' },
  { name: 'seatingMatrixProvided', label: 'Is Seating Matrix Provided Outside the Lab?', type: 'yes-no' },

  { type: 'heading', label: 'Additional Facilities' },
  { name: 'dedicatedServerRoom', label: 'Is There a Dedicated Server Room?', type: 'yes-no' },
  { name: 'serverRoomInsideLab', label: 'Is the Server Room Inside the Lab?', type: 'select', options: [{ label: 'Inside', value: 'inside' }, { label: 'Separate', value: 'separate' }] },
  { name: 'registrationDeskProper', label: 'Is a Registration Desk Available?', type: 'yes-no' },

  { type: 'heading', label: 'Feedback' },
  { name: 'overallLabFeedback', label: 'Overall Lab Feedback', type: 'textarea', placeholder: 'Enter remarks...' }
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
  {
    name: 'cctvNodeBifurcation',
    label: 'Specify count of CCTV camera (Floor & Lab wise)',
    type: 'array',
    itemLabel: 'Floor',
    fields: [
      { name: 'floorName', label: 'Floor Name', type: 'text', placeholder: 'e.g. 1st Floor', required: true },
      {
        name: 'labs',
        label: 'Labs on this floor',
        type: 'array',
        itemLabel: 'Lab',
        fields: [
          { name: 'labName', label: 'Lab Name', type: 'text', placeholder: 'e.g. Lab A', required: true },
          { name: 'nodesCount', label: 'CCTV Cameras Count', type: 'number', placeholder: 'e.g. 5', required: true }
        ]
      }
    ]
  },
  { name: 'cctvAvail2mp', label: 'No of available 2MP cameras', type: 'number' },
  { name: 'cctvWork2mp', label: 'No of working 2MP cameras', type: 'number' },
  { name: 'cctvAvail5mp', label: 'No of available 5MP cameras', type: 'number' },
  { name: 'cctvWork5mp', label: 'No of working 5MP cameras', type: 'number' },
  { name: 'cctvAvailHigher', label: 'No of available higher resolution cameras', type: 'number' },
  { name: 'cctvWorkHigher', label: 'No of working higher resolution cameras', type: 'number' },


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
  { name: 'dvrOwnership', label: 'DVR belongs to the venue or to any third party?', type: 'yes-no' },
  { name: 'cctvPassageCovered', label: 'CCTV covering the passage area?', type: 'yes-no' },
  { name: 'dvrNvrType', label: 'Type of DVR/NVR', type: 'text', placeholder: 'e.g. DVR / NVR' },
  { name: 'dvrNvrMakeModel', label: 'Make and model no of the DVR/NVR', type: 'text' },

  { type: 'heading', label: 'Feedback' },
  { name: 'overallCctvFeedback', label: 'Overall CCTV coverage feedback', type: 'textarea', placeholder: 'Enter remarks...' }
];

export const CONCLUSION_SCHEMA = [
  { type: 'heading', label: 'Audit Details' },
  { name: 'auditDateTime', label: 'Audit Date & Time', type: 'datetime-local' },
  { name: 'auditDuration', label: 'Audit Duration', type: 'select', options: [{ label: '<2HRS', value: 'lt_2hrs' }, { label: '2-4HRS', value: '2-4hrs' }, { label: '>4HRS', value: 'gt_4hrs' }] },
  { name: 'auditorName', label: 'Auditor Name', type: 'text', placeholder: 'e.g. R CHARAN KUMAR' },
  { type: 'heading', label: 'Final Assessment' },
  { name: 'overallVenueRating', label: 'Overall Venue Rating', type: 'select', options: [{ label: '0-3', value: '0_3' }, { label: '4-7', value: '4_7' }, { label: '8-10', value: '8_10' }] },
  { name: 'recommendedExamConduct', label: 'Is Venue Recommended for Exam?', type: 'select', options: [{ label: 'Recommended', value: 'recommended' }, { label: 'Not Recommended', value: 'not recommended' }] },
  { name: 'otherPersonnelDetails', label: 'Other Personnel Details', type: 'textarea', placeholder: 'Enter other personnel details...' },
  { type: 'heading', label: 'Signatures & Seals' },
  { name: 'auditorSignature', label: 'Auditor Signature', type: 'signature', required: true },
  { name: 'auditorSignatureDate', label: 'Date', type: 'date', required: true },
  { name: 'venueManagerSignature', label: 'Venue Manager Signature', type: 'signature', required: true },
  { name: 'venueManagerSignatureDate', label: 'Date', type: 'date', required: true },
  { name: 'electricianSignature', label: 'Electrician Signature', type: 'signature', required: true },
  { name: 'electricianSignatureDate', label: 'Date', type: 'date', required: true },
  { name: 'centerSeal', label: 'Center Seal', type: 'image-upload', required: true }
];
