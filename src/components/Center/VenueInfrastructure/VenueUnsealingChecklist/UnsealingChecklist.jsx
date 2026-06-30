import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./UnsealingChecklist.module.css";
import ChecklistForm from "./components/ChecklistForm";
import { getUnsealingChecklist } from "./api/getUnsealingChecklist";
const LOCAL_KEY = "UnsealingChecklistData";
const UnsealingChecklist = () => {
  const [examData, setExamData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [showFetchBtn, setShowFetchBtn] = useState(true);

  const userLoginData = JSON.parse(localStorage.getItem("loginData"));

  // ✅ On mount, check localStorage first
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
    if (storedData.length > 0) {
      setExamData(storedData);
      setShowFetchBtn(false); // ✅ hide fetch button if data exists
    } else {
      setShowFetchBtn(true);
    }
  }, []);

  // ✅ Fetch from API only when no local data
  const fetchChecklists = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getUnsealingChecklist(userLoginData);
      if (response?.Status) {
        const records = response.data.records || [];

        const mappedData = records.map((item, idx) => ({
          id: item.id || idx + 1,
          project: item.project_id?.[1] || "N/A",
          venue: item.venue_id?.[1] || "N/A",
          state: item.state_id?.[1] || "N/A",
          city: item.city_id?.[1] || "N/A",
          date: item.exam_date || "",
        }));

        setExamData(mappedData);
        localStorage.setItem(LOCAL_KEY, JSON.stringify(mappedData)); // ✅ save to localStorage
        setShowFetchBtn(false); // ✅ hide Fetch after success
      } else {
        setError(response?.Message || "Failed to fetch checklists.");
      }
    } catch (err) {
      console.error("Error fetching checklists:", err);
      setError("Unexpected error while fetching checklists.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle New click
  const handleNewClick = () => {
    const today = new Date().toISOString().split("T")[0];
    const existsToday = examData.some((exam) => exam.date === today);

    if (existsToday) {
      setShowPopup(true);
    } else {
      setShowForm(true);
    }
  };

  // ✅ After creating a new checklist
  const handleChecklistCreated = (newChecklist) => {
    const formatted = {
      id: newChecklist.id || examData.length + 1,
      project: newChecklist.project_id?.[1] || "N/A",
      venue: newChecklist.venue_id?.[1] || "N/A",
      state: newChecklist.state_id?.[1] || "N/A",
      city: newChecklist.city_id?.[1] || "N/A",
      date: newChecklist.exam_date || "",
    };

    const updatedData = [...examData, formatted];
    setExamData(updatedData);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(updatedData)); // ✅ update storage
    setShowForm(false);
  };

  return (
    <div className={styles.wrapper}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Unsealing Checklist</h1>
        {!showFetchBtn && (
          <button className={styles.newBtn} onClick={handleNewClick}>
            + New
          </button>
        )}
      </div>

      {/* Fetch Button (only when local data missing) */}
      {showFetchBtn && (
        <div className={styles.fetchWrapper}>
          <button
            onClick={fetchChecklists}
            className={styles.fetchBtn}
            disabled={loading}
          >
            {loading ? "Fetching..." : "Fetch Checklists"}
          </button>
        </div>
      )}

      {/* Table or Info */}
      <div className={styles.tableContainer}>
        {loading ? (
          <p className={styles.infoText}>⏳ Fetching checklists...</p>
        ) : error ? (
          <p className={styles.errorText}>❌ {error}</p>
        ) : examData.length === 0 ? (
          <p className={styles.infoText}>No checklist data available.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Project</th>
                <th>Venue</th>
                <th>State</th>
                <th>City</th>
                <th>Exam Date</th>
              </tr>
            </thead>
            <tbody>
              {examData.map((exam, index) => (
                <tr key={exam.id}>
                  <td>{index + 1}</td>
                  <td>{exam.project}</td>
                  <td>{exam.venue}</td>
                  <td>{exam.state}</td>
                  <td>{exam.city}</td>
                  <td>{exam.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Popup */}
      {showPopup && (
        <div className={styles.overlay}>
          <div className={styles.popup}>
            <h2>Checklist Already Exists</h2>
            <p>
              A checklist has already been created for{" "}
              <strong>today's date</strong>. You cannot create another one for
              today.
            </p>
            <button onClick={() => setShowPopup(false)}>Okay</button>
          </div>
        </div>
      )}

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            style={{ width: "100%", maxWidth: "900px" }}
          >
            <ChecklistForm
              handleCancel={() => setShowForm(false)}
              onChecklistCreated={handleChecklistCreated}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UnsealingChecklist;
