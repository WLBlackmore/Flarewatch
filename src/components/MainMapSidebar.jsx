import React from "react";
import styles from "./MainMapSidebar.module.css"; // Sidebar-specific styles
import SatelliteDropdown from "./SatelliteDropdown";

const MainMapSidebar = ({
  showFRP,
  setShowFRP,
  showBrightness,
  setShowBrightness,
  selectedSatellite,
  setSelectedSatellite

}) => {
  return (
    <div className={styles.sidebar}>
      <SatelliteDropdown
        selectedSatellite={selectedSatellite}
        setSelectedSatellite={setSelectedSatellite}
      />
      <h2>Tool Bar</h2>
      <div className={styles.filterSection}>
        <p>Filter Options</p>
        <label>
          <input
            type="checkbox"
            checked={showFRP}
            onChange={() => setShowFRP(!showFRP)}
          />
          Show FRP Markers
        </label>
        <label>
          <input
            type="checkbox"
            checked={showBrightness}
            onChange={() => setShowBrightness(!showBrightness)}
          />
          Show Brightness Heatmap
        </label>
      </div>
    </div>
  );
};

export default MainMapSidebar;
