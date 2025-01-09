import React from 'react';
import styles from './AboutCard.module.css';

const AboutCard = ({ title, description, image }) => {
  return (
    <div className={styles.card}>
      {/* “Front” – Image */}
      <div className={styles.front}>
        <img src={image} alt={title} className={styles.cardImage} />
      </div>

      {/* “Back” – Full description */}
      <div className={styles.back}>
        <h3 className={styles.cardTitle}>{title}</h3>
        <p className={styles.cardDescription}>{description}</p>
      </div>
    </div>
  );
};

export default AboutCard;
