import React from "react";
import styles from "./MapLegend.module.css";
import FprLegend from "./legends/FprLegend";
import ConfidenceLegend from "./legends/ConfidenceLegend";

const MapLegend = ({showFRP, showBrightness, showConfidence}) => {
  return (
    <div className={styles.legend}>
      {showFRP && <FprLegend />}
      {showBrightness && <FprLegend />}
      {showConfidence && <ConfidenceLegend />}
    </div>
  );
};

export default MapLegend;
