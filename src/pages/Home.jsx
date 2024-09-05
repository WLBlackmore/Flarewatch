import React from "react";
import styles from './Home.module.css'

const Home = () => {
  return (
    <section className={styles.title}>
        <div className={styles.backgroundImage}>
            <div className={styles.titleFlex}>
                <div className={styles.titleText}> 
                    <h1>Flarewatch</h1>
                    <h3>Next Generation Fire Monitoring Tools</h3>
                </div>
            </div>
        </div>
    </section>
  );
};

export default Home;

