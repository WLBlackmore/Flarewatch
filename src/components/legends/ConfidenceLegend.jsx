import React from "react";
import styles from "./ConfidenceLegend.module.css";

const ConfidenceLegend = () => {
  return (
    <div className={styles.container}>
        <h3>Scan Confidence</h3>
      <div className={styles.legendItem}>
        <div className={styles.high} />
        <p>High {"(> 70 %)"}</p>
      </div>
      <div className={styles.legendItem}>
        <div className={styles.medium} />
        <p>Nominal {"(30-70 %)"}</p>
      </div>
      <div className={styles.legendItem}>
        <div className={styles.low} />
        <p>Low {"(< 30 %)"}</p>
      </div>
    </div>
  );
};

export default ConfidenceLegend;
