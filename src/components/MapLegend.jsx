import React from "react";
import styles from "./MapLegend.module.css";
import FprLegend from "./legends/FprLegend";
import ConfidenceLegend from "./legends/ConfidenceLegend";
import BrightnessLegend from "./legends/BrightnessLegend";

const MapLegend = ({showFRP, showBrightness, showConfidence}) => {
  return (
    <div className={styles.legend}>
      {showFRP && <FprLegend />}
      {showBrightness && <BrightnessLegend />}
      {showConfidence && <ConfidenceLegend />}
    </div>
  );
};

export default MapLegend;
