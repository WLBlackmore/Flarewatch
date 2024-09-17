import React from "react";
import styles from "./SatelliteDropdown.module.css";

const SatelliteDropdown = ({ selectedSatellite, setSelectedSatellite }) => {
    const satelliteOptions = [
        {value: "suomi-npp-viirs-c2", label: "Suomi NPP VIIRS"},
        {value: "noaa-20-viirs-c2", label: "NOAA-20 VIIRS"},
        {value: "c6.1", label: "MODIS"},
        {value: "landsat" , label: "LANDSAT"},
    ];

    const handleSatelliteChange = (e) => {
        setSelectedSatellite(e.target.value);
    };

    return ( 
        <div>
            <label htmlFor="satellite-select">Select Satellite:</label>
            <select
                id="satellite-select"
                value={selectedSatellite}
                onChange={handleSatelliteChange}
                className={styles.satelliteSelect}
            >
                {satelliteOptions.map((satellite) => (
                    <option key={satellite.value} value={satellite.value}>
                        {satellite.label}
                    </option>
                ))}
            </select>
        </div>
    )

};

export default SatelliteDropdown;

