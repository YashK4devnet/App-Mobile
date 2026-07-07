export const NETWORK_REPORT_INFO_SCHEMA = [
  { name: 'reportName', label: 'Report Name', type: 'text', required: true, placeholder: 'e.g. Q2 Assessment' },
  { name: 'auditDate', label: 'Audit Date', type: 'date', required: true },
  { name: 'auditManager', label: 'Audit Manager', type: 'text', required: true, placeholder: 'e.g. Jane Smith' },
  { name: 'previousAuditDate', label: 'Previous Audit Date', type: 'date', required: true },
  { name: 'reportNumber', label: 'Report Number', type: 'text', readOnly: true },
  { name: 'systemAuditName', label: 'System Audit Name', type: 'text', readOnly: true, value: 'Venue Network Audit Report' },
  { name: 'version', label: 'Version', type: 'number', required: true, placeholder: 'e.g. 1' },
  { name: 'nextAuditDate', label: 'Next Audit Date', type: 'date' }
];

export const NETWORK_VENUE_INFO_SCHEMA = [
  { name: 'region', label: 'Region', type: 'select', options: ['North', 'South', 'East', 'West', 'Central'] },
  { name: 'state', label: 'State', type: 'text' },
  { name: 'city', label: 'City', type: 'text' },
  { name: 'venueName', label: 'Venue Name', type: 'text' },
  { name: 'address', label: 'Address', type: 'text' },
  { name: 'pinCode', label: 'Pin Code', type: 'text' },
  { name: 'isMapAccurate', label: 'Is Google Map location accurate?', type: 'radio', options: ['yes', 'no'] },
  { name: 'totalNoOfNetwork', label: 'Total no of Network', type: 'number', placeholder: 'e.g. 100' }
];

export const NETWORK_PERSONNEL_INFO_SCHEMA = [
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

export const NETWORK_ARCHITECTURE_SCHEMA = [
  {
    name: 'nw_arch_1',
    type: 'network-question',
    label: 'NETWORK DIAGRAM AVAILABLE In venue',
    evidenceRecord: 'Visual / Document'
  },
  {
    name: 'nw_arch_2',
    type: 'network-question',
    label: 'IF the NETWORK DIAGRAM is VALIDATED?',
    evidenceRecord: 'Visual / Document'
  },
  {
    name: 'nw_arch_3',
    type: 'network-question',
    label: 'WHO HAS VALIDATED THE NETWORK DIAGRAM?',
    evidenceRecord: 'Visual / Document',
    remarksHint: '(Network Auditor) Please mention the name and date of validation. After validation please put signature and date on the network diagram'
  },
  {
    name: 'nw_arch_4',
    type: 'network-question',
    label: 'Validate the Network Diagram - Visibility and spacing',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'The network diagram must be designed with proper visibility and adequate spacing between symbols. All symbols used should be relevant and standardized'
  },
  {
    name: 'nw_arch_5',
    type: 'network-question',
    label: 'Validate the Network Diagram - Primary Connectivity',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'Must be represented using straight line segments.'
  },
  {
    name: 'nw_arch_6',
    type: 'network-question',
    label: 'Validate the Network Diagram - Backup Connectivity',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'Must be represented using dotted line segments for clear differentiation and visibility'
  },
  {
    name: 'nw_arch_7',
    type: 'network-question',
    label: 'Validate the Network Diagram - Fibre/LAN Connections',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'All optical fibre connections or LAN connections must be clearly labelled and identifiable in the network diagram.'
  },
  {
    name: 'nw_arch_8',
    type: 'network-question',
    label: 'Validate the Network Diagram - Index Page',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'The Index Page must clearly specify used and unused ports'
  },
  {
    name: 'nw_arch_9',
    type: 'network-question',
    label: 'Validate the Network Diagram - Uplink ports',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'All uplink port numbers must be clearly mentioned and easily traceable in the diagram and index.'
  },
  {
    name: 'nw_arch_10',
    type: 'network-question',
    label: 'Validate the Network Diagram - Switch naming',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'Switches must follow a standardized naming format: Core Switch: L1CS1, Distribution Switch: L1DS1, Access Switch: L1AS1, Extension Switch: L1AS1Ext1'
  },
  {
    name: 'nw_arch_11',
    type: 'network-question',
    label: 'Check if assessment network isolated from any other network',
    evidenceRecord: 'Visual / Document'
  },
  {
    name: 'nw_arch_12',
    type: 'network-question',
    label: 'CHECK IF ALL UPLINK MARKED',
    evidenceRecord: 'Visual / Document'
  },
  {
    name: 'nw_arch_13',
    type: 'network-question',
    label: 'IP STANDARDIZATION FOLLOWED NODES? (AS PER EDUQUITY NORMS)',
    evidenceRecord: 'Visual / Document'
  },
  {
    name: 'nw_arch_14',
    type: 'network-question',
    label: 'CENTRE ALLOWS TO CHANGE THE IP ADDRESS',
    evidenceRecord: 'Visual / Document'
  },
  {
    name: 'nw_arch_15',
    type: 'network-question',
    label: 'THE CENTRE EQUIPED WITH Wi-Fi LAN',
    evidenceRecord: 'Visual / Document'
  },
  {
    name: 'nw_arch_16',
    type: 'network-question',
    label: 'IP CONFIGURATION- STATIC or DHCP',
    evidenceRecord: 'Visual / Document'
  },
  {
    name: 'nw_arch_17',
    type: 'network-question',
    label: 'All switches marked with naming',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'Check naming of the switch is done (Eg. lan 1 distribution switch is L1DS1 for access switch L1AS1)'
  }
];

export const PUBLIC_NETWORK_HARDENING_SCHEMA = [
  {
    name: 'pub_hard_1',
    type: 'network-question',
    label: 'Check the Wi-Fi connection is available in the Venue',
    evidenceRecord: 'Visual / Document'
  },
  {
    name: 'pub_hard_2',
    type: 'network-question',
    label: 'IS WIFI ROUTER PASSWORD PROTECTED',
    evidenceRecord: 'Visual / Document',
    remarksHint: "SHOULD NOT CONTAIN THE DEFAULT PASSWORD/COMMON PASSWORD"
  },
  {
    name: 'pub_hard_3',
    type: 'network-question',
    label: 'PASSWORD COMPLEXITY ',
    evidenceRecord: 'Visual / Document',
    remarksHint: "(AT LEAST CONTAINS 8 CHARACTER LONG AND MUST CONTAIN UPPERCASE, LOWER CASE, NUMBER, SPECIAL CHARACTER)"
  },
  {
    name: 'pub_hard_4',
    type: 'network-question',
    label: 'Frequency of password change ',
    evidenceRecord: 'Visual / Document',
    remarksHint: "Has the password been used for more than 180 days?"
  },
  {
    name: 'pub_hard_5',
    type: 'network-question',
    label: 'PUBLIC NETWORK BEING MARKED PROPERLY',
    evidenceRecord: 'Visual / Document',
    remarksHint: "Network Rack and Termination Box"
  }
];

export const NETWORK_INFRASTRUCTURE_SCHEMA = [
  {
    name: 'net_inf_1',
    type: 'network-question',
    label: 'Is switch configuration done',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'Physically verify after login into switch if switch configuration done (Not applicable for un-managed switches)'
  },
  {
    name: 'net_inf_2',
    type: 'network-question',
    label: 'Is switch port security enabled and working at Access layer switches (Mandatory for eduquity and preferred for Venue)',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'Check the port security by interchanging the LAN cable.'
  },
  {
    name: 'net_inf_3',
    type: 'network-question',
    label: 'Is switch port security enabled and working at Access layer switches (Mandatory for eduquity and preferred for Venue)',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'Check the switch port security configuration file (Not applicable for un-managed switches)'
  },
  {
    name: 'net_inf_4',
    type: 'network-question',
    label: 'Check for any unused ports in Network Switches (Mandatory for eduquity and preferred for Venue)',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'Check if all unused ports in shutdown mode (Not applicable for unmanaged switch)'
  },
  {
    name: 'net_inf_5',
    type: 'network-question',
    label: 'Check if internet is available in public network only',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'Check for the internet that must not connected in the assessment network'
  },
  {
    name: 'net_inf_6',
    type: 'network-question',
    label: 'Check if all the network are air gaped / VLAN (CCTV / Assessment network)',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'CCTV network must be separated physically / logically from assessment network (If logically separated then please mention the VLAN details)'
  },
  {
    name: 'net_inf_7',
    type: 'network-question',
    label: 'Check if Index chart of the network switch is available (Mandatory for Venue)',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'Physically verify the Picture / Photo (if visual proof) and should be available in Venue history book'
  },
  {
    name: 'net_inf_8',
    type: 'network-question',
    label: 'How each LAN segregated from each other',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'Check if the LAN are separated from each other Physically / Logically'
  },
  {
    name: 'net_inf_9',
    type: 'network-question',
    label: 'How many networks / VLANs is available',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'Provide the details'
  },
  {
    name: 'net_inf_10',
    type: 'network-question',
    label: 'Which make and model network switch are used in core layer (If Applicable)',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'Provide all the switch details'
  },
  {
    name: 'net_inf_11',
    type: 'network-question',
    label: 'Core Switch Speed (Gigabit or 10/100/1000 Mbps) (If Applicable)',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'Provide the details. Scoring Pattern - Gigabit: C, Other than Gigabit: NC, Not Available: NA'
  },
  {
    name: 'net_inf_12',
    type: 'network-question',
    label: 'Count of switches used in core layer (If Applicable)',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'Mention the count of switches'
  },
  {
    name: 'net_inf_13',
    type: 'network-question',
    label: 'Which make and model network switches are used in distribution layer',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'Provide all the switch details'
  },
  {
    name: 'net_inf_14',
    type: 'network-question',
    label: 'Check if the distribution switches are managed or un-managed',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'Provide the details. Scoring Pattern - Managed: C, Un-Managed: NC'
  },
  {
    name: 'net_inf_15',
    type: 'network-question',
    label: 'Distribution Switches Speed (Gigabit or 10/100/1000 Mbps)',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'Provide the details. Scoring Pattern - Gigabit: C, Other than Gigabit: NC'
  },
  {
    name: 'net_inf_16',
    type: 'network-question',
    label: 'Count of switches used in distribution layer',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'Mention the count of switches'
  },
  {
    name: 'net_inf_17',
    type: 'network-question',
    label: 'Which make and model network switches are used in access layer',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'Provide all the switch details'
  },
  {
    name: 'net_inf_18',
    type: 'network-question',
    label: 'Check if the access switches are managed or un-managed (Preferred for Venue)',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'Scoring Pattern - Managed: C, Un-Managed in Venue'
  },
  {
    name: 'net_inf_19',
    type: 'network-question',
    label: 'Access Switch details and Speed (Gigabit or 10/100/1000 Mbps)',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'Provide the details. Scoring Pattern - Gigabit: C, Other than Gigabit: NC'
  },
  {
    name: 'net_inf_20',
    type: 'network-question',
    label: 'Count of switches used in access layer',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'Mention the count of switches'
  },
  {
    name: 'net_inf_21',
    type: 'network-question',
    label: 'What architecture is followed for networking',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'Star or any other network'
  },
  {
    name: 'net_inf_22',
    type: 'network-question',
    label: 'LAN Cables Type',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'Check the cable type (CAT-6, Optical Fibre). Must be Gbps supported'
  },
  {
    name: 'net_inf_23',
    type: 'network-question',
    label: 'Cable Installation Quality',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'Check the quality of LAN cable and wiring'
  },
  {
    name: 'net_inf_24',
    type: 'network-question',
    label: 'Patch cable',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'Check the quality of Patch cable used and check if it is manual or company crimped with RJ45'
  },
  {
    name: 'net_inf_25',
    type: 'network-question',
    label: 'Check for any additional unattended hardware/cables detected in Exam labs',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'Provide the details. Scoring Pattern - If not found: C, If found: NC'
  },
  {
    name: 'net_inf_26',
    type: 'network-question',
    label: 'Uninterrupted power supply for all the network equipment',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'Check if uninterrupted power supply with adequate backup is provided to all the network equipment. Scoring Pattern - If Available with backup: C, If available without backup / Not available: NC'
  },
  {
    name: 'net_inf_27',
    type: 'network-question',
    label: 'Check is node tagging done',
    evidenceRecord: 'Visual / Document',
    remarksHint: '1. Check at end user side (I/O Box or LAN Cable) 2. Check at switch end side: i. With Patch panel - Marking on patch panel and Patch cord ii. Without patch panel - Marking on LAN cable'
  },
  {
    name: 'net_inf_28',
    type: 'network-question',
    label: 'Check if Syslog server available',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'Please check if syslog server is available and configured'
  }
];

export const WAN_INFRASTRUCTURE_SCHEMA = [
  {
    name: 'wan_inf_1',
    type: 'network-question',
    label: 'Check if internet is available',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'Provide the details (At least one internet source must be available)'
  },
  {
    name: 'wan_inf_2',
    type: 'network-question',
    label: 'Who is the service provider',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'Provide the details'
  },
  {
    name: 'wan_inf_3',
    type: 'network-question',
    label: 'What is the download and upload speed of internet',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'Check the speed of internet (Upload and download)'
  },
  {
    name: 'wan_inf_4',
    type: 'network-question',
    label: 'Check if the backup internet is available',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'Provide the details'
  }
];

export const SYSTEM_CONFIGURATION_SCHEMA = [
  {
    name: 'sys_conf_1',
    type: 'network-question',
    label: 'Check which OS used on exam nodes',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'Provide the OS details'
  },
  {
    name: 'sys_conf_2',
    type: 'network-question',
    label: 'Check if minimum hardware configuration of all nodes',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'Minimum configuration required is: 4 GB RAM (Preferred 4 GB and above) / I3 processor / 150 GB HDD / 15" and above monitor'
  },
  {
    name: 'sys_conf_3',
    type: 'network-question',
    label: 'Check if minimum hardware configuration of candidate system are met for NETBOOT OS',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'Minimum configuration required is: 4 GB RAM / I3 processor / 150 GB HDD / 15" and above monitor'
  }
];

export const NETWORK_CONFIGURATION_SCHEMA = [
  {
    name: 'net_conf_1',
    type: 'network-question',
    label: 'Condition of Switch Rack/Patch Panels',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'Check if the cables are neatly arranged, the area is clean, there is enough light, space, and air flow.'
  },
  {
    name: 'net_conf_2',
    type: 'network-question',
    label: 'Check the Network performance, latency',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'Check from the cmd with 1000 packet load. Scoring Pattern: Less than 2ms - C, 2ms to 4ms - I, Greater than 4ms - NC'
  },
  {
    name: 'net_conf_3',
    type: 'network-question',
    label: 'Check efficacy of VLANs by pinging between VLANS (to be done after exam/shift)',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'Check by pinging between different VLANs (Inter VLAN ping must not happen)'
  },
  {
    name: 'net_conf_4',
    type: 'network-question',
    label: 'Distribution switch to Access Switch Connection Status',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'Check for proper cabling and ping status (Server to client system). Ping reply must be less than 1ms'
  },
  {
    name: 'net_conf_5',
    type: 'network-question',
    label: 'Check if firewall is available',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'Check if firewall is available for public network'
  },
  {
    name: 'net_conf_6',
    type: 'network-question',
    label: 'Check uplink colour',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'Specific coloured CAT6 cables must be used for Uplink connectivity between access and distribution switches'
  },
  {
    name: 'net_conf_7',
    type: 'network-question',
    label: 'Check whether all switch is properly dressed',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'If not dressed need the photos'
  },
  {
    name: 'net_conf_8',
    type: 'network-question',
    label: 'Is Loop prevention enabled all switch',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'Check by creating loop in the network'
  },
  {
    name: 'net_conf_9',
    type: 'network-question',
    label: 'Is Loop prevention enabled in access switch',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'Check by creating loop in the network. Scoring Pattern: For manageable switch Loop prevention enabled - C, If not enabled on manageable switch - NC, If manageable switch not available - NA'
  },
  {
    name: 'net_conf_10',
    type: 'network-question',
    label: 'Check if dedicated server room is available',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'Any Picture / Photo (if visual proof) that is effective'
  },
  {
    name: 'net_conf_11',
    type: 'network-question',
    label: 'Air-conditioning facility is provided in the server room and operational',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'Provide the details'
  },
  {
    name: 'net_conf_12',
    type: 'network-question',
    label: 'Maximum UTP cable length between switch and end device',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'Check if length is less than 80mtr mentioned'
  },
  {
    name: 'net_conf_13',
    type: 'network-question',
    label: 'Verify if structured cabling is implemented',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'No unauthorized or extra LAN cables, switches, or network nodes should be present in the exam labs'
  },
  {
    name: 'net_conf_14',
    type: 'network-question',
    label: 'Verify if structured cabling is implemented',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'All network cables must be properly dressed, concealed, and laid on cable trays — not on the floor'
  },
  {
    name: 'net_conf_15',
    type: 'network-question',
    label: 'Verify whether the network rack is locked and physically secured',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'If Rack is Available: Verify that the rack is locked. If Rack is Not Available: Mark as N/A (Not Applicable)'
  }
];

export const BACKUP_DEVICES_SCHEMA = [
  {
    name: 'backup_dev_1',
    type: 'network-question',
    label: 'One Buffer switch for each LAN',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'Check and test the switch'
  },
  {
    name: 'backup_dev_2',
    type: 'network-question',
    label: 'Five Power cable',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'Check and test the power cable'
  },
  {
    name: 'backup_dev_3',
    type: 'network-question',
    label: 'Company crimped patch cable',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'Check and test the patch cord'
  },
  {
    name: 'backup_dev_4',
    type: 'network-question',
    label: 'One Power extension board',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'Check and test the power extension board'
  },
  {
    name: 'backup_dev_5',
    type: 'network-question',
    label: 'Network tool kit with all working equipment',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'Check and test the equipment'
  },
  {
    name: 'backup_dev_6',
    type: 'network-question',
    label: 'One box of RJ45 connector',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'Any Picture / Photo (if visual proof) that is effective'
  },
  {
    name: 'backup_dev_7',
    type: 'network-question',
    label: '3 Keyboard',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'Check and test the keyboard'
  },
  {
    name: 'backup_dev_8',
    type: 'network-question',
    label: '3 Mouse',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'Check and test the mouse'
  },
  {
    name: 'backup_dev_9',
    type: 'network-question',
    label: 'Any Other equipment is present',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'Mention in details'
  }
];

export const NETWORK_SECURITY_COMPLIANCE_SCHEMA = [
  {
    name: 'net_sec_1',
    type: 'network-question',
    label: 'Check if Eduquity owned or CISCO C1300 switches are installed at the center',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'Physically locate the switch and verify'
  },
  {
    name: 'net_sec_2',
    type: 'network-question',
    label: 'Check if CISCO switches are configured as per Eduquity policy',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'Check with the help of technical support or switch configuration team'
  },
  {
    name: 'net_sec_3',
    type: 'network-question',
    label: 'Check if Logs and Red Alerts are generated for all switches',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'Check with the help of technical support or switch configuration team'
  },
  {
    name: 'net_sec_4',
    type: 'network-question',
    label: 'Check if MAC binding is carried out for all systems available at the centre',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'Check with the help of technical support or switch configuration team'
  },
  {
    name: 'net_sec_5',
    type: 'network-question',
    label: 'Check if all unused switch ports are in shutdown mode',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'Check with the help of technical support or switch configuration team'
  },
  {
    name: 'net_sec_6',
    type: 'network-question',
    label: 'Check if system-to-system are pinging',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'System to system should not ping anywhere in network'
  },
  {
    name: 'net_sec_7',
    type: 'network-question',
    label: 'Check if WAN diagram is available at the center',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'WAN diagram should be available to check on how many devices internet is available'
  },
  {
    name: 'net_sec_8',
    type: 'network-question',
    label: 'Check if network racks are locked and sealed',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'Network rack must be properly locked and sealed'
  },
  {
    name: 'net_sec_9',
    type: 'network-question',
    label: 'Check if any additional or hidden devices/cables are connected to the exam network',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'Any additional device/cable should not be present in the exam network'
  },
  {
    name: 'net_sec_10',
    type: 'network-question',
    label: 'Check if any suspicious cable extends from exam lab/server room to outside the exam area',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'Check for any suspicious cable available in exam network'
  },
  {
    name: 'net_sec_11',
    type: 'network-question',
    label: 'Check if Syslog server is available and configured',
    evidenceRecord: 'Visual / Document',
    remarksHint: 'Verify Syslog server configuration and log collection'
  }
];

export const NETWORK_PHOTO_EVIDENCE_SCHEMA = [
  {
    name: 'devicePhotos',
    label: 'Photo Evidence of Devices',
    type: 'device-photo-list'
  }
];

export const NETWORK_OBSERVATIONS_SCHEMA = [
  {
    name: 'obs_audit_scope',
    label: 'Audit scope',
    type: 'text',
  },
  {
    name: 'obs_audit_activities',
    label: 'Activities',
    type: 'text',
    placeholder: 'Power / Network / Admin infrastructure check'
  },
  {
    name: 'obs_locations_audit',
    label: 'Locations of the audit',
    type: 'textarea',
    placeholder: 'Please mention the areas of Venue where the audit will be conducted (Example: LAB, Server Room)'
  },
  {
    type: 'heading',
    label: 'Observations',
    className: 'text-[#F98A15] border-[#F98A15]/30 mt-6'
  },
  {
    name: 'obs_list',
    label: 'Observations List',
    type: 'numbered-text-list'
  },
  {
    type: 'heading',
    label: 'Signatures & Verification',
    className: 'text-white/50 border-white/10 mt-6'
  },
  {
    name: 'obs_cs_representative_sig',
    label: 'CS / Venue Management Representative Signature & Date',
    type: 'signature',
    required: true
  },
  {
    name: 'obs_network_auditor_sig',
    label: 'Network Auditor Signature & Date',
    type: 'signature',
    required: true
  },
  {
    name: 'obs_venue_seal',
    label: 'Venue Seal',
    type: 'image-upload',
    required: true
  }
];