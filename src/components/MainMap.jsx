import React, { useState, useEffect, useRef } from "react";
import styles from "./MainMap.module.css";
import ReactMapGL, { Source, Layer, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import fireStationIcon from "../assets/firestationicon.png";
import FireReportPopup from "./FireReportPopup";
import FireStationPopup from "./FireStationPopup";

const MainMap = ({
  showFRP,
  showBrightness,
  selectedFire,
  setSelectedFire,
  nearestFireStations,
  setNearestFireStations,
  selectedFireStation,
  setSelectedFireStation,
  routeData,
  setRouteData,
  selectedSatellite,
  timeFilter,
  setTimeFilter,
  showConfidence,
  setShowConfidence,
  centroidData,
  footprintData,
  handleFindFireStations,
  handleFindRoute,
  fireStationNotFound,
  setFireStationNotFound,
  showActiveReportedFires,
  activeReportedFires,
}) => {
  // Mapbox Configuration
  const mapApiToken = import.meta.env.VITE_MAPBOX_TOKEN;

  // Viewport state (moved back to MainMap)
  const [viewport, setViewport] = useState({
    latitude: 45.5019,
    longitude: -73.5674,
    zoom: 10,
    width: "100%",
    height: "100%",
  });

  // Reference to the map instance
  const mapRef = useRef(null);

  // Current time in Unix Epoch Format
  const [currentEpochTime, setCurrentEpochTime] = useState(
    Math.floor(Date.now() / 1000)
  );

  // Time Slider filter
  const mapTimeFilter = [
    "all",
    [">=", ["get", "Detection Time"], currentEpochTime - timeFilter[1] * 3600],
    ["<=", ["get", "Detection Time"], currentEpochTime - timeFilter[0] * 3600],
  ];

  // Handle map click events
  const handleMapClick = (evt) => {
    if (evt.features && evt.features.length > 0) {
      const [feature] = evt.features;
      if (feature) {
        // Check the layer of the clicked feature
        if (
          feature.layer.id === "centroids-layer" ||
          feature.layer.id === "footprints-layer" ||
          feature.layer.id === "centroids-heatmap-layer" ||
          feature.layer.id === "detection-time-layer" ||
          feature.layer.id === "confidence-centroid-layer"
        ) {
          setSelectedFire(feature.properties);
          setFireStationNotFound("");
          console.log("Selected fire:", feature.properties);
        } else if (feature.layer.id === "nearest-fire-stations-layer") {
          setSelectedFireStation(feature.properties);
          console.log("Selected fire station:", feature.properties);
        } else if (feature.layer.id === "user-reported-layer") {
          console.log("Selected user reported fire:", feature); }
      }
    } else {
      console.log("No features found at clicked location");
    }
  };

  // Handle map load event
  const handleMapLoad = (event) => {
    const map = event.target;

    // Store the map instance
    mapRef.current = map;

    // Add the firetruck icon to the map
    if (!map.hasImage("firetruck-icon")) {
      map.loadImage(fireStationIcon, (error, image) => {
        if (error) {
          console.error("Error loading firetruck icon:", error);
          return;
        }
        map.addImage("firetruck-icon", image);
      });
    }
  };

  return (
    <div className={styles.mapSection}>
      <div className={styles.mapPlaceholder}>
        <ReactMapGL
          {...viewport}
          mapboxAccessToken={mapApiToken}
          mapStyle="mapbox://styles/mapbox/dark-v10"
          onMove={(evt) => setViewport(evt.viewState)}
          projection="globe"
          onClick={handleMapClick}
          onLoad={handleMapLoad}
          interactiveLayerIds={[
            "centroids-layer",
            "footprints-layer",
            "centroids-heatmap-layer",
            "nearest-fire-stations-layer",
            "confidence-centroid-layer",
            "user-reported-layer",
          ]}
        >
          {/* Display FRP footprints */}
          {footprintData && (
            <Source id="footprints-source" type="geojson" data={footprintData}>
              <Layer
                id="footprints-layer"
                type="fill"
                filter={mapTimeFilter}
                layout={{ visibility: showFRP ? "visible" : "none" }}
                paint={{
                  "fill-color": [
                    "interpolate",
                    ["linear"],
                    ["to-number", ["slice", ["get", "FRP"], 0, -3]],
                    0,
                    "#FFFF99",
                    1.87,
                    "#FFFF00",
                    3.92,
                    "#FFA500",
                    10.75,
                    "#FF0000",
                  ],
                  "fill-opacity": 0.3,
                }}
              />
            </Source>
          )}

          {/* Display FRP centroids */}
          {centroidData && (
            <Source id="centroids-source" type="geojson" data={centroidData}>
              <Layer
                id="centroids-layer"
                type="circle"
                filter={mapTimeFilter}
                layout={{ visibility: showFRP ? "visible" : "none" }}
                paint={{
                  "circle-radius": 6,
                  "circle-stroke-width": 4,
                  "circle-stroke-color": "#000000",
                  "circle-stroke-opacity": 0,
                  "circle-color": [
                    "interpolate",
                    ["linear"],
                    ["to-number", ["slice", ["get", "FRP"], 0, -3]],
                    0,
                    "#FFFF99",
                    2,
                    "#FFFF00",
                    4,
                    "#FFA500",
                    10,
                    "#FF0000",
                  ],
                  "circle-opacity": 0.7,
                }}
              />
            </Source>
          )}

          {/* Display Brightness heatmap */}
          {centroidData && (
            <Source
              id="centroids-heatmap-source"
              type="geojson"
              data={centroidData}
            >
              <Layer
                id="centroids-heatmap-layer"
                type="heatmap"
                filter={mapTimeFilter}
                layout={{ visibility: showBrightness ? "visible" : "none" }}
                paint={{
                  "heatmap-weight": [
                    "interpolate",
                    ["linear"],
                    ["to-number", ["slice", ["get", "Brightness"], 0, -2]],
                    208,
                    0.2,
                    367,
                    0.8,
                  ],
                  "heatmap-intensity": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    0,
                    0.8,
                    10,
                    2,
                  ],
                  "heatmap-color": [
                    "interpolate",
                    ["linear"],
                    ["heatmap-density"],
                    0,
                    "rgba(33,102,172,0)",
                    0.2,
                    "rgb(103,169,207)",
                    0.4,
                    "rgb(253,219,199)",
                    0.6,
                    "rgb(239,138,98)",
                    1,
                    "rgb(178,24,43)",
                  ],
                  "heatmap-radius": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    0,
                    3,
                    9,
                    18,
                  ],
                }}
              />
            </Source>
          )}

          {/* Display confidence layer */}
          {centroidData && (
            <Source
              id="confidence-centroid-source"
              type="geojson"
              data={centroidData}
              filter={mapTimeFilter}
            >
              <Layer
                id="confidence-centroid-layer"
                type="circle"
                layout={{ visibility: showConfidence ? "visible" : "none" }}
                paint={{
                  "circle-radius": 6,
                  "circle-stroke-width": 4,
                  "circle-stroke-color": "#000000",
                  "circle-stroke-opacity": 0,
                  "circle-color": [
                    "match",
                    ["get", "Confidence"],
                    "Low",
                    "#FFE066",
                    "Nominal",
                    "#9ACD32",
                    "High",
                    "#006400",
                    "#FFD700",
                  ],
                  "circle-opacity": 1,
                }}
              />
            </Source>
          )}

          {/* Display user reported fires layer */}
          {activeReportedFires && (
            <Source id="user-reported-source" type="geojson" data={activeReportedFires}>
              <Layer
                id="user-reported-layer"
                type="circle"
                layout={{ visibility: showActiveReportedFires ? "visible" : "none" }}
                paint={{
                  "circle-radius": 6,
                  "circle-stroke-width": 4,
                  "circle-stroke-color": "#000000",
                  "circle-stroke-opacity": 0,
                  "circle-color": "#0000FF",
                  "circle-opacity": 0.7,
                }}
              />
            </Source>
          )}

          {/* Display nearest fire stations */}
          {nearestFireStations && (
            <Source
              id="nearest-fire-stations-source"
              type="geojson"
              data={nearestFireStations}
            >
              <Layer
                id="nearest-fire-stations-layer"
                type="symbol"
                layout={{
                  "icon-image": "firetruck-icon",
                  "icon-size": 0.05,
                  "icon-allow-overlap": true,
                }}
              />
            </Source>
          )}

          {/* Fire popup logic */}
          {selectedFire && (
            <Popup
              latitude={selectedFire.Latitude}
              longitude={selectedFire.Longitude}
              onClose={() => setSelectedFire(null)}
              closeOnClick={false}
            >
              <FireReportPopup
                fire={selectedFire}
                handleFindFireStations={handleFindFireStations}
                fireStationNotFound={fireStationNotFound}
              />
            </Popup>
          )}

          {/* Fire station popup logic */}
          {selectedFireStation && (
            <Popup
              latitude={selectedFireStation.latitude}
              longitude={selectedFireStation.longitude}
              onClose={() => setSelectedFireStation(null)}
              closeOnClick={false}
            >
              <FireStationPopup
                fireStation={selectedFireStation}
                handleFindRoute={handleFindRoute}
              />
            </Popup>
          )}

          {/* Display the route from fire station to fire */}
          {routeData && (
            <Source id="route-source" type="geojson" data={routeData}>
              <Layer
                id="route-layer"
                type="line"
                paint={{
                  "line-color": "#FF0000",
                  "line-width": 4,
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
