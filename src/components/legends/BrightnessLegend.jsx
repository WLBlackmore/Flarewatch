import React from "react";
import styles from "./BrightnessLegend.module.css";

const BrightnessLegend = () => {
  return (
    <div>
      <h3>Brightness Heatmap</h3>
      <div className={styles.gradientContainer}>
        <div className={styles.gradient}></div>
      </div>
      <div className={styles.labels}>
        <p>Cold & Sparse</p>
        <p>Hot & Dense</p>
      </div>
    </div>
  );
};

export default BrightnessLegend;
