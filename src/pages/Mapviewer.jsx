import React, { useState, useEffect } from "react";
import styles from "./Mapviewer.module.css";
import MainMap from "../components/MainMap";
import MainMapSidebar from "../components/MainMapSidebar";
import MapLegend from "../components/MapLegend";
import axios from "axios";

const Mapviewer = () => {
  // Filter State
  const [showFRP, setShowFRP] = useState(true);
  const [showBrightness, setShowBrightness] = useState(false);
  const [showConfidence, setShowConfidence] = useState(false);
  const [selectedSatellite, setSelectedSatellite] =
    useState("suomi-npp-viirs-c2");
  const [timeFilter, setTimeFilter] = useState([0, 24]);
  const [showActiveReportedFires, setShowActiveReportedFires] = useState(false)

  // Layer State
  const [selectedFire, setSelectedFire] = useState(null);
  const [nearestFireStations, setNearestFireStations] = useState(null);
  const [selectedFireStation, setSelectedFireStation] = useState(null);
  const [routeData, setRouteData] = useState(null);

  // NASA Fire Data
  const [allSatelliteData, setAllSatelliteData] = useState(null);
  const [centroidData, setCentroidData] = useState(null);
  const [footprintData, setFootprintData] = useState(null);

  // User reported fire data
  const [activeReportedFires, setActiveReportedFires] = useState(null);

  // Fire station not found state
  const [fireStationNotFound, setFireStationNotFound] = useState("");

  // Fetch NASA fire data and user reported fire on component mount
  useEffect(() => {
    Promise.all([
        axios.get("http://localhost:5000/get-nasa-fire-data"),
        axios.get("http://localhost:5000/firereports/active")
    ]).then(([satelliteResponse, reportResponse]) => {
        const satelliteData = satelliteResponse.data;
        const reportData = reportResponse.data;

        console.log(reportData)

        setAllSatelliteData(satelliteData);
        setCentroidData(satelliteData[selectedSatellite].centroids);
        setFootprintData(satelliteData[selectedSatellite].polygons);
        setActiveReportedFires(reportData);
    }).catch((error) => console.error("Error fetching data:", error));
}, []);


  // Update centroid and footprint data when selected satellite changes
  useEffect(() => {
    if (allSatelliteData) {
      setCentroidData(allSatelliteData[selectedSatellite].centroids);
      setFootprintData(allSatelliteData[selectedSatellite].polygons);
    }
  }, [selectedSatellite, allSatelliteData]);

  // Clear the selected fields when the satellite changes
  useEffect(() => {
    setSelectedFire(null);
    setSelectedFireStation(null);
    setNearestFireStations(null);
    setRouteData(null);
    setFireStationNotFound("");
  }, [selectedSatellite]);

  // Find nearest fire stations
  const handleFindFireStations = async () => {
    console.log("Finding nearest 5 fire stations");
    console.log(selectedFire);

    // Clear existing route data
    setRouteData(null);

    try {
      const response = await axios
        .post("http://localhost:5000/find-fire-stations", {
          latitude: selectedFire.Latitude ? selectedFire.Latitude : selectedFire.latitude,
          longitude: selectedFire.Longitude ? selectedFire.Longitude : selectedFire.longitude,
        })
        .then((response) => response.data);

      // Add fire coordinates to the nearest fire stations data
      const fireCoordinates = {
        latitude: selectedFire.Latitude ? selectedFire.Latitude : selectedFire.latitude,
        longitude: selectedFire.Longitude ? selectedFire.Longitude : selectedFire.longitude,
      };

      console.log("response message", response.message);

      if (response.message) {
        setFireStationNotFound(response.message);
      } else {
        setNearestFireStations({ ...response, fireCoordinates });
        console.log("Nearest fire stations:", nearestFireStations);
      }
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

  return (
    <div className={styles.mapviewerContainer}>
      <MapLegend
        showFRP={showFRP}
        showBrightness={showBrightness}
        showConfidence={showConfidence}
        showActiveReportedFires={showActiveReportedFires}
      />
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
        centroidData={centroidData}
        footprintData={footprintData}
        handleFindFireStations={handleFindFireStations}
        handleFindRoute={handleFindRoute}
        fireStationNotFound={fireStationNotFound}
        setFireStationNotFound={setFireStationNotFound}
        showActiveReportedFires={showActiveReportedFires}
        activeReportedFires={activeReportedFires}
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
        showActiveReportedFires={showActiveReportedFires}
        setShowActiveReportedFires={setShowActiveReportedFires}
      />
    </div>
  );
};

export default Mapviewer;
