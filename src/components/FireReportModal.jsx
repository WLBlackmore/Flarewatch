import React, { useState } from "react";
import ReactDOM from "react-dom";
import styles from "./FireReportModal.module.css";

const FireReportModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    xCoord: "",
    yCoord: "",
    severity: "Low",
    description: "",
    phone: "",
  });

  const toggleModal = () => {
    if (!showModal) {
      // Calculate the scrollbar width
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth + 1;

      // Disable scrolling and adjust for scrollbar width
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      // Enable scrolling and reset padding
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
    }
    setShowModal(!showModal);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form data
    if (!formData.xCoord || !formData.yCoord || !formData.description) {
      alert("Please fill in all required fields");
      return;
    }
    
    console.log(formData);
    toggleModal();
  }





  // Modal content using React Portal
  const modalContent = (
    <div className={styles.modal}>
      <div className={styles.overlay} onClick={toggleModal}>
        <div
          className={styles.modalContent}
          onClick={(e) => e.stopPropagation()}
        >
          <h2>Report Fire</h2>
          <form className={styles.form}  onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label>X Coordinate *</label>
              <input
                type="text"
                name="xCoord"
                value={formData.xCoord}
                onChange={handleChange}
                placeholder="Enter X Coordinate"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Y Coordinate *</label>
              <input
                type="text"
                name="yCoord"
                value={formData.yCoord}
                onChange={handleChange}
                placeholder="Enter Y Coordinate"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Severity</label>
              <select
                name="severity"
                value={formData.severity}
                onChange={handleChange}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter Description"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter Phone Number"
              />
            </div>
            <button type="submit" className={styles.submitBtn}>Submit Report</button>
          </form>

          <button className={styles.closeModal} onClick={toggleModal}>
            Close
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className={styles.reportBtnContainer}>
        <button className={styles.reportBtn} onClick={toggleModal}>
          Report Fire
        </button>
      </div>
      {showModal && ReactDOM.createPortal(modalContent, document.body)}
    </>
  );
};

export default FireReportModal;
