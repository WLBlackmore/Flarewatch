import React, { useState, useEffect } from "react";
import styles from "./Mapviewer.module.css";
import MainMap from "../components/MainMap";
import MainMapSidebar from "../components/MainMapSidebar";

const Mapviewer = () => {
  // Filter State
  const [showFRP, setShowFRP] = useState(true);
  const [showBrightness, setShowBrightness] = useState(false);
  const [showConfidence, setShowConfidence] = useState(false)
  const [selectedSatellite, setSelectedSatellite] =
    useState("suomi-npp-viirs-c2");
  const [timeFilter, setTimeFilter] = useState([0, 24]);

  // Layer State
  const [selectedFire, setSelectedFire] = useState(null);
  const [nearestFireStations, setNearestFireStations] = useState(null);
  const [selectedFireStation, setSelectedFireStation] = useState(null);
  const [routeData, setRouteData] = useState(null);

  return (
    <div className={styles.mapviewerContainer}>
      <MainMap
        showFRP={showFRP}
        showBrightness={showBrightness}
        selectedFire={selectedFire}
        setSelectedFire={setSelectedFire}
        nearestFireStations={nearestFireStations}
        setNearestFireStations={setNearestFireStations}
        selectedFireStation={selectedFireStation}
        setSelectedFireStation={setSelectedFireStation}
        routeData={routeData}
        setRouteData={setRouteData}
        selectedSatellite={selectedSatellite}
        timeFilter={timeFilter}
        setTimeFilter={setTimeFilter}
        showConfidence={showConfidence}
        setShowConfidence={setShowConfidence}
      />

      <MainMapSidebar
        showFRP={showFRP}
        setShowFRP={setShowFRP}
        showBrightness={showBrightness}
        setShowBrightness={setShowBrightness}
        selectedFire={selectedFire}
        nearestFireStations={nearestFireStations}
        selectedFireStation={selectedFireStation}
        routeData={routeData}
        selectedSatellite={selectedSatellite}
        setSelectedSatellite={setSelectedSatellite}
        timeFilter={timeFilter}
        setTimeFilter={setTimeFilter}
        showConfidence={showConfidence}
        setShowConfidence={setShowConfidence}
      />
    </div>
  );
};

export default Mapviewer;
