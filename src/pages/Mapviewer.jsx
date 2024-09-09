import React, { useState } from "react";
import styles from "./Mapviewer.module.css";
import MainMap from "../components/MainMap";
import MainMapSidebar from "../components/MainMapSidebar"; // Import the sidebar

const Mapviewer = () => {
  // Layer State
  const [showFRP, setShowFRP] = useState(true);
  const [showBrightness, setShowBrightness] = useState(false);

  return (
    <div className={styles.mapviewerContainer}>
      {/* Map section */}
      <MainMap showFRP={showFRP} showBrightness={showBrightness} />

      {/* Sidebar for filters or additional content */}
      <MainMapSidebar
        showFRP={showFRP}
        setShowFRP={setShowFRP}
        showBrightness={showBrightness}
        setShowBrightness={setShowBrightness}
      />
    </div>
  );
};

export default Mapviewer;
