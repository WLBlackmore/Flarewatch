import React from "react";
import styles from "./About.module.css";
import AboutCard from "../components/AboutCard";

import suomiNPPVIIRS from "../assets/suomi-npp.jpg";
import noaa20VIIRS from "../assets/20VIIRS.png";
import noaa21VIIRS from "../assets/21VIIRS.png";
import modis from "../assets/modis.png";
import landsat from "../assets/landsat.png";

const About = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>About</h1>
      <hr  />

      <section className={styles.satelliteSection}>
        <h2 className={styles.subheading}>Satellites</h2>
        <div className={styles.cardContainer}>
          <AboutCard
            title="Suomi NPP VIIRS"
            description="The Suomi NPP satellite's VIIRS sensor detects and monitors wildfires by capturing high-resolution imagery in visible and infrared wavelengths. It identifies fire hotspots, tracks their spread, and provides real-time data critical for wildfire management"
            image={suomiNPPVIIRS}
          />

          <AboutCard
            title="NOAA-20 VIIRS"
            description="The NOAA-20 satellite's VIIRS sensor provides data on wildfires, including fire hotspots and smoke plumes. It captures imagery in visible and infrared wavelengths, enabling the detection and monitoring of wildfires in real-time."
            image={noaa20VIIRS}
          />

          <AboutCard
            title="NOAA-21 VIIRS"
            description="The NOAA-21 satellite's VIIRS sensor enhances wildfire monitoring by capturing high-resolution imagery across visible and infrared wavelengths. It provides critical data on fire intensity and movement, aiding in rapid response and damage assessment."
            image={noaa21VIIRS}
          />

          <AboutCard
            title="MODIS"
            description="The MODIS sensors, aboard NASA's Terra and Aqua satellites, are essential for wildfire monitoring. They capture data in visible and infrared wavelengths, detecting active fire hotspots, tracking their spread, and providing global coverage up to four times daily. MODIS has been instrumental in wildfire detection, offering long-term datasets for analyzing fire trends and impacts on ecosystems."
            image={modis}
          />

          <AboutCard
            title="LANDSAT"
            description="The Landsat satellites, operated by NASA and the USGS, provide detailed wildfire monitoring through high-resolution imagery across visible, infrared, and thermal wavelengths. While not as frequent as other sensors, Landsat excels in capturing precise fire boundaries, burn severity, and post-fire recovery, offering critical data for long-term wildfire impact analysis and land management"
            image={landsat}
          />
        </div>
      </section>
    </div>
  );
};

export default About;
