import styles from './News.module.css';
import { useState, useEffect } from 'react';
import axios from "axios";
import NewsCard from '../components/NewsCard';

const News = () => {
    // State to store the top wildfire news headlines
    const [newsData, setNewsData] = useState(null);

    // Retrieve the current top wildfire news headlines on component mount
    useEffect(() => {
        console.log("Performing get request for news");
        axios.get("http://localhost:5000/news")
            .then((response) => {
                console.log("Successfully retrieved news data");
                console.log(response.data.articles);
                setNewsData(response.data.articles);
            })
            .catch((error) => {
                console.log("Error retrieving news data, ", error);
            });
    }, []);

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Top Wildfire News</h1>
            <hr />
            {newsData ? (
                <div className={styles.newsCardGrid}>
                    {newsData.map((article, index) => (
                        <NewsCard
                            key={index}
                            title={article.title}
                            description={article.description}
                            publishedAt={article.publishedAt}
                            url={article.url}
                            urlToImage={article.urlToImage}
                            source={article.source.name}
                        />
                    ))}
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default News;
