import React from 'react';
import styles from './NewsCard.module.css';

const NewsCard = ({ 
  title, 
  description, 
  publishedAt, 
  url, 
  urlToImage, 
  source 
}) => {
  return (
    <article className={styles.newsCard}>
      {urlToImage && (
        <div className={styles.imageContainer}>
          <img 
            src={urlToImage} 
            alt={title} 
            className={styles.newsImage} 
          />
        </div>
      )}
      <div className={styles.content}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.metaData}>
          <span className={styles.source}>{source}</span>
          <span className={styles.publishedAt}>
            {new Date(publishedAt).toLocaleString()}
          </span>
        </p>
        <p className={styles.description}>{description}</p>
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className={styles.readMore}
        >
          Read more
        </a>
      </div>
    </article>
  );
};

export default NewsCard;
