import React from "react";
import styles from './MainMapSidebar.module.css';  // Sidebar-specific styles

const MainMapSidebar = () => {
  return (
    <div className={styles.sidebar}>
      <h2>Tool Bar</h2>
      <div className={styles.filterSection}>
        <p>Filter Options</p>
        <label>
          <input type="checkbox" />
          Show Wildfires
        </label>
        <label>
          <input type="checkbox" />
          Show Smoke Layer
        </label>
      </div>
    </div>
  );
};

export default MainMapSidebar;
