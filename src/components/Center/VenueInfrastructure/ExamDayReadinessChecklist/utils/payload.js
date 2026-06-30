export const payload = (formData, userLoginData) => {
  const checklistMapping = {
    "Visitor/vendor Register": "visitor_register",
    "Outsiders Escorted with badge": "outsiders_escorted",
    "Labs & Server Restricted Access": "restricted_access",
    "Phones Collected": "phones_collected",
    "HHMD Used": "hhmd_used",
    "Staff Gadget Register": "gadget_register",
    "Random Gadget Checks": "random_gadget_checks",
    "Briefing Done": "briefing_done",
    "Power Supply OK": "power_supply_ok",
    "CCTV Monitored Checked": "cctv_checked",
    "Live lab Monitoring Done": "live_lab_monitoring",
    "System & Network Checked": "system_network_checked",
    "Diesel Available": "diesel_available",
    "Staff & Vendor Verified": "staff_vendor_id_verified",
  };

  const staffMapping = {
    venueManager: "venue_manager_count",
    labSupervisor: "lab_supervisor_count",
    regDeskManager: "reg_desk_manager_count",
    invigilators: "invigilators_count",
    serverManager: "server_manager_count",
    networkSupport: "network_support_count",
    friskingStaff: "frisking_staff_count",
    supportStaff: "support_staff_count",
  };

  const fields = [];
  const values = {};

  // Default fields (always send)
  const defaultFields = {
    project_id: userLoginData?.project_id,
    venue_id: userLoginData?.venue_id,
    state_id: userLoginData?.state_id,
    city_id: userLoginData?.city_id,
    created_by_id: userLoginData?.UserID,
    exam_date: formData.examDate || "",
    remarks: formData.remarks || "",
  };

  Object.entries(defaultFields).forEach(([key, value]) => {
    fields.push(key);
    values[key] = value;
  });

  // Checklist checkboxes (only true)
  Object.entries(checklistMapping).forEach(([label, field]) => {
    const checked =
      formData.checklist[label] ||
      (label === "Staff & Vendor Verified" &&
        formData.other.staffVendorVerified);
    if (checked) {
      fields.push(field);
      values[field] = true;
    }
  });

  // Staff counts (only >0)
  Object.entries(staffMapping).forEach(([key, field]) => {
    const value = Number(formData.staffCounts[key]);
    if (value > 0) {
      fields.push(field);
      values[field] = value;
    }
  });

  // Other fields
  if (formData.other.labSealTime) {
    fields.push("venue_lab_seal_opening_time");
    const date = new Date(formData.other.labSealTime);
    const formatted = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")} ${date
      .getHours()
      .toString()
      .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:00`;
    values["venue_lab_seal_opening_time"] = formatted;
  }

  const extraFields = [
    "report_status",
    "rdm_required_count",
    "reported_count",
    "suchita_verified_count",
    "hr_portal_verified_count",
  ];

  extraFields.forEach((field) => {
    fields.push(field);
    values[field] = formData[field] || "";
  });

  return { fields, values };
};
