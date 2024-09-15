import React, { useState, useEffect, useRef } from "react";
import styles from "./MainMap.module.css";
import ReactMapGL, { Source, Layer, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import axios from "axios";
import fireStationIcon from "../assets/firestationicon.png";
import FireReportPopup from "./FireReportPopup";
import FireStationPopup from "./FireStationPopup";

const MainMap = ({ showFRP, showBrightness }) => {
  // Mapbox Configuration
  const mapApiToken = import.meta.env.VITE_MAPBOX_TOKEN;

  const [viewport, setViewport] = useState({
    latitude: 45.5019,
    longitude: -73.5674,
    zoom: 10,
    width: "100%",
    height: "100%",
  });

  // NASA Fire Data
  const [centroidData, setCentroidData] = useState(null);
  const [footprintData, setFootprintData] = useState(null);

  // Popups state for fire reports
  const [selectedFire, setSelectedFire] = useState(null);

  // Nearest fire station state
  const [nearestFireStations, setNearestFireStations] = useState(null);

  // Popups state for selected fire station
  const [selectedFireStation, setSelectedFireStation] = useState(null);

  // Routes state
  const [routeData, setRouteData] = useState(null);

  // Reference to the map instance
  const mapRef = useRef(null);

  const handleMapClick = (evt) => {
    // Ensure that features exist and are iterable
    if (evt.features && evt.features.length > 0) {
      const [feature] = evt.features;
      if (feature) {
        // Check the layer of the clicked feature
        if (
          feature.layer.id === "centroids-layer" ||
          feature.layer.id === "footprints-layer" ||
          feature.layer.id === "centroids-heatmap-layer"
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

  // Fire station
  const handleFindFireStations = async () => {
    console.log("Finding nearest 5 fire stations");
    console.log(selectedFire);
    // Add request to flask

    try {
      const response = await axios
        .post("http://localhost:5000/find-fire-stations", {
          latitude: selectedFire.Latitude,
          longitude: selectedFire.Longitude,
        })
        .then((response) => response.data);

      // Add the corresponding fire coordinates to the nearest fire station state
      const fireCoordinates = {
        latitude: selectedFire.Latitude,
        longitude: selectedFire.Longitude,
      };

      setNearestFireStations({ ...response, fireCoordinates });
      console.log(nearestFireStations);
    } catch (error) {
      console.error(error);
    }
  };

  // Route finding logic
  const handleFindRoute = async () => {
    if (!selectedFireStation) {
      console.log("No fire or fire station selected");
      return;
    }

    const stationCordinates = {
      latitude: selectedFireStation.latitude,
      longitude: selectedFireStation.longitude,
    };

    const fireCoordinates = nearestFireStations.fireCoordinates;

    console.log(
      "Finding route from fire station at coordinates:",
      stationCordinates,
      "to fire at coordinates:",
      fireCoordinates
    );

    // Perform request to backend
    try {
      const response = await axios.post("http://localhost:5000/find-route", {
        stationCordinates,
        fireCoordinates,
      });

      console.log(response);

      // Set the route data
      const routeGeometry = response.data.routes[0].geometry;
      const routeData = {
        type: "Feature",
        geometry: routeGeometry,
      };
      console.log("Route data:", routeData);
      setRouteData(routeData);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch and load the GeoJSON data on component mount
  useEffect(() => {
    const fetchGeoJsonData = async (fileNames) => {
      const geoJsonPromises = fileNames.map((fileName) =>
        axios
          .get(`/data/NASA_GEO/${fileName}`)
          .then((response) => response.data)
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

    // Define the GeoJSON file names to fetch
    const centroidFileNames = [
      "canada_24h_suomi-npp-viirs-c2_data_375m_Fire_Detection_Centroids_(Last_0_to_6hrs).geojson",
      "canada_24h_suomi-npp-viirs-c2_data_375m_Fire_Detection_Centroids_(Last_6_to_12hrs).geojson",
      "canada_24h_suomi-npp-viirs-c2_data_375m_Fire_Detection_Centroids_(Last_12_to_24hrs).geojson",
      "usa_contiguous_and_hawaii_24h_suomi-npp-viirs-c2_data_375m_Fire_Detection_Centroids_(Last_0_to_6hrs).geojson",
      "usa_contiguous_and_hawaii_24h_suomi-npp-viirs-c2_data_375m_Fire_Detection_Centroids_(Last_6_to_12hrs).geojson",
      "usa_contiguous_and_hawaii_24h_suomi-npp-viirs-c2_data_375m_Fire_Detection_Centroids_(Last_12_to_24hrs).geojson",
    ];

    const footprintFileNames = [
      "canada_24h_suomi-npp-viirs-c2_data_375m_Fire_Detection_Footprints_(Last_0_to_6hrs).geojson",
      "canada_24h_suomi-npp-viirs-c2_data_375m_Fire_Detection_Footprints_(Last_6_to_12hrs).geojson",
      "canada_24h_suomi-npp-viirs-c2_data_375m_Fire_Detection_Footprints_(Last_12_to_24hrs).geojson",
      "usa_contiguous_and_hawaii_24h_suomi-npp-viirs-c2_data_375m_Fire_Detection_Footprints_(Last_0_to_6hrs).geojson",
      "usa_contiguous_and_hawaii_24h_suomi-npp-viirs-c2_data_375m_Fire_Detection_Footprints_(Last_6_to_12hrs).geojson",
      "usa_contiguous_and_hawaii_24h_suomi-npp-viirs-c2_data_375m_Fire_Detection_Footprints_(Last_12_to_24hrs).geojson",
    ];

    // Fetch and set the data
    fetchGeoJsonData(centroidFileNames).then(setCentroidData);
    fetchGeoJsonData(footprintFileNames).then(setFootprintData);
  }, []);

  // Function to handle map load event
  const handleMapLoad = (event) => {
    const map = event.target;

    // Store the map instance for later use
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
                  "circle-stroke-width": 4,
                  "circle-stroke-color": "#000000",
                  "circle-stroke-opacity": 0,
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
                    ["to-number", ["slice", ["get", "Brightness"], 0, -2]],
                    208,
                    0.2, // Low brightness still contributes, but weakly
                    367,
                    0.8, // High brightness contributes more strongly
                  ],
                  "heatmap-intensity": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    0,
                    0.8, // Slightly stronger intensity at lower zoom levels
                    10,
                    2, // Moderate intensity at higher zoom
                  ],
                  "heatmap-color": [
                    "interpolate",
                    ["linear"],
                    ["heatmap-density"],
                    0,
                    "rgba(33,102,172,0)", // Transparent at low density
                    0.2,
                    "rgb(103,169,207)", // Blue at medium-low density
                    0.4,
                    "rgb(253,219,199)", // Yellow to orange at medium density
                    0.6,
                    "rgb(239,138,98)", // Orange at higher density
                    1,
                    "rgb(178,24,43)", // Dark red at very high density
                  ],
                  "heatmap-radius": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    0,
                    3, // Increase the radius slightly at lower zoom levels to show more spread
                    9,
                    18, // Larger spread at higher zoom levels
                  ],
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

          {/* Route data */}
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
