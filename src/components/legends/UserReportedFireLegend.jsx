import React from "react";
import styles from  "./UserReportedFireLegend.module.css"
import redUser from "../../assets/reduser.png"
import orangeUser from "../../assets/orangeuser.png"
import yellowUser from "../../assets/yellowuser.png"


const UserReportedFireLegend = () => {
  return (
    <div className={styles.container}>
        <h3>Fire Radiative Power</h3>
      <div className={styles.legendItem}>
        <div className={styles.high}> <img src={redUser} alt="high severity" /> </div>
        <p>High {"(> 10 MW)"}</p>
      </div>
      <div className={styles.legendItem}>
        <div className={styles.medium}><img src={orangeUser} alt="med severity" /></div>
        <p>Medium {"(2-10 MW)"}</p>
      </div>
      <div className={styles.legendItem}>
        <div className={styles.low}><img src={yellowUser} alt="low severity" /></div>
        <p>Low {"(< 2 MW)"}</p>
      </div>
    </div>
  );
};

export default UserReportedFireLegend;
