import React from "react";
import styles from "./FrpLegend.module.css";

const FrpLegend = () => {
  return (
    <div className={styles.container}>
        <h3>Fire Radiative Power</h3>
      <div className={styles.legendItem}>
        <div className={styles.high} />
        <p>High</p>
      </div>
      <div className={styles.legendItem}>
        <div className={styles.medium} />
        <p>Medium</p>
      </div>
      <div className={styles.legendItem}>
        <div className={styles.low} />
        <p>Low</p>
      </div>
    </div>
  );
};

export default FrpLegend;
