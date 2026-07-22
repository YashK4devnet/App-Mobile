const createNetworkQuestion = (name, label, remarksHint = '') => ({
  name,
  label,
  type: 'object',
  subType: 'network-question',
  fields: [
    { name: 'remarks', label: `Remarks${remarksHint ? ` (${remarksHint})` : ''}`, type: 'textarea', placeholder: 'Enter remarks here...' },
    { name: 'observation', label: 'Observation', type: 'textarea', placeholder: 'Enter observation here...' },
    { name: 'image', label: 'Evidence Image', type: 'image-upload' }
  ]
});

const createCustomQuestions = (sectionName) => ({
  name: `customQuestions_${sectionName}`,
  label: 'Additional Custom Questions',
  type: 'array',
  subType: 'custom-questions',
  itemLabel: 'Custom Question',
  fields: [
    { name: 'questionTitle', label: 'Custom Question Title', type: 'text', required: true, placeholder: 'Enter question' },
    { name: 'records', label: 'Records', type: 'textarea', placeholder: 'Enter records here...' },
    { name: 'remarks', label: 'Remarks', type: 'textarea', placeholder: 'Enter remarks here...' },
    { name: 'observation', label: 'Observation', type: 'textarea', placeholder: 'Enter observation here...' },
    { name: 'image', label: 'Evidence Image', type: 'image-upload' }
  ]
});

export const NETWORK_REPORT_INFO_SCHEMA = [
  { name: 'reportName', label: 'Report Name', type: 'text', required: true, placeholder: 'e.g. Q2 Assessment', readOnly: true },
  { name: 'auditDate', label: 'Audit Date', type: 'date', required: true, readOnly: true },
  { name: 'auditManager', label: 'Audit Manager', type: 'text', required: true, placeholder: 'e.g. Jane Smith', readOnly: true },
  { name: 'previousAuditDate', label: 'Previous Audit Date', type: 'date', required: true, readOnly: true },
  { name: 'reportNumber', label: 'Report Number', type: 'text', readOnly: true },
  { name: 'systemAuditName', label: 'System Audit Name', type: 'text', readOnly: true, value: 'Venue Network Audit Report' },
  { name: 'version', label: 'Version', type: 'number', required: true, placeholder: 'e.g. 1', readOnly: true },
  { name: 'nextAuditDate', label: 'Next Audit Date', type: 'date', readOnly: true }
];

export const NETWORK_VENUE_INFO_SCHEMA = [
  { name: 'region', label: 'Region', type: 'select', options: ['North', 'South', 'East', 'West', 'Central'], readOnly: true },
  { name: 'state', label: 'State', type: 'text', readOnly: true },
  { name: 'city', label: 'City', type: 'text', readOnly: true },
  { name: 'name', label: 'Venue Name', type: 'text', readOnly: true },
  { name: 'completeAddress', label: 'Address', type: 'text', readOnly: true },
  { name: 'pinCode', label: 'Pin Code', type: 'text', readOnly: true },
  { name: 'googleMapLocationStatus', label: 'Is Google Map location accurate?', type: 'radio', options: ['yes', 'no'], readOnly: true },
  { name: 'totalNoNetwork', label: 'Total no of Network', type: 'number', placeholder: 'e.g. 100' }
];

export const NETWORK_PERSONNEL_INFO_SCHEMA = [
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

export const NETWORK_ARCHITECTURE_SCHEMA = [
  createNetworkQuestion('nw_arch_1', 'NETWORK DIAGRAM AVAILABLE In venue'),
  createNetworkQuestion('nw_arch_2', 'IF the NETWORK DIAGRAM is VALIDATED?'),
  createNetworkQuestion('nw_arch_3', 'WHO HAS VALIDATED THE NETWORK DIAGRAM?', '(Network Auditor) Please mention the name and date of validation. After validation please put signature and date on the network diagram'),
  createNetworkQuestion('nw_arch_4', 'Validate the Network Diagram - Visibility and spacing', 'The network diagram must be designed with proper visibility and adequate spacing between symbols. All symbols used should be relevant and standardized'),
  createNetworkQuestion('nw_arch_5', 'Validate the Network Diagram - Primary Connectivity', 'Must be represented using straight line segments.'),
  createNetworkQuestion('nw_arch_6', 'Validate the Network Diagram - Backup Connectivity', 'Must be represented using dotted line segments for clear differentiation and visibility'),
  createNetworkQuestion('nw_arch_7', 'Validate the Network Diagram - Fibre/LAN Connections', 'All optical fibre connections or LAN connections must be clearly labelled and identifiable in the network diagram.'),
  createNetworkQuestion('nw_arch_8', 'Validate the Network Diagram - Index Page', 'The Index Page must clearly specify used and unused ports'),
  createNetworkQuestion('nw_arch_9', 'Validate the Network Diagram - Uplink ports', 'All uplink port numbers must be clearly mentioned and easily traceable in the diagram and index.'),
  createNetworkQuestion('nw_arch_10', 'Validate the Network Diagram - Switch naming', 'Switches must follow a standardized naming format: Core Switch: L1CS1, Distribution Switch: L1DS1, Access Switch: L1AS1, Extension Switch: L1AS1Ext1'),
  createNetworkQuestion('nw_arch_11', 'Check if assessment network isolated from any other network'),
  createNetworkQuestion('nw_arch_12', 'CHECK IF ALL UPLINK MARKED'),
  createNetworkQuestion('nw_arch_13', 'IP STANDARDIZATION FOLLOWED NODES? (AS PER EDUQUITY NORMS)'),
  createNetworkQuestion('nw_arch_14', 'CENTRE ALLOWS TO CHANGE THE IP ADDRESS'),
  createNetworkQuestion('nw_arch_15', 'THE CENTRE EQUIPED WITH Wi-Fi LAN'),
  createNetworkQuestion('nw_arch_16', 'IP CONFIGURATION- STATIC or DHCP'),
  createNetworkQuestion('nw_arch_17', 'All switches marked with naming', 'Check naming of the switch is done (Eg. lan 1 distribution switch is L1DS1 for access switch L1AS1)'),
  createCustomQuestions('arch')
];

export const PUBLIC_NETWORK_HARDENING_SCHEMA = [
  createNetworkQuestion('pub_hard_1', 'Check the Wi-Fi connection is available in the Venue'),
  createNetworkQuestion('pub_hard_2', 'IS WIFI ROUTER PASSWORD PROTECTED', 'SHOULD NOT CONTAIN THE DEFAULT PASSWORD/COMMON PASSWORD'),
  createNetworkQuestion('pub_hard_3', 'PASSWORD COMPLEXITY ', '(AT LEAST CONTAINS 8 CHARACTER LONG AND MUST CONTAIN UPPERCASE, LOWER CASE, NUMBER, SPECIAL CHARACTER)'),
  createNetworkQuestion('pub_hard_4', 'Frequency of password change ', 'Has the password been used for more than 180 days?'),
  createNetworkQuestion('pub_hard_5', 'PUBLIC NETWORK BEING MARKED PROPERLY', 'Network Rack and Termination Box'),
  createCustomQuestions('pub_hard')
];

export const NETWORK_INFRASTRUCTURE_SCHEMA = [
  createNetworkQuestion('net_inf_1', 'Is switch configuration done', 'Physically verify after login into switch if switch configuration done (Not applicable for un-managed switches)'),
  createNetworkQuestion('net_inf_2', 'Is switch port security enabled and working at Access layer switches (Mandatory for eduquity and preferred for Venue)', 'Check the port security by interchanging the LAN cable.'),
  createNetworkQuestion('net_inf_3', 'Is switch port security enabled and working at Access layer switches (Mandatory for eduquity and preferred for Venue)', 'Check the switch port security configuration file (Not applicable for un-managed switches)'),
  createNetworkQuestion('net_inf_4', 'Check for any unused ports in Network Switches (Mandatory for eduquity and preferred for Venue)', 'Check if all unused ports in shutdown mode (Not applicable for unmanaged switch)'),
  createNetworkQuestion('net_inf_5', 'Check if internet is available in public network only', 'Check for the internet that must not connected in the assessment network'),
  createNetworkQuestion('net_inf_6', 'Check if all the network are air gaped / VLAN (CCTV / Assessment network)', 'CCTV network must be separated physically / logically from assessment network (If logically separated then please mention the VLAN details)'),
  createNetworkQuestion('net_inf_7', 'Check if Index chart of the network switch is available (Mandatory for Venue)', 'Physically verify the Picture / Photo (if visual proof) and should be available in Venue history book'),
  createNetworkQuestion('net_inf_8', 'How each LAN segregated from each other', 'Check if the LAN are separated from each other Physically / Logically'),
  createNetworkQuestion('net_inf_9', 'How many networks / VLANs is available', 'Provide the details'),
  createNetworkQuestion('net_inf_10', 'Which make and model network switch are used in core layer (If Applicable)', 'Provide all the switch details'),
  createNetworkQuestion('net_inf_11', 'Core Switch Speed (Gigabit or 10/100/1000 Mbps) (If Applicable)', 'Provide the details. Scoring Pattern - Gigabit: C, Other than Gigabit: NC, Not Available: NA'),
  createNetworkQuestion('net_inf_12', 'Count of switches used in core layer (If Applicable)', 'Mention the count of switches'),
  createNetworkQuestion('net_inf_13', 'Which make and model network switches are used in distribution layer', 'Provide all the switch details'),
  createNetworkQuestion('net_inf_14', 'Check if the distribution switches are managed or un-managed', 'Provide the details. Scoring Pattern - Managed: C, Un-Managed: NC'),
  createNetworkQuestion('net_inf_15', 'Distribution Switches Speed (Gigabit or 10/100/1000 Mbps)', 'Provide the details. Scoring Pattern - Gigabit: C, Other than Gigabit: NC'),
  createNetworkQuestion('net_inf_16', 'Count of switches used in distribution layer', 'Mention the count of switches'),
  createNetworkQuestion('net_inf_17', 'Which make and model network switches are used in access layer', 'Provide all the switch details'),
  createNetworkQuestion('net_inf_18', 'Check if the access switches are managed or un-managed (Preferred for Venue)', 'Scoring Pattern - Managed: C, Un-Managed in Venue'),
  createNetworkQuestion('net_inf_19', 'Access Switch details and Speed (Gigabit or 10/100/1000 Mbps)', 'Provide the details. Scoring Pattern - Gigabit: C, Other than Gigabit: NC'),
  createNetworkQuestion('net_inf_20', 'Count of switches used in access layer', 'Mention the count of switches'),
  createNetworkQuestion('net_inf_21', 'What architecture is followed for networking', 'Star or any other network'),
  createNetworkQuestion('net_inf_22', 'LAN Cables Type', 'Check the cable type (CAT-6, Optical Fibre). Must be Gbps supported'),
  createNetworkQuestion('net_inf_23', 'Cable Installation Quality', 'Check the quality of LAN cable and wiring'),
  createNetworkQuestion('net_inf_24', 'Patch cable', 'Check the quality of Patch cable used and check if it is manual or company crimped with RJ45'),
  createNetworkQuestion('net_inf_25', 'Check for any additional unattended hardware/cables detected in Exam labs', 'Provide the details. Scoring Pattern - If not found: C, If found: NC'),
  createNetworkQuestion('net_inf_26', 'Uninterrupted power supply for all the network equipment', 'Check if uninterrupted power supply with adequate backup is provided to all the network equipment. Scoring Pattern - If Available with backup: C, If available without backup / Not available: NC'),
  createNetworkQuestion('net_inf_27', 'Check is node tagging done', '1. Check at end user side (I/O Box or LAN Cable) 2. Check at switch end side: i. With Patch panel - Marking on patch panel and Patch cord ii. Without patch panel - Marking on LAN cable'),
  createNetworkQuestion('net_inf_28', 'Check if Syslog server available', 'Please check if syslog server is available and configured'),
  createCustomQuestions('net_inf')
];

export const WAN_INFRASTRUCTURE_SCHEMA = [
  createNetworkQuestion('wan_inf_1', 'Check if internet is available', 'Provide the details (At least one internet source must be available)'),
  createNetworkQuestion('wan_inf_2', 'Who is the service provider', 'Provide the details'),
  createNetworkQuestion('wan_inf_3', 'What is the download and upload speed of internet', 'Check the speed of internet (Upload and download)'),
  createNetworkQuestion('wan_inf_4', 'Check if the backup internet is available', 'Provide the details'),
  createCustomQuestions('wan_inf')
];

export const SYSTEM_CONFIGURATION_SCHEMA = [
  createNetworkQuestion('sys_conf_1', 'Check which OS used on exam nodes', 'Provide the OS details'),
  createNetworkQuestion('sys_conf_2', 'Check if minimum hardware configuration of all nodes', 'Minimum configuration required is: 4 GB RAM (Preferred 4 GB and above) / I3 processor / 150 GB HDD / 15" and above monitor'),
  createNetworkQuestion('sys_conf_3', 'Check if minimum hardware configuration of candidate system are met for NETBOOT OS', 'Minimum configuration required is: 4 GB RAM / I3 processor / 150 GB HDD / 15" and above monitor'),
  createCustomQuestions('sys_conf')
];

export const NETWORK_CONFIGURATION_SCHEMA = [
  createNetworkQuestion('net_conf_1', 'Condition of Switch Rack/Patch Panels', 'Check if the cables are neatly arranged, the area is clean, there is enough light, space, and air flow.'),
  createNetworkQuestion('net_conf_2', 'Check the Network performance, latency', 'Check from the cmd with 1000 packet load. Scoring Pattern: Less than 2ms - C, 2ms to 4ms - I, Greater than 4ms - NC'),
  createNetworkQuestion('net_conf_3', 'Check efficacy of VLANs by pinging between VLANS (to be done after exam/shift)', 'Check by pinging between different VLANs (Inter VLAN ping must not happen)'),
  createNetworkQuestion('net_conf_4', 'Distribution switch to Access Switch Connection Status', 'Check for proper cabling and ping status (Server to client system). Ping reply must be less than 1ms'),
  createNetworkQuestion('net_conf_5', 'Check if firewall is available', 'Check if firewall is available for public network'),
  createNetworkQuestion('net_conf_6', 'Check uplink colour', 'Specific coloured CAT6 cables must be used for Uplink connectivity between access and distribution switches'),
  createNetworkQuestion('net_conf_7', 'Check whether all switch is properly dressed', 'If not dressed need the photos'),
  createNetworkQuestion('net_conf_8', 'Is Loop prevention enabled all switch', 'Check by creating loop in the network'),
  createNetworkQuestion('net_conf_9', 'Is Loop prevention enabled in access switch', 'Check by creating loop in the network. Scoring Pattern: For manageable switch Loop prevention enabled - C, If not enabled on manageable switch - NC, If manageable switch not available - NA'),
  createNetworkQuestion('net_conf_10', 'Check if dedicated server room is available', 'Any Picture / Photo (if visual proof) that is effective'),
  createNetworkQuestion('net_conf_11', 'Air-conditioning facility is provided in the server room and operational', 'Provide the details'),
  createNetworkQuestion('net_conf_12', 'Maximum UTP cable length between switch and end device', 'Check if length is less than 80mtr mentioned'),
  createNetworkQuestion('net_conf_13', 'Verify if structured cabling is implemented', 'No unauthorized or extra LAN cables, switches, or network nodes should be present in the exam labs'),
  createNetworkQuestion('net_conf_14', 'Verify if structured cabling is implemented', 'All network cables must be properly dressed, concealed, and laid on cable trays — not on the floor'),
  createNetworkQuestion('net_conf_15', 'Verify whether the network rack is locked and physically secured', 'If Rack is Available: Verify that the rack is locked. If Rack is Not Available: Mark as N/A (Not Applicable)'),
  createCustomQuestions('net_conf')
];

export const BACKUP_DEVICES_SCHEMA = [
  createNetworkQuestion('backup_dev_1', 'One Buffer switch for each LAN', 'Check and test the switch'),
  createNetworkQuestion('backup_dev_2', 'Five Power cable', 'Check and test the power cable'),
  createNetworkQuestion('backup_dev_3', 'Company crimped patch cable', 'Check and test the patch cord'),
  createNetworkQuestion('backup_dev_4', 'One Power extension board', 'Check and test the power extension board'),
  createNetworkQuestion('backup_dev_5', 'Network tool kit with all working equipment', 'Check and test the equipment'),
  createNetworkQuestion('backup_dev_6', 'One box of RJ45 connector', 'Any Picture / Photo (if visual proof) that is effective'),
  createNetworkQuestion('backup_dev_7', '3 Keyboard', 'Check and test the keyboard'),
  createNetworkQuestion('backup_dev_8', '3 Mouse', 'Check and test the mouse'),
  createNetworkQuestion('backup_dev_9', 'Any Other equipment is present', 'Mention in details'),
  createCustomQuestions('backup_dev')
];

export const NETWORK_SECURITY_COMPLIANCE_SCHEMA = [
  createNetworkQuestion('net_sec_1', 'Check if Eduquity owned or CISCO C1300 switches are installed at the center', 'Physically locate the switch and verify'),
  createNetworkQuestion('net_sec_2', 'Check if CISCO switches are configured as per Eduquity policy', 'Check with the help of technical support or switch configuration team'),
  createNetworkQuestion('net_sec_3', 'Check if Logs and Red Alerts are generated for all switches', 'Check with the help of technical support or switch configuration team'),
  createNetworkQuestion('net_sec_4', 'Check if MAC binding is carried out for all systems available at the centre', 'Check with the help of technical support or switch configuration team'),
  createNetworkQuestion('net_sec_5', 'Check if all unused switch ports are in shutdown mode', 'Check with the help of technical support or switch configuration team'),
  createNetworkQuestion('net_sec_6', 'Check if system-to-system are pinging', 'System to system should not ping anywhere in network'),
  createNetworkQuestion('net_sec_7', 'Check if WAN diagram is available at the center', 'WAN diagram should be available to check on how many devices internet is available'),
  createNetworkQuestion('net_sec_8', 'Check if network racks are locked and sealed', 'Network rack must be properly locked and sealed'),
  createNetworkQuestion('net_sec_9', 'Check if any additional or hidden devices/cables are connected to the exam network', 'Any additional device/cable should not be present in the exam network'),
  createNetworkQuestion('net_sec_10', 'Check if any suspicious cable extends from exam lab/server room to outside the exam area', 'Check for any suspicious cable available in exam network'),
  createNetworkQuestion('net_sec_11', 'Check if Syslog server is available and configured', 'Verify Syslog server configuration and log collection'),
  createCustomQuestions('net_sec')
];

export const NETWORK_PHOTO_EVIDENCE_SCHEMA = [
  {
    name: 'devicePhotos',
    label: 'Image of Equipments',
    type: 'device-photo-list',
    itemLabel: 'Device Photo',
    fields: [
      { name: 'deviceName', label: 'Device Name', type: 'text', placeholder: 'Enter device name' },
      { name: 'deviceImage', label: 'Device Photo', type: 'image-upload' }
    ]
  }
];

export const NETWORK_OBSERVATIONS_SCHEMA = [
  {
    name: 'auditScope',
    label: 'Audit scope',
    type: 'text',
  },
  {
    name: 'activity',
    label: 'Activities',
    type: 'text',
    placeholder: 'Power / Network / Admin infrastructure check',
  },
  {
    name: 'location',
    label: 'Locations of the audit',
    type: 'textarea',
    placeholder: 'Please mention the areas of Venue where the audit will be conducted (Example: LAB, Server Room)',
  },
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

export const NETWORK_SIGNATURES_SCHEMA = [
  { name: 'auditorSignature', label: 'Auditor Signature', type: 'signature' },
  { name: 'venueManagerSignature', label: 'Venue Manager Signature', type: 'signature' },
  { name: 'electricianSignature', label: 'Electrician Signature', type: 'signature' },
  { name: 'centerSeal', label: 'Center Seal', type: 'image-upload' }
];