import React from "react";
import styles from "./MainMapSidebar.module.css";
import SatelliteDropdown from "./SatelliteDropdown";

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

      <div className={styles.section}>
        <h3>Satellite Controls</h3>
        <SatelliteDropdown
          selectedSatellite={selectedSatellite}
          setSelectedSatellite={setSelectedSatellite}
        />
      </div>

      <div className={styles.section}>
        <h3>Layer Options</h3>
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
    </div>
  );
};

export default MainMapSidebar;
