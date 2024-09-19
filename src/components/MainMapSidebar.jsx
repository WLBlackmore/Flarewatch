import React from "react";
import styles from "./MainMapSidebar.module.css";
import SatelliteDropdown from "./SatelliteDropdown";
import satelliteIcon from "../assets/satelliteIcon.png";
import layerIcon from "../assets/layerIcon.png";
import TimeSlider from "./TimeSlider";

const MainMapSidebar = ({
  showFRP,
  setShowFRP,
  showBrightness,
  setShowBrightness,
  selectedSatellite,
  setSelectedSatellite,
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
        <label className={styles.toggle}>
          <input
            type="checkbox"
            checked={showFRP}
            onChange={() => setShowFRP(!showFRP)}
          />
          <span className={styles.slider}></span>
          Show FRP Markers
        </label>

        <label className={styles.toggle}>
          <input
            type="checkbox"
            checked={showBrightness}
            onChange={() => setShowBrightness(!showBrightness)}
          />
          <span className={styles.slider}></span>
          Show Brightness Heatmap
        </label>
      </div>

      {/* Time Filtering Section */}
      <div className={`${styles.section} ${styles.time}`}>
        <div className={styles.satelliteHeader}>
          <h3>Time Filtering</h3>
        </div>
        <TimeSlider />
      </div>
    </div>
  );
};

export default MainMapSidebar;
