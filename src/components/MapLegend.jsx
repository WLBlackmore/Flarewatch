import React from "react";
import styles from "./MapLegend.module.css";
import FrpLegend from "./legends/FrpLegend";

const MapLegend = () => {
  return (
    <div className={styles.legend}>
      <FrpLegend />
    </div>
  );
};

export default MapLegend;
