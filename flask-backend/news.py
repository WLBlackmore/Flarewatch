import requests
import os
from dotenv import load_dotenv

# Load api key
load_dotenv()
newsapikey = os.getenv("NEWS_API")

def get_top_wildfire_headlines():
    url = "https://newsapi.org/v2/everything"
    
    # We want to find articles about wildfires in Canada or the United States,
    query_string = "wildfire"
    
    params = {
        "q": query_string,
        "searchIn": "title",  # <--- Only search in title + description
        "language": "en",
        "pageSize": 12,
        "sortBy": "publishedAt",
        "excludeDomains": "biztoc.com",
        "apiKey": newsapikey
    }

    response = requests.get(url, params=params)
    response.raise_for_status()  # Will raise an HTTPError if status != 200
    data = response.json()

    valid_articles = []

    for article in data.get('articles', []):
        print(f"Title: {article.get('title')}")
        print(f"Description: {article.get('description')}")
        print(f"URL: {article.get('url')}\n")

        title = article.get('title')

        if "[Removed]" not in title:
            valid_articles.append(article)

    return valid_articles