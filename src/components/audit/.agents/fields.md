HEADER_FIELD_MAP = {
    'reportName': 'name',
    'version': 'version',
    'previousAuditDate': 'previous_audit_date',
    'nextAuditDate': 'next_audit_date',
    'strongPoints': 'strong_points',
    'toImprovePoints': 'to_improve_points',
}

SIGNATURE_FIELD_MAP = {
    'auditorSignature': 'auditor_signature',
    'venueManagerSignature': 'venue_manager_signature',
    'electricianSignature': 'electrician_signature',
    'centerSeal': 'center_seal',
    'auditorSignatureDate': 'auditor_signature_date',
    'venueManagerSignatureDate': 'venue_manager_signature_date',
    'electricianSignatureDate': 'electrician_signature_date',
}

STATE_ALLOWED_VALUES = [
    'draft', 'assign_user', 'in_progress', 'waiting_for_approval', 'approved', 'reject',
]
VENUE_FIELD_MAP = {
    'name': 'venue_name', 'city': 'city_name', 'contactNo': 'venue_contact_no',
    'email': 'venue_email', 'completeAddress': 'complete_addres',
    'totalNodes': 'total_nodes', 'pinCode': 'pin_code',
}
POWER_FIELD_MAP = {'auditScope': 'audit_scope'}
NETWORK_FIELD_MAP = {
    'auditScope': 'audit_scope', 'activity': 'activity', 'location': 'location',
    'totalNoNetwork': 'total_no_nw',
}
VENUE_AUDIT_FIELD_MAP = {
    'region': 'region', 'googleMapLocationStatus': 'google_map_location_status',
    'venueOwnerName': 'venue_owner_name', 'venueOwnerContact': 'venue_owner_contact',
    'venueOwnerEmail': 'venue_owner_email', 'venueAdministratorName': 'venue_administrator_name',
    'venueAdministratorContact': 'venue_administrator_contact', 'systemItAdminName': 'system_it_admin_name',
    'systemItAdminContact': 'system_it_admin_contact', 'venueLandlineNo': 'venue_landline_no',
    'otherCorrespondenceEmail': 'other_correspondence_email', 'alternateContactNo': 'alternate_contact_no',
    'cctvEntryExitCovered': 'cctv_entry_exit_covered',
    'cctvAllLabsAvailable': 'cctv_all_labs_available',
    'cctvServerRoomCovered': 'cctv_server_room_covered',
    'cctvRegistrationAreaAvailable': 'cctv_registration_area_available',
    'totalCctvCameras': 'total_cctv_cameras',
    'cctvConnectedToMonitors': 'cctv_connected_to_monitors',
    'cctv2mpAvailable': 'cctv_2mp_available',
    'cctv2mpWorking': 'cctv_2mp_working',
    'cctv5mpAvailable': 'cctv_5mp_available',
    'cctv5mpWorking': 'cctv_5mp_working',
    'cctvHigherAvailable': 'cctv_higher_available',
    'cctvHigherWorking': 'cctv_higher_working',
    'cctvLiveFeedRecorded': 'cctv_live_feed_recorded',
    'dvrNvrRecordingCapacity': 'dvr_nvr_recording_capacity',
    'venueReadyLiveCctvFeeding': 'venue_ready_live_cctv_feeding',
    'dvrOwnership': 'dvr_ownership',
    'cctvPassageAreaCovered': 'cctv_passage_area_covered',
    'dvrNvrType': 'dvr_nvr_type',
    'dvrNvrMakeModel': 'dvr_nvr_make_model',
    'overallCctvCoverageFeedback': 'overall_cctv_coverage_feedback',
}
ACCESSIBILITY_FIELD_MAP = {
    'distanceFromCity': 'distance_from_city', 'distanceFromAir': 'distance_from_air',
    'distanceFromRail': 'distance_from_rail', 'distanceFromBus': 'distance_from_bus',
    'nearBusStop': 'near_bus_stop', 'distanceFromPolice': 'distance_from_police',
    'policeStationName': 'police_station_name', 'distanceFromHospital': 'distance_from_hospital',
    'hospitalName': 'hospital_name', 'distanceFromFireStation': 'distance_from_fire_station',
    'roadQuality': 'road_quality', 'convenienceFeedback': 'convenience_feedback',
}
ADMINISTRATIVE_FIELD_MAP = {
    'washroomFacilityAvailable': 'washroom_facility_available', 'washroomQuality': 'washroom_quality',
    'washroomCleanliness': 'washroom_cleanliness', 'safeDrinkingWaterAvailable': 'safe_drinking_water_available',
    'parkingSpaceAvailable': 'parking_space_available', 'separateToiletAtParking': 'separate_toilet_at_parking',
    'securityGuardsAvailable': 'security_guards_available',
    'femaleFriskingEnclosureAvailable': 'female_frisking_enclosure_available',
    'candidateBelongingsStorage': 'candidate_belongings_storage',
    'lockersAvailable': 'lockers_available', 'comfortableSeatsAvailable': 'comfortable_seats_available',
    'adequateSpaceBetweenCandidates': 'adequate_space_between_candidates',
    'approximateSpaceBetweenCandidates': 'approximate_space_between_candidates',
    'liftFacilityAvailable': 'lift_facility_available', 'wheelchairRampAvailable': 'wheelchair_ramp_available',
    'groundFloorLabAvailable': 'ground_floor_lab_available', 'separateToiletForPh': 'separate_toilet_for_ph',
    'sufficientLightingAvailable': 'sufficient_lighting_available', 'airConditioningAdequate': 'air_conditioning_adequate',
    'venueManpowerCount': 'venue_manpower_count', 'staffType': 'staff_type',
    'backgroundVerificationAvailable': 'background_verification_available',
    'computerKnowledgeStaffCount': 'computer_knowledge_staff_count',
    'separateScanningPrintingArea': 'separate_scanning_printing_area',
    'numberOfPrinters': 'number_of_printers', 'printerType': 'printer_type',
    'numberOfScanners': 'number_of_scanners', 'scannerType': 'scanner_type',
    'campusBoundaryStatus': 'campus_boundary_status', 'firstAidKitAvailable': 'first_aid_kit_available',
    'fireSafetyEquipmentAvailable': 'fire_safety_equipment_available',
    'emergencyExitAvailable': 'emergency_exit_available', 'emergencyExitEachFloor': 'emergency_exit_each_floor',
    'visitorLogbookAvailable': 'visitor_logbook_available',
    'overallAdministrativeFeedback': 'overall_administrative_feedback',
}
SYSTEM_DETAILS_FIELD_MAP = {
    'totalSystemsAvailable': 'total_systems_available', 'machineLookAndFeel': 'machine_look_and_feel',
    'overallSystemFeedback': 'overall_system_feedback',
}
NODE_DETAILS_FIELD_MAP = {
    'testNodesAvailable': 'test_nodes_available', 'testNodesWorking': 'test_nodes_working',
    'bufferNodesAvailable': 'buffer_nodes_available', 'bufferNodesWorking': 'buffer_nodes_working',
    'registrationDeskNodesAvailable': 'registration_desk_nodes_available',
    'registrationDeskNodesWorking': 'registration_desk_nodes_working',
    'aadhaarDeskNodesAvailable': 'aadhaar_desk_nodes_available',
    'aadhaarDeskNodesWorking': 'aadhaar_desk_nodes_working',
    'videoRecordingMachinesAvailable': 'video_recording_machines_available',
    'videoRecordingMachinesWorking': 'video_recording_machines_working',
}
PROCESSOR_FIELD_MAP = {
    'i3Available': 'processor_i3_available', 'i3Working': 'processor_i3_working',
    'i3Speed': 'processor_i3_available_speed',
    'i5Available': 'processor_i5_available', 'i5Working': 'processor_i5_working',
    'i5Speed': 'processor_i5_available_speed',
    'i7Available': 'processor_i7_available', 'i7Working': 'processor_i7_working',
    'i7Speed': 'processor_i7_available_speed',
}
OS_FIELD_MAP = {
    'win7Available': 'win7_available', 'win7Working': 'win7_working',
    'win8Available': 'win8_available', 'win8Working': 'win8_working',
    'win10Available': 'win10_available', 'win10Working': 'win10_working',
    'win11Available': 'win11_available', 'win11Working': 'win11_working',
    'linuxAvailable': 'linux_available', 'linuxWorking': 'linux_working',
    'otherOsAvailable': 'other_os_available', 'otherOsWorking': 'other_os_working',
    'ieVersion': 'ie_version',
}
RAM_FIELD_MAP = {
    'ram2gbAvailable': 'ram_2gb_available', 'ram2gbWorking': 'ram_2gb_working',
    'ram4gbAvailable': 'ram_4gb_available', 'ram4gbWorking': 'ram_4gb_working',
    'ram8gbAvailable': 'ram_8gb_available', 'ram8gbWorking': 'ram_8gb_working',
}
HDD_FIELD_MAP = {
    'hdd256gbAvailable': 'hdd_256gb_available', 'hdd256gbWorking': 'hdd_256gb_working',
    'hdd512gbAvailable': 'hdd_512gb_available', 'hdd512gbWorking': 'hdd_512gb_working',
    'hdd1tbAvailable': 'hdd_1tb_available', 'hdd1tbWorking': 'hdd_1tb_working',
}
MONITOR_FIELD_MAP = {
    'monitor15Available': 'monitor_15_available', 'monitor15Working': 'monitor_15_working',
    'monitor17Available': 'monitor_17_available', 'monitor17Working': 'monitor_17_working',
    'monitor19Available': 'monitor_19_available', 'monitor19Working': 'monitor_19_working',
}
SOFTWARE_SECURITY_FIELD_MAP = {
    'osLicenseAvailable': 'os_license_available', 'systemFormatAllowed': 'system_format_allowed',
    'antivirusAvailable': 'antivirus_available', 'antivirusName': 'antivirus_name',
    'disableAntivirusPermitted': 'disable_antivirus_permitted', 'remoteSoftwareFound': 'remote_software_found',
}
LAB_DETAILS_FIELD_MAP = {
    'totalLabsAvailable': 'total_labs_available', 'totalLabsAllocatedExam': 'total_labs_allocated_exam',
    'labsSameBuilding': 'labs_same_building', 'distanceBetweenBuildings': 'distance_between_buildings',
    'labsSameFloor': 'labs_same_floor', 'labsInBasement': 'labs_in_basement',
    'partitionAvailability': 'partition_availability', 'partitionType': 'partition_type',
    'seatsLabelled': 'seats_labelled', 'seatingMatrixProvided': 'seating_matrix_provided',
    'dedicatedServerRoom': 'dedicated_server_room', 'serverRoomInsideLab': 'server_room_inside_lab',
    'registrationDeskProper': 'registration_desk_proper', 'overallLabFeedback': 'overall_lab_feedback',
}
CONCLUSION_FIELD_MAP = {
    'auditDuration': 'audit_duration', 'overallVenueRating': 'overall_venue_rating',
    'recommendedExamConduct': 'recommended_exam_conduct', 'otherPersonnelDetails': 'other_personnel_details',
}
POWER_LINE_FIELDS = [
    'supply_trasnfer_lines', 'trasnfer_earth_pit_lines', 'main_supply_lt_panel_lines',
    'disel_generator_lines', 'dg_check_in_stop_lines', 'dg_running_check_line', 'ups_lines',
    'ups_equipment_lines', 'ups_batteries_lines', 'ups_batteries_system_lines', 'eq_func_lines',
    'maintenance_record_lines', 'tools_spares_lines',
]
NETWORK_LINE_FIELDS = [
    'network_architecture_lines', 'public_network_harding_line', 'network_infrastructure_lines',
    'wan_infra_lines', 'system_conf_lines', 'network_conf_lines', 'backup_device_lines',
    'security_compliance_lines','nameplate_document_equipment_lines',
]
