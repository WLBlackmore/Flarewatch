import React from "react";
import styles from "./MapLegend.module.css";
import FprLegend from "./legends/FprLegend";

const MapLegend = ({showFRP, showBrightness, showConfidence}) => {
  return (
    <div className={styles.legend}>
     <FprLegend></FprLegend>
    </div>
  );
};

export default MapLegend;
