import React, { useState } from "react";
import styles from './MainMap.module.css';
import ReactMapGL from 'react-map-gl';

const MainMap = () => {
  const [viewport, setViewport] = useState({
    latitude: 45.5019,
    longitude: 73.5674,
    zoom: 10,
    width: '100%',
    height: '100%'
  })

  return (
    <div className={styles.mapSection}>
      <div className={styles.mapPlaceholder}>
        {/* This is where your actual map will go */}
        <ReactMapGL {...viewport}>

        </ReactMapGL>
      </div>
    </div>
  );
};

export default MainMap;
