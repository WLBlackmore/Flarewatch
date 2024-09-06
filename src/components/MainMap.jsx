import React, { useState } from "react";
import styles from "./MainMap.module.css";
import ReactMapGL from "react-map-gl";
import 'mapbox-gl/dist/mapbox-gl.css';


const MainMap = () => {
  // Mapbox 
  const mapApiToken = import.meta.env.VITE_MAPBOX_TOKEN;

  const [viewport, setViewport] = useState({
    latitude: 45.5019,
    longitude: -73.5674,
    zoom: 10,
    width: "100%",
    height: "100%",
  });

  return (
    <div className={styles.mapSection}>
      <div className={styles.mapPlaceholder}>
        <ReactMapGL
          {...viewport}
          mapboxAccessToken={mapApiToken}  
          mapStyle="mapbox://styles/mapbox/dark-v10" 
          onMove={(evt) => setViewport(evt.viewState)}  
        />
      </div>
    </div>
  );
};

export default MainMap;
