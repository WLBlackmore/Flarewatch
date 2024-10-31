import React from "react";
import styles from "./MainMapSidebar.module.css";
import SatelliteDropdown from "./SatelliteDropdown";
import satelliteIcon from "../assets/satelliteIcon.png";
import layerIcon from "../assets/layerIcon.png";
import TimeSlider from "./TimeSlider";
import FireReportModal from "./FireReportModal";

const MainMapSidebar = ({
  showFRP,
  setShowFRP,
  showBrightness,
  setShowBrightness,
  selectedSatellite,
  setSelectedSatellite,
  timeFilter,
  setTimeFilter,
  showConfidence,
  setShowConfidence,
  showActiveReportedFires,
  setShowActiveReportedFires
}) => { 
  return (
    <div className={styles.sidebar}>
      <h2>Wildfire Map Controls</h2>

      {/* Satellite Controls Section */}
      <div className={`${styles.section} ${styles.satellite}`}>
        <div className={styles.satelliteHeader}>
          <h3>Satellite Controls</h3>
          <img src={satelliteIcon} alt="satellite icon" />
        </div>
        <SatelliteDropdown
          selectedSatellite={selectedSatellite}
          setSelectedSatellite={setSelectedSatellite}
        />
      </div>

      {/* Layer Options Section */}
      <div className={`${styles.section} ${styles.layers}`}>
        <div className={styles.satelliteHeader}>
          <h3>Layer Options</h3>
          <img src={layerIcon} alt="layer icon" className={styles.layerIcon} />
        </div>
        {/* FRP toggle */}
        <label className={styles.toggle}>
          <input
            type="checkbox"
            checked={showFRP}
            onChange={() => {
              setShowFRP(!showFRP);
              showBrightness && setShowBrightness(false);
              showConfidence && setShowConfidence(false);
            }}
          />
          <span className={styles.slider}></span>
          Show FRP Markers
        </label>
        {/* Heatmap toggle */}
        <label className={styles.toggle}>
          <input
            type="checkbox"
            checked={showBrightness}
            onChange={() => {
              setShowBrightness(!showBrightness);
              showFRP && setShowFRP(false);
              showConfidence && setShowConfidence(false);
            }}
          />
          <span className={styles.slider}></span>
          Show Brightness Heatmap
        </label>

        {/* Confidence toggle */}
        <label className={styles.toggle}>
          <input
            type="checkbox"
            checked={showConfidence}
            onChange={() => {
              setShowConfidence(!showConfidence);
              showFRP && setShowFRP(false);
              showBrightness && setShowBrightness(false);
            }}
          />
          <span className={styles.slider}></span>
          Show Sensor Confidence
        </label>

        {/* Fire reports toggle */}
        <label className={styles.toggle}>
          <input
            type="checkbox"
            checked={showActiveReportedFires}
            onChange={() => {
              setShowActiveReportedFires(!showActiveReportedFires);
            }}
          />
          <span className={styles.slider}></span>
          Show User Reported Fires
        </label>
      </div>

      {/* Time Filtering Section */}
      <div className={`${styles.section} ${styles.time}`}>
        <div className={styles.satelliteHeader}>
          <h3>Detection Time</h3>
        </div>
        <TimeSlider timeFilter={timeFilter} setTimeFilter={setTimeFilter} />
      </div>
      <div className={`${styles.section} ${styles.report}`}>
        <FireReportModal />
      </div>
    </div>
  );
};

export default MainMapSidebar;
