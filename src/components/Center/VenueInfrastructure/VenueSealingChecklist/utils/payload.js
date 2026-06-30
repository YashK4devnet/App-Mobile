export const payload = (formData, user) => {
  const checklistMapping = {
    "Attendance Packed": "attendance_packed",
    "Exam Materials Sealed": "exam_materials_sealed",
    "Rough Sheet Destroyed": "rough_sheet_destroyed",
    "CCTV Backup": "cctv_backed_up",
    "CCTV Reviewed": "cctv_reviewed",
    "Venue Restored": "venue_restored",
    "Final Report Submitted": "final_report_submitted",
    "Venue Seal Uploaded": "venue_seal_uploaded",
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

  // --- Checklist (true/false, always send default false) ---
  Object.entries(checklistMapping).forEach(([label, field]) => {
    fields.push(field);
    values[field] = !!formData.checklist[label];
  });

  // --- Timings (always send, formatted or empty) ---
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

  fields.push("docs_uploaded_time");
  values["docs_uploaded_time"] = formatDateTime(formData.docs_uploaded_time);

  fields.push("docs_submitted_time");
  values["docs_submitted_time"] = formatDateTime(formData.docs_submitted_time);

  const extraFields = [
    "shift",
    "all_slots_completed",
    "equipments_secured",
    "lab_sealed",
    "server_lab_sealed",
  ];

  extraFields.forEach((field) => {
    fields.push(field);
    values[field] = formData[field] || "";
  });

  return { fields, values };
};
