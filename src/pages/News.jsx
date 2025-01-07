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
                console.log("Succesfully retrieved news data");
                console.log(response.data.articles);
                setNewsData(response.data.articles);
            }
            )
            .catch((error) => {
                console.log("Error retrieving news data, ", error);
            }
            )

    }, []);

    return (
        <>
            <h1>Top Wildfire News</h1>
            <div className={styles.newsCardFlex}>
            {newsData ? (
                newsData.map((article, index) => (
                    <NewsCard
                        key={index}
                        title={article.title}
                        description={article.description}
                        publishedAt={article.publishedAt}
                        url={article.url}
                        urlToImage={article.urlToImage}
                        source={article.source.name}
                    />
                ))
            ) : (
                <p>Loading...</p>
            )}
            </div>
        </>
    )
}

export default News;