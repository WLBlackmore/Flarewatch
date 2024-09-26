import React, { useState, useEffect, useRef } from "react";
import styles from "./MainMap.module.css";
import ReactMapGL, { Source, Layer, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import axios from "axios";
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
}) => {
  // Mapbox Configuration
  const mapApiToken = import.meta.env.VITE_MAPBOX_TOKEN;

  // Viewport state
  const [viewport, setViewport] = useState({
    latitude: 45.5019,
    longitude: -73.5674,
    zoom: 10,
    width: "100%",
    height: "100%",
  });

  // NASA Fire Data
  const [allSatelliteData, setAllSatelliteData] = useState(null);
  const [centroidData, setCentroidData] = useState(null);
  const [footprintData, setFootprintData] = useState(null);

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

  // Reference to the map instance
  const mapRef = useRef(null);

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
          console.log("Selected fire:", feature.properties);
        } else if (feature.layer.id === "nearest-fire-stations-layer") {
          setSelectedFireStation(feature.properties);
          console.log("Selected fire station:", feature.properties);
        }
      }
    } else {
      console.log("No features found at clicked location");
    }
  };

  // Find nearest fire stations
  const handleFindFireStations = async () => {
    console.log("Finding nearest 5 fire stations");
    console.log(selectedFire);

    // Clear existing route data
    setRouteData(null);

    try {
      const response = await axios
        .post("http://localhost:5000/find-fire-stations", {
          latitude: selectedFire.Latitude,
          longitude: selectedFire.Longitude,
        })
        .then((response) => response.data);

      // Add fire coordinates to the nearest fire stations data
      const fireCoordinates = {
        latitude: selectedFire.Latitude,
        longitude: selectedFire.Longitude,
      };

      setNearestFireStations({ ...response, fireCoordinates });
      console.log("Nearest fire stations:", nearestFireStations);
    } catch (error) {
      console.error("Error finding fire stations:", error);
    }
  };

  // Find route from fire station to fire
  const handleFindRoute = async () => {
    if (!selectedFireStation) {
      console.log("No fire station selected");
      return;
    }

    const stationCoordinates = {
      latitude: selectedFireStation.latitude,
      longitude: selectedFireStation.longitude,
    };

    const fireCoordinates = nearestFireStations.fireCoordinates;

    console.log(
      "Finding route from fire station at coordinates:",
      stationCoordinates,
      "to fire at coordinates:",
      fireCoordinates
    );

    try {
      const response = await axios.post("http://localhost:5000/find-route", {
        stationCoordinates,
        fireCoordinates,
      });

      // Set the route data
      const routeGeometry = response.data.routes[0].geometry;
      const routeFeature = {
        type: "Feature",
        geometry: routeGeometry,
      };
      console.log("Route data:", routeFeature);
      setRouteData(routeFeature);
    } catch (error) {
      console.error("Error finding route:", error);
    }
  };

  // Fetch NASA fire data on component mount
  useEffect(() => {
    axios.get("http://localhost:5000/get-nasa-fire-data").then((response) => {
      const data = response.data;

      // Set the centroid and footprint data
      setAllSatelliteData(data);
      setCentroidData(data[selectedSatellite].centroids);
      setFootprintData(data[selectedSatellite].polygons);
    });
  }, []);

  // Update centroid and footprint data when selected satellite changes
  useEffect(() => {
    if (allSatelliteData) {
      setCentroidData(allSatelliteData[selectedSatellite].centroids);
      setFootprintData(allSatelliteData[selectedSatellite].polygons);
    }
  }, [selectedSatellite, allSatelliteData]);

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
            "confidence-centroid-layer"
          ]}
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
          {showFRP && centroidData && (
            <Source id="centroids-source" type="geojson" data={centroidData}>
              <Layer
                id="centroids-layer"
                type="circle"
                filter={mapTimeFilter}
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
                    1.87,
                    "#FFFF00",
                    3.92,
                    "#FFA500",
                    10.75,
                    "#FF0000",
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
                filter={mapTimeFilter}
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
          {showConfidence && centroidData && (
            <Source
              id="confidence-centroid-source"
              type="geojson"
              data={centroidData}
            >
              <Layer
                id="confidence-centroid-layer"
                type="circle"
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
