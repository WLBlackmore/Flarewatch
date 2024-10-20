import React, { useState } from "react";
import ReactDOM from "react-dom";
import styles from "./FireReportModal.module.css";

const FireReportModal = () => {
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    if (!showModal) {
      // Calculate the scrollbar width
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth + 1;
  
      // Disable scrolling and adjust for scrollbar width
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      // Enable scrolling and reset padding
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
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
