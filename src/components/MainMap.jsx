import React, { useState, useEffect } from "react";
import styles from "./MainMap.module.css";
import ReactMapGL, { Source, Layer } from "react-map-gl";
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

  // NASA FIRMS GEOJSON DATA
  const [centroidData, setCentroidData] = useState(null);
  const [footprintData, setFootprintData] = useState(null);

   // Load GeoJSON files when component mounts
   useEffect(() => {
    // Load Centroids GeoJSON
    fetch("../data/NASA_GEO/Layer_375m_Fire_Detection_Centroids_Last_0_to_6hrs.geojson")
      .then(response => response.json())
      .then(data => setCentroidData(data));

    // Load Footprints GeoJSON
    fetch("../data/NASA_GEO/Layer_375m_Fire_Detection_Footprints_Last_0_to_6hrs.geojson")
      .then(response => response.json())
      .then(data => setFootprintData(data));
  }, []);

  return (
    <div className={styles.mapSection}>
      <div className={styles.mapPlaceholder}>
        <ReactMapGL
          {...viewport}
          mapboxAccessToken={mapApiToken}
          mapStyle="mapbox://styles/mapbox/dark-v10"
          onMove={(evt) => setViewport(evt.viewState)}
        >
          {/* Add the footprints as a fill layer */}
          {footprintData && (
            <Source id="footprints-source" type="geojson" data={footprintData}>
              <Layer
                id="footprints-layer"
                type="fill"
                paint={{
                  'fill-color': '#FF4500', // Orange color for fire footprints
                  'fill-opacity': 0.5
                }}
              />
            </Source>
          )}

          {/* Add the centroids as a circle layer */}
          {centroidData && (
            <Source id="centroids-source" type="geojson" data={centroidData}>
              <Layer
                id="centroids-layer"
                type="circle"
                paint={{
                  'circle-radius': 6,
                  'circle-color': '#FF0000' // Red color for fire centroids
                }}
              />
            </Source>
          )}
        </ReactMapGL>
      </div>
    </div>
  );
};

export default MainMap;
