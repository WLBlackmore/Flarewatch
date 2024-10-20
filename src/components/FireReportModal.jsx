import React, { useState } from "react";
import ReactDOM from "react-dom";
import styles from "./FireReportModal.module.css";

const FireReportModal = () => {
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    if (!showModal) {
      // Disable scrolling
      document.body.style.overflow = 'hidden';
    } else {
      // Enable scrolling
      document.body.style.overflow = 'unset';
    }
    setShowModal(!showModal);
  };

  // Modal content using React Portal
  const modalContent = (
    <div className={styles.modal}>
      <div className={styles.overlay} onClick={toggleModal}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <h2>Report Fire</h2>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis
            exercitationem obcaecati ipsum autem accusamus unde perspiciatis
            nesciunt magnam aspernatur, dolore, repellendus iure ab ad
            consequatur et sed quam provident non maiores eligendi quae
            delectus minus. Dolores animi explicabo praesentium perspiciatis
            ipsum doloribus corporis fugiat non cum esse numquam, laboriosam
            quod veritatis repudiandae, dolor odio cupiditate, iste velit
            consectetur illum vero.
          </p>
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
