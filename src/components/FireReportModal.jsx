import React, { useState } from "react";
import ReactDOM from "react-dom";
import styles from "./FireReportModal.module.css";
import axios from "axios";
import currentlocationiamge from "../assets/currentlocation.png";

const FireReportModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    longitude: "",
    latitude: "",
    severity: "Low",
    description: "",
    phone: "",
  });

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
    } else {
      console.log("Geolocation not supported");
    }
  }

  const geoSuccess = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
    setFormData({ ...formData, latitude, longitude });
  }
  
  const geoError = () => {
    console.log("Unable to retrieve your location");
  }

  const toggleModal = () => {
    if (!showModal) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth + 1;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
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
    if (!formData.longitude || !formData.latitude || !formData.description) {
      alert("Please fill in all required fields");
      return;
    }
    console.log(formData);
    axios.post("http://localhost:5000/firereports", formData).then((res) => {
      console.log(res);
    });
    setFormData({
      longitude: "",
      latitude: "",
      severity: "Low",
      description: "",
      phone: "",
    });
    toggleModal();
  };

  const modalContent = (
    <div className={styles.modal}>
      <div className={styles.overlay} onClick={toggleModal}>
        <div
          className={styles.modalContent}
          onClick={(e) => e.stopPropagation()}
        >
          <h2>Report Fire</h2>
          <form className={styles.form} onSubmit={handleSubmit}>
           
          <div className={styles.formGroup}>
              <label>Latitude *</label>
              <input
                type="text"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                placeholder="Enter Latitude"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Longitude *</label>
              <input
                type="text"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                placeholder="Enter Longitude"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <button className={styles.currentLocationBtn} onClick={handleGetCurrentLocation}>
               <img src={currentlocationiamge} alt="current location" />
               Use Current Location
              </button>
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
            <button type="submit" className={styles.submitBtn}>
              Submit Report
            </button>
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
