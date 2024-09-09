import React, { useState, useEffect } from "react";
import styles from "./MainMap.module.css";
import ReactMapGL, { Source, Layer } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MainMap = () => {
  // Mapbox token
  const mapApiToken = import.meta.env.VITE_MAPBOX_TOKEN;

  const [viewport, setViewport] = useState({
    latitude: 45.5019,
    longitude: -73.5674,
    zoom: 10,
    width: "100%",
    height: "100%",
  });

  // Combined NASA FIRMS GEOJSON data
  const [centroidData, setCentroidData] = useState(null);
  const [footprintData, setFootprintData] = useState(null);

  // Function to fetch and combine GeoJSON files for centroids and footprints
  useEffect(() => {
    const fetchGeoJsonData = async (fileNames) => {
      const geoJsonPromises = fileNames.map((fileName) =>
        fetch(`/data/NASA_GEO/${fileName}`).then((response) => response.json())
      );

      // Wait for all the files to be fetched
      const geoJsonDataArray = await Promise.all(geoJsonPromises);

      // Combine features from all the GeoJSON files
      const combinedFeatures = geoJsonDataArray.reduce((acc, curr) => {
        return acc.concat(curr.features);
      }, []);

      return {
        type: "FeatureCollection",
        features: combinedFeatures,
      };
    };

    // Filenames for centroids and footprints within 24 hours
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

    // Fetch and set combined centroid data
    fetchGeoJsonData(centroidFileNames).then(setCentroidData);

    // Fetch and set combined footprint data
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
                  0, "#FFFF99",  // Light Yellow for the lowest FRP (0 - 1.87 MW, 1st quartile)
                  1.87, "#FFFF00",  // Yellow for FRP between 1.87 - 3.92 MW (2nd quartile)
                  3.92, "#FFA500",  // Orange for FRP between 3.92 - 10.75 MW (3rd quartile)
                  10.75, "#FF0000",  // Red for FRP above 10.75 (4th quartile)
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
                    0, "#FFFF99",  // Light Yellow for the lowest FRP (0 - 1.87 MW, 1st quartile)
                    1.87, "#FFFF00",  // Yellow for FRP between 1.87 - 3.92 MW (2nd quartile)
                    3.92, "#FFA500",  // Orange for FRP between 3.92 - 10.75 MW (3rd quartile)
                    10.75, "#FF0000",  // Red for FRP above 10.75 (4th quartile)
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
