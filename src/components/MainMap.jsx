import React, { useState, useEffect } from "react";
import styles from "./MainMap.module.css";
import ReactMapGL, { Source, Layer } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

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
    fetch(
      "/data/NASA_GEO/375m_Fire_Detection_Centroids_(Last_0_to_6hrs).geojson"
    )
      .then((response) => response.json())
      .then((data) => setCentroidData(data));

    // Load Footprints GeoJSON
    fetch(
      "/data/NASA_GEO/375m_Fire_Detection_Footprints_(Last_0_to_6hrs).geojson"
    )
      .then((response) => response.json())
      .then((data) => setFootprintData(data));
  }, []);

  return (
    <div className={styles.mapSection}>
      <div className={styles.mapPlaceholder}>
        <ReactMapGL
          {...viewport}
          mapboxAccessToken={mapApiToken}
          mapStyle="mapbox://styles/mapbox/dark-v10"
          onMove={(evt) => setViewport(evt.viewState)}
          projection="globe"
        >
          {/* Add the footprints as a fill layer */}
          {footprintData && (
            <Source id="footprints-source" type="geojson" data={footprintData}>
              <Layer
                id="footprints-layer"
                type="fill"
                paint={{
                  "fill-color": [
                    "interpolate",
                    ["linear"],
                    ["to-number", ["slice", ["get", "FRP"], 0, -3]],
                    0, "#FFFF99", // Yellow color for low FRP
                    5,"#FFFF00", // Yellow color for low FRP
                    10,"#FFA500", // Orange color for medium FRP
                    30,"#FF0000", // Red color for high FRP
                  ],
                  "fill-opacity": 0.3,
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
                  "circle-radius": 6,
                  "circle-color": [
                    "interpolate",
                    ["linear"],
                    ["to-number", ["slice", ["get", "FRP"], 0, -3]],
                    0, "#FFFF99", // Yellow color for low FRP
                    5,"#FFFF00", // Yellow color for low FRP
                    10,"#FFA500", // Orange color for medium FRP
                    30,"#FF0000", // Red color for high FRP
                  ],
                  "circle-opacity": 0.7,
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
