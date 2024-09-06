import React from "react";
import styles from './MainMap.module.css';  // New CSS module for the Map component

const MainMap = () => {
  return (
    <div className={styles.mapSection}>
      <div className={styles.mapPlaceholder}>
        {/* This is where your actual map (Mapbox or Leaflet) will go */}
        <p>Map will be rendered here</p>
      </div>
    </div>
  );
};

export default MainMap;
