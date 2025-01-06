import styles from './News.module.css';
import { useState, useEffect } from 'react';
import axios from "axios";


const News = () => {

    // State to store the top wildfire news headlines
    const [newsData, setNewsData] = useState(null);

    // Retrieve the current top wildfire news headlines on component mount
    useEffect(() => {
        console.log("Performing get request for news");
        axios.get("http://localhost:5000/news")
            .then((response) => {
                console.log("Succesfully retrieved news data");
                console.log(response.data);
                setNewsData(response.data);

            }
            )
            .catch((error) => {
                console.log("Error retrieving news data, ", error);
            }
            )

        

    }, []);

    return (
        <h1>Top Wildfire News</h1>
    )
}

export default News;