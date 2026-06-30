import { useState } from "react";
import {
  FiCalendar,
  FiUser,
  FiMapPin,
  FiHome,
  FiCheckSquare,
  FiImage,
  FiTrash2,
  FiUploadCloud,
  FiCamera,
  FiSettings,
  FiInfo,
} from "react-icons/fi";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";

import { payload } from "../utils/payload";
import styles from "./ChecklistForm.module.css";
import { createChecklist } from "../api/createChecklist";
import { uploadImage } from "../api/uploadImage";

import { compressImage } from "../utils/compressImage";
const ChecklistForm = ({ handleCancel, onChecklistCreated }) => {
  const userLoginData = JSON.parse(localStorage.getItem("loginData") || "{}");

  const [formData, setFormData] = useState({
    project: userLoginData?.employee_assigned_project,
    venue: userLoginData?.employee_assigned_venue,
    createdBy: userLoginData?.name,
    examDate: "",
    checklist: {},
    staffCounts: {
      venueManager: "",
      labSupervisor: "",
      regDeskManager: "",
      invigilators: "",
      serverManager: "",
      networkSupport: "",
      friskingStaff: "",
      supportStaff: "",
    },
    other: {
      staffVendorVerified: false,
      labSealTime: "",
    },
    remarks: "",
    file_name: [],
    image_base64: [],
    report_status: "",
    rdm_required_count: "",
    reported_count: "",
    suchita_verified_count: "",
    hr_portal_verified_count: "",
  });
  const [errorModal, setErrorModal] = useState({ show: false, message: "" });
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");

  const updateField = (name, value) =>
    setFormData((prev) => ({ ...prev, [name]: value }));

  const handleCheckbox = (name) =>
    setFormData((prev) => ({
      ...prev,
      checklist: { ...prev.checklist, [name]: !prev.checklist[name] },
    }));

  const handleStaffChange = (name, value) => {
    if (value === "" || /^[0-9]+$/.test(value)) {
      setFormData((prev) => ({
        ...prev,
        staffCounts: { ...prev.staffCounts, [name]: value },
      }));
    }
  };

  const handleOtherCheckbox = (name) =>
    setFormData((prev) => ({
      ...prev,
      other: { ...prev.other, [name]: !prev.other[name] },
    }));

  const handleOtherFieldChange = (name, value) =>
    setFormData((prev) => ({
      ...prev,
      other: { ...prev.other, [name]: value },
    }));

  // Open gallery and pick images
  const handleAddPhoto = async () => {
    try {
      const result = await Camera.pickImages({
        quality: 90,
        limit: 5,
      });

      const newBase64 = [];
      const newFileNames = [];

      for (let i = 0; i < result.photos.length; i++) {
        const photo = result.photos[i];

        if (photo.webPath) {
          const response = await fetch(photo.webPath);
          const blob = await response.blob();

          // ✅ Compress image before converting to base64
          const compressedBase64 = await compressImage(blob, 1024, 0.7);

          newBase64.push(compressedBase64);

          const name = photo.path
            ? photo.path.split("/").pop()
            : `image_${Date.now()}_${i}.jpg`;
          newFileNames.push(name);
        }
      }

      setFormData((prev) => ({
        ...prev,
        image_base64: [...prev.image_base64, ...newBase64],
        file_name: [...prev.file_name, ...newFileNames],
      }));
    } catch (err) {
      console.log("User cancelled gallery or error:", err);
    }
  };

  const handleTakePhoto = async () => {
    try {
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.Uri, // ✅ same as gallery
        quality: 90,
        source: CameraSource.Camera,
      });

      if (photo.webPath) {
        const response = await fetch(photo.webPath);
        const blob = await response.blob();

        // ✅ Compress image before base64
        const compressedBase64 = await compressImage(blob, 1024, 0.7); // resize to max 1024px, 70% quality

        const fileName = photo.path
          ? photo.path.split("/").pop()
          : `photo_${Date.now()}.jpg`;

        setFormData((prev) => ({
          ...prev,
          image_base64: [...prev.image_base64, compressedBase64],
          file_name: [...prev.file_name, fileName],
        }));
      }
    } catch (err) {
      console.log("User cancelled camera or error:", err);
    }
  };

  // Remove photo from arrays
  const removePhoto = (i) =>
    setFormData((prev) => ({
      ...prev,
      image_base64: prev.image_base64.filter((_, idx) => idx !== i),
      file_name: prev.file_name.filter((_, idx) => idx !== i),
    }));

  const handleSubmitForm = async () => {
    if (!formData.examDate) {
      setErrorModal({ show: true, message: "Please select the exam date." });
      return;
    }

    if (formData.image_base64.length === 0) {
      setErrorModal({
        show: true,
        message: "Please attach at least one image to create a checklist.",
      });
      return;
    }

    try {
      setLoading(true);
      setLoadingText("Creating checklist...");

      // Step 1: Create checklist
      const payloadData = payload(formData, userLoginData);
      const response = await createChecklist(userLoginData, payloadData);

      if (!response.Status) {
        setLoading(false);
        setErrorModal({ show: true, message: response.Message });
        return;
      }
      let newChecklist = null;
      if (response.data && response.data["New resource"]) {
        newChecklist = response.data["New resource"][0];

        // save to localStorage (merged)
        const stored = JSON.parse(
          localStorage.getItem("ReadinessChecklistData")
        ) || {
          "New resource": [],
        };
        stored["New resource"] = [...stored["New resource"], newChecklist];
        localStorage.setItem("ReadinessChecklistData", JSON.stringify(stored));
      }

      // Step 2: If images exist, upload them
      if (formData.image_base64.length > 0) {
        setLoadingText("Uploading images...");
        const imagesPayload = {
          fields: ["image_base64"],
          values: formData.image_base64.map((b64) => ({
            image_base64: b64,
          })),
        };

        const checklistId = response.Id;

        const uploadResponse = await uploadImage(
          userLoginData,
          imagesPayload,
          checklistId
        );

        if (!uploadResponse.Status) {
          setLoading(false);
          setErrorModal({ show: true, message: uploadResponse.Message });
          return;
        } else {
          setLoading(false);
          setSuccessMessage(
            "✅ Checklist created successfully with image upload."
          );

          setTimeout(() => {
            setSuccessMessage("");
            if (onChecklistCreated) onChecklistCreated(newChecklist);
            handleCancel();
          }, 2000);
        }
      } else {
        setLoading(false);
        setSuccessMessage(response.Message);

        setTimeout(() => {
          setSuccessMessage("");
          handleCancel();
        }, 2000);
      }
    } catch (err) {
      setLoading(false);
      setErrorModal({
        show: true,
        message: "Something went wrong. Please try again.",
      });
      console.error(err);
    }
  };

  return (
    <>
      {loading && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <p className={styles.modalMessage}>{loadingText}</p>
            <div className={styles.spinner}></div>
          </div>
        </div>
      )}
      {successMessage && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <p className={styles.modalMessage}>{successMessage}</p>
          </div>
        </div>
      )}
      {errorModal.show && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <p className={styles.modalMessage}>{errorModal.message}</p>
            <button
              className={styles.modalButton}
              onClick={() => setErrorModal({ show: false, message: "" })}
            >
              OK
            </button>
          </div>
        </div>
      )}

      <div className={styles.formWrapper}>
        <h2 className={styles.pageTitle}>Exam Day Readiness Checklist</h2>

        {/* Project Details */}
        <Section title="Project Details" icon={<FiMapPin />}>
          <div className={styles.grid}>
            <Input
              label="Project"
              icon={<FiHome />}
              value={formData.project}
              readOnly
            />
            <Input
              label="Venue"
              icon={<FiMapPin />}
              value={formData.venue}
              readOnly
            />
            <Input
              label="Created By"
              icon={<FiUser />}
              value={formData.createdBy}
              readOnly
            />
            <Input
              label="Exam Date"
              type="date"
              icon={<FiCalendar />}
              value={formData.examDate}
              onChange={(e) => updateField("examDate", e.target.value)}
            />
          </div>
        </Section>

        {/* Pre-Exam Setup */}
        <ChecklistSection
          title="Pre-Exam Setup"
          items={[
            "Visitor/vendor Register",
            "Outsiders Escorted with badge",
            "Labs & Server Restricted Access",
            "Phones Collected",
            "HHMD Used",
            "Staff Gadget Register",
            "Random Gadget Checks",
            "Briefing Done",
          ]}
          checklist={formData.checklist}
          onToggle={handleCheckbox}
        />

        {/* Facilities Check */}
        <ChecklistSection
          title="Facilities Check"
          items={[
            "Power Supply OK",
            "CCTV Monitored Checked",
            "Live lab Monitoring Done",
            "System & Network Checked",
            "Diesel Available",
          ]}
          checklist={formData.checklist}
          onToggle={handleCheckbox}
        />

        {/* Staff Counts */}
        <Section title="Staff Counts" icon={<FiUser />}>
          <div className={styles.grid}>
            {Object.keys(formData.staffCounts).map((key) => (
              <Input
                key={key}
                label={key.replace(/([A-Z])/g, " $1")}
                value={formData.staffCounts[key]}
                onChange={(e) => handleStaffChange(key, e.target.value)}
                inputMode="numeric"
                pattern="[0-9]*"
              />
            ))}
          </div>
        </Section>

        <Section title="Other" icon={<FiSettings />}>
          <div className={styles.otherSection}>
            <label className={styles.checkboxItem}>
              <input
                type="checkbox"
                checked={formData.other.staffVendorVerified}
                onChange={() => handleOtherCheckbox("staffVendorVerified")}
              />
              Staff & Vendor Verified
            </label>

            <Input
              label="Lab Seal Opening Time"
              type="datetime-local"
              value={formData.other.labSealTime}
              onChange={(e) =>
                handleOtherFieldChange("labSealTime", e.target.value)
              }
            />
          </div>
        </Section>

        <Section title="Extra Information" icon={<FiInfo />}>
          <div className={styles.grid}>
            <Input
              label="Reporting Status"
              value={formData.report_status}
              onChange={(e) => updateField("report_status", e.target.value)}
            />
            <Input
              label="RDM Required Count"
              value={formData.rdm_required_count}
              onChange={(e) =>
                updateField("rdm_required_count", e.target.value)
              }
            />
            <Input
              label="Reported Count"
              value={formData.reported_count}
              onChange={(e) => updateField("reported_count", e.target.value)}
            />
            <Input
              label="Suchita Verified Count"
              value={formData.suchita_verified_count}
              onChange={(e) =>
                updateField("suchita_verified_count", e.target.value)
              }
            />
            <Input
              label="Hr Portal Verfied Count"
              value={formData.hr_portal_verified_count}
              onChange={(e) =>
                updateField("hr_portal_verified_count", e.target.value)
              }
            />
          </div>
        </Section>

        {/* Photos */}
        <Section title="Photos" icon={<FiImage />}>
          <div className={styles.photoActions}>
            <button
              type="button"
              className={styles.photoButton}
              onClick={handleAddPhoto}
            >
              <FiUploadCloud /> Upload Photo
            </button>
            <button
              type="button"
              className={styles.photoButton}
              onClick={handleTakePhoto}
            >
              <FiCamera /> Take Photo
            </button>
          </div>

          {formData.image_base64.length > 0 && (
            <div className={styles.photoGrid}>
              {formData.image_base64.map((b64, idx) => (
                <div key={idx} className={styles.photoItem}>
                  <img
                    src={`data:image/jpeg;base64,${b64}`}
                    alt={`Preview ${idx}`}
                  />
                  <button
                    type="button"
                    className={styles.removePhoto}
                    onClick={() => removePhoto(idx)}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* Remarks */}
        <Section title="Remarks" icon={<FiCheckSquare />}>
          <textarea
            className={styles.textArea}
            placeholder="Enter remarks..."
            value={formData.remarks}
            onChange={(e) => updateField("remarks", e.target.value)}
          />
        </Section>

        {/* Submit */}
        <button className={styles.submitButton} onClick={handleSubmitForm}>
          Create Checklist
        </button>
        <button className={styles.submitButton} onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </>
  );
};

/* --- Reusable Components --- */
const Input = ({ label, icon, ...props }) => (
  <div className={styles.inputGroup}>
    <label>
      {icon && <span className={styles.icon}>{icon}</span>} {label}
    </label>
    <input {...props} />
  </div>
);

const Section = ({ title, icon, children }) => (
  <div className={styles.section}>
    <h3 className={styles.subTitle}>
      {icon} {title}
    </h3>
    {children}
  </div>
);

const ChecklistSection = ({ title, items, checklist, onToggle }) => (
  <Section title={title} icon={<FiCheckSquare />}>
    <div className={styles.checklistGrid}>
      {items.map((item, idx) => (
        <label key={idx} className={styles.checkboxItem}>
          <input
            type="checkbox"
            checked={checklist[item] || false}
            onChange={() => onToggle(item)}
          />
          {item}
        </label>
      ))}
    </div>
  </Section>
);

export default ChecklistForm;
