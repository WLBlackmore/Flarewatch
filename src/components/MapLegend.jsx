import React from "react";
import styles from "./MapLegend.module.css";
import FprLegend from "./legends/FprLegend";
import ConfidenceLegend from "./legends/ConfidenceLegend";
import BrightnessLegend from "./legends/BrightnessLegend";
import UserReportedFireLegend from "./legends/UserReportedFireLegend";

const MapLegend = ({showFRP, showBrightness, showConfidence, showActiveReportedFires}) => {
  return (
    <div className={styles.legend}>
      {showFRP && <FprLegend />}
      {showBrightness && <BrightnessLegend />}
      {showConfidence && <ConfidenceLegend />}
      {showActiveReportedFires && <UserReportedFireLegend />}
    </div>
  );
};

export default MapLegend;
