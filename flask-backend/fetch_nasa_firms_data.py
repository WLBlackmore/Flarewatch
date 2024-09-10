import requests
import kml_to_geojson_parser
import zipfile
import os
import io

def fetch_nasa_firms_viirs_data(region, datespan, sensor):
    # Define the URL for the NASA FIRMS API
    url = f"https://firms.modaps.eosdis.nasa.gov/api/kml_fire_footprints/{region}/{datespan}/{sensor}"

    try:
        # Fetch the data from the NASA FIRMS API
        response = requests.get(url)

        # Raise an exception if the request was unsuccessful
        response.raise_for_status()

        # Extract the KML data from the KMZ file
        kmz_data = io.BytesIO(response.content)

        # Create a /kml_cache directory if it doesn't exist
        kml_cache_dir = './kml_cache'
        os.makedirs(kml_cache_dir, exist_ok=True)

        with zipfile.ZipFile(kmz_data, 'r') as kmz:
            for kml_file in kmz.namelist():
                if kml_file.endswith('.kml'):
                    kml_data = kmz.read(kml_file)

                    # Save the KML data to the /kml_cache directory
                    kml_output_path = os.path.join(kml_cache_dir, f"{region}_{datespan}_{sensor}.kml")
                    with open(kml_output_path, 'wb') as f:
                        f.write(kml_data)
                    
                    print(f"Saved KML: {kml_output_path}")
                    return kml_output_path

    except requests.exceptions.HTTPError as err:
        print(f"HTTP error occurred: {err}")
        return None
    
    except requests.exceptions.RequestException as err:
        print(f"Request error occurred: {err}")
        return None
    
    except Exception as err:
        print(f"An error occurred: {err}")
        return None
    

def process_nasa_firms_data():
    # Canada region, 24-hour data, VIIRS sensor
    region = "canada"
    datespan = "24h"
    sensor = "suomi-npp-viirs-c2"

    # Fetch the NASA FIRMS VIIRS data
    kml_file_path = fetch_nasa_firms_viirs_data(region, datespan, sensor)

    if kml_file_path:
        # Convert the KML data to GeoJSON
        output_dir = f"{region}_{datespan}_{sensor}_geojson"
        kml_to_geojson_parser.kml_to_geojson(kml_file_path, output_dir)

        # After converting the KML data to GeoJSON, remove the KML file
        os.remove(kml_file_path)
        print(f"Removed KML: {kml_file_path}")
    else:
        print("Failed to fetch NASA FIRMS data")
    
# Process the NASA FIRMS data
process_nasa_firms_data()    
    