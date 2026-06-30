export const payload = (formData, user) => {
  // Mapping UI labels → API field names
  const checklistMapping = {
    "System Launch": "system_launching",
    "Gate Entry Started": "gate_entry_started",
    "Registration Ready": "registration_ready",
    "ID Verified": "id_verified",
    "Stationary Distributed": "stationary_distributed",
    Frisking: "frisking_done",
    "Manpower Shuffling": "manpower_shuffling",
    "Biometric OK": "biometric_smooth",
    "PwD Prioritized": "pwd_priority",
    "Rough Sheets Distributed": "rough_sheet_distributed",

    "Candidates Seated": "candidates_seated",
    "Exam Started On Time": "exam_started_time",
    "Login Started": "login_started",
    "Docs Matched": "document_count_matched",
    "Attendance Done": "attendance_completed",
    "Exam Completed": "exam_completed_time",
    "Commission Copy Collected": "commission_copy_collected",
    "Exit Verified": "exit_verification_done",
    "Docs Sorted": "documents_sorted",
    "Rough Sheets Collected": "rough_sheet_collected",
    "Packing Done": "packing_done",
    "Communication Done": "communication_done",
    "Exam Data Uploaded": "data_uploaded",

    "Accessible Lab Arranged": "ground_floor_arranged",
    "Scribes Verified": "scribes_verified",
    "Ramps Ready": "ramps_ready",
    "Extra Time Provided": "extra_time_provided",
    "Staff Trained": "staff_trained_pwd",
    "Staff Assistance": "staff_assigned_assistance",
    "PwD Report Submitted": "pwd_report_submitted",
  };

  const fields = [];
  const values = {};

  // --- Always send these defaults ---
  const defaultFields = {
    project_id: user?.project_id,
    venue_id: user?.venue_id,
    state_id: user?.state_id,
    city_id: user?.city_id,
    created_by_id: user?.UserID,
    exam_date: formData.examDate || "",
    remarks: formData.remarks || "",
  };

  Object.entries(defaultFields).forEach(([key, value]) => {
    fields.push(key);
    values[key] = value;
  });

  // --- Checklist ---
  Object.entries(checklistMapping).forEach(([label, field]) => {
    fields.push(field);
    values[field] = !!formData.checklist[label];
  });

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    const ss = "00"; // seconds always fixed

    return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
  };

  fields.push("exam_start_time");
  values["exam_start_time"] = formatDateTime(formData.exam_start_time);

  fields.push("exam_end_time");
  values["exam_end_time"] = formatDateTime(formData.exam_end_time);

  const extraFields = [
    "shift",
    "registration_start_on_time",
    "lab_entry_start_on_time",
    "pwd_candidate_present",
    "scribe_shortage",
    "total_allotted_candidates",
    "present_candidates",
    "pwd_candidates",
    "lab_exit_done_for_all_candidates",
  ];

  extraFields.forEach((field) => {
    fields.push(field);
    values[field] = formData[field] || "";
  });

  return { fields, values };
};
