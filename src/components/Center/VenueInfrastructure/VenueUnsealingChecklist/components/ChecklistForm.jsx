import { useState } from "react";
import {
  FiCalendar,
  FiUser,
  FiMapPin,
  FiHome,
  FiImage,
  FiTrash2,
  FiUploadCloud,
  FiCamera,
  FiCheckSquare,
} from "react-icons/fi";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";

import { createChecklist } from "../api/createChecklist";
import { uploadImage } from "../api/uploadImage";

import { compressImage } from "../utils/compressImage";
import styles from "./ChecklistForm.module.css";
const ChecklistForm = ({ handleCancel, onChecklistCreated }) => {
  const userLoginData = JSON.parse(localStorage.getItem("loginData") || "{}");
  const [formData, setFormData] = useState({
    project: userLoginData?.employee_assigned_project,
    venue: userLoginData?.employee_assigned_venue,
    createdBy: userLoginData?.name,
    examDate: "",
    remarks: "",
    file_name: [],
    image_base64: [],
    checklist: {
      venueSealBroken: false, // ✅ new checkbox field
    },
  });

  const [errorModal, setErrorModal] = useState({ show: false, message: "" });
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");

  const updateField = (name, value) =>
    setFormData((prev) => ({ ...prev, [name]: value }));

  /** ---------------- Image Handling ---------------- */
  const handleAddPhoto = async () => {
    try {
      const result = await Camera.pickImages({ quality: 90, limit: 5 });
      const newBase64 = [];
      const newFileNames = [];

      for (let i = 0; i < result.photos.length; i++) {
        const photo = result.photos[i];
        if (photo.webPath) {
          const response = await fetch(photo.webPath);
          const blob = await response.blob();
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
        resultType: CameraResultType.Uri,
        quality: 90,
        source: CameraSource.Camera,
      });

      if (photo.webPath) {
        const response = await fetch(photo.webPath);
        const blob = await response.blob();
        const compressedBase64 = await compressImage(blob, 1024, 0.7);

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

  const removePhoto = (i) =>
    setFormData((prev) => ({
      ...prev,
      image_base64: prev.image_base64.filter((_, idx) => idx !== i),
      file_name: prev.file_name.filter((_, idx) => idx !== i),
    }));

  /** ---------------- Submit ---------------- */
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

      // --- Always send default fields ---
      const payloadData = {
        fields: [
          "project_id",
          "venue_id",
          "created_by_id",
          "state_id",
          "city_id",
          "exam_date",
          "remarks",
          "venue_seal_broken",
        ],
        values: {
          project_id: userLoginData?.project_id,
          venue_id: userLoginData?.venue_id,
          state_id: userLoginData?.state_id,
          city_id: userLoginData?.city_id,
          created_by_id: userLoginData?.UserID,
          exam_date: formData.examDate,
          remarks: formData.remarks,
          venue_seal_broken: formData.checklist.venueSealBroken, // ✅ mapped value
        },
      };

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
          localStorage.getItem("UnsealingChecklistData")
        ) || {
          "New resource": [],
        };
        stored["New resource"] = [...stored["New resource"], newChecklist];
        localStorage.setItem("UnsealingChecklistData", JSON.stringify(stored));
      }

      // --- Upload images if exist ---
      if (formData.image_base64.length > 0) {
        setLoadingText("Uploading images...");
        const imagesPayload = {
          fields: ["image_base64"],
          values: formData.image_base64.map((b64) => ({ image_base64: b64 })),
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
        }
        setLoading(false);
        setSuccessMessage(uploadResponse.Message);
        setTimeout(() => {
          setSuccessMessage("");
          if (onChecklistCreated) onChecklistCreated(newChecklist); // 👈 now update parent
          handleCancel(); // 👈 close after upload
        }, 2000);
      }
    } catch {
      setLoading(false);
      setErrorModal({
        show: true,
        message: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <>
      {/* Loading Modal */}
      {loading && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <p className={styles.modalMessage}>{loadingText}</p>
            <div className={styles.spinner}></div>
          </div>
        </div>
      )}

      {/* Success */}
      {successMessage && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <p className={styles.modalMessage}>{successMessage}</p>
          </div>
        </div>
      )}

      {/* Error */}
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

      {/* Page */}

      <div className={styles.formWrapper}>
        <h2 className={styles.pageTitle}>Unsealing Checklist</h2>

        {/* Project Details + checkbox */}
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

          {/* Checkbox below grid */}
          <label className={styles.checkboxItem}>
            <input
              type="checkbox"
              checked={formData.checklist.venueSealBroken}
              onChange={() =>
                setFormData((prev) => ({
                  ...prev,
                  checklist: {
                    ...prev.checklist,
                    venueSealBroken: !prev.checklist.venueSealBroken,
                  },
                }))
              }
            />
            Venue Seal Broken?
          </label>
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
export default ChecklistForm;
