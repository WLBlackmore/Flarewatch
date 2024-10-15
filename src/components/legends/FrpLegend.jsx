import React from "react";
import styles from "./FrpLegend.module.css";

const FrpLegend = () => {
  return (
    <div className={styles.container}>
      <div className={styles.high} />
      <div className={styles.medium} />
      <div className={styles.low} />
    </div>
  );
};

export default FrpLegend;
