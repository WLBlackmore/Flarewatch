import React from "react";
import styles from './Mapviewer.module.css';  
import MainMap from "../components/MainMap";
import MainMapSidebar from "../components/MainMapSidebar";  // Import the sidebar

const Mapviewer = () => {
  return (
    <div className={styles.mapviewerContainer}>
      {/* Map section */}
      <MainMap />

      {/* Sidebar for filters or additional content */}
      <MainMapSidebar />
    </div>
  );
};

export default Mapviewer;
