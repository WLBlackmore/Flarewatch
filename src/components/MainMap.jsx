import React, { useState, useEffect } from "react";
import styles from "./MainMap.module.css";
import ReactMapGL, { Source, Layer } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MainMap = ({ showFRP, showBrightness }) => {
  const mapApiToken = import.meta.env.VITE_MAPBOX_TOKEN;

  const [viewport, setViewport] = useState({
    latitude: 45.5019,
    longitude: -73.5674,
    zoom: 10,
    width: "100%",
    height: "100%",
  });

  const [centroidData, setCentroidData] = useState(null);
  const [footprintData, setFootprintData] = useState(null);

  useEffect(() => {
    const fetchGeoJsonData = async (fileNames) => {
      const geoJsonPromises = fileNames.map((fileName) =>
        fetch(`/data/NASA_GEO/${fileName}`).then((response) => response.json())
      );

      const geoJsonDataArray = await Promise.all(geoJsonPromises);

      const combinedFeatures = geoJsonDataArray.reduce(
        (acc, curr) => acc.concat(curr.features),
        []
      );

      return {
        type: "FeatureCollection",
        features: combinedFeatures,
      };
    };

    const centroidFileNames = [
      "375m_Fire_Detection_Centroids_(Last_0_to_6hrs).geojson",
      "375m_Fire_Detection_Centroids_(Last_6_to_12hrs).geojson",
      "375m_Fire_Detection_Centroids_(Last_12_to_24hrs).geojson",
    ];

    const footprintFileNames = [
      "375m_Fire_Detection_Footprints_(Last_0_to_6hrs).geojson",
      "375m_Fire_Detection_Footprints_(Last_6_to_12hrs).geojson",
      "375m_Fire_Detection_Footprints_(Last_12_to_24hrs).geojson",
    ];

    fetchGeoJsonData(centroidFileNames).then(setCentroidData);
    fetchGeoJsonData(footprintFileNames).then(setFootprintData);
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
          {/* Display FRP footprints */}
          {showFRP && footprintData && (
            <Source id="footprints-source" type="geojson" data={footprintData}>
              <Layer
                id="footprints-layer"
                type="fill"
                paint={{
                  "fill-color": [
                    "interpolate",
                    ["linear"],
                    ["to-number", ["slice", ["get", "FRP"], 0, -3]],
                    0,
                    "#FFFF99", // Light Yellow for the lowest FRP
                    1.87,
                    "#FFFF00", // Yellow for FRP between 1.87 - 3.92 MW
                    3.92,
                    "#FFA500", // Orange for FRP between 3.92 - 10.75 MW
                    10.75,
                    "#FF0000", // Red for FRP above 10.75 MW
                  ],
                  "fill-opacity": 0.3,
                }}
              />
            </Source>
          )}

          {/* Display FRP centroids */}
          {showFRP && centroidData && (
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
                    0,
                    "#FFFF99", // Light Yellow for the lowest FRP
                    1.87,
                    "#FFFF00", // Yellow for FRP between 1.87 - 3.92 MW
                    3.92,
                    "#FFA500", // Orange for FRP between 3.92 - 10.75 MW
                    10.75,
                    "#FF0000", // Red for FRP above 10.75 MW
                  ],
                  "circle-opacity": 0.7,
                }}
              />
            </Source>
          )}

          {/* Display Brightness heatmap */}
          {showBrightness && centroidData && (
            <Source
              id="centroids-heatmap-source"
              type="geojson"
              data={centroidData}
            >
              <Layer
                id="centroids-heatmap-layer"
                type="heatmap"
                paint={{
                  "heatmap-weight": [
                    "interpolate",
                    ["linear"],
                    ["to-number", ["slice", ["get", "Brightness"], 0, -2]], // Strip " K"
                    208,
                    0,
                    367,
                    1,
                  ],
                  "heatmap-intensity": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    0,
                    1,
                    10,
                    3,
                  ],
                  "heatmap-color": [
                    "interpolate",
                    ["linear"],
                    ["heatmap-density"],
                    0,
                    "rgba(33,102,172,0)", // Light blue
                    0.2,
                    "rgb(103,169,207)", // Blue
                    0.4,
                    "rgb(253,219,199)", // Yellow to Orange
                    0.6,
                    "rgb(239,138,98)", // Orange to Red
                    1,
                    "rgb(178,24,43)", // Dark Red
                  ],
                  "heatmap-radius": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    0,
                    2,
                    9,
                    20,
                  ],
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
