import requests
import os
from dotenv import load_dotenv

# Load api key
load_dotenv()
newsapikey = os.getenv("NEWS_API")

def get_top_wildfire_headlines():
    url = "https://newsapi.org/v2/everything"
    
    # We want to find articles about wildfires in Canada or the United States,
    query_string = "wildfire AND (Canada OR 'United States')"
    
    params = {
        "q": query_string,
        "searchIn": "title,description",  # <--- Only search in title + description
        "language": "en",
        "pageSize": 10,
        "sortBy": "relevancy",
        "apiKey": newsapikey
    }

    response = requests.get(url, params=params)
    response.raise_for_status()  # Will raise an HTTPError if status != 200
    data = response.json()

    for article in data.get('articles', []):
        print(f"Title: {article.get('title')}")
        print(f"Description: {article.get('description')}")
        print(f"URL: {article.get('url')}\n")

    return data