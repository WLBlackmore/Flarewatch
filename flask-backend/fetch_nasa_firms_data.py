import requests
import kml_to_geojson_parser
import zipfile
import os
import io
import json

def fetch_nasa_firms_data(region, datespan, sensor):
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
    import os
    # **Base directory for data**
    base_dir = 'nasa_firms_data'

    # **Create the base directory if it doesn't exist**
    os.makedirs(base_dir, exist_ok=True)

    # Parameter list
    api_parameter_list = []

    # Define regions and sensors
    regions = [
        {
            'region': 'canada',
            'datespan': '24h',
            'sensors': ['suomi-npp-viirs-c2', 'c6.1']
        },
        {
            'region': 'usa_contiguous_and_hawaii',
            'datespan': '24h',
            'sensors': ['suomi-npp-viirs-c2', 'c6.1']
        }
    ]

    for region_info in regions:
        region = region_info['region']
        datespan = region_info['datespan']
        sensors = region_info['sensors']
        for sensor in sensors:
            if region == 'usa_contiguous_and_hawaii':
                region_name = 'usa'
            elif region == 'canada':
                region_name = 'can'
            else:
                region_name = region
            dir_cache = os.path.join(base_dir, f"{region_name}_{sensor}_{datespan}")
            parameters = (region, datespan, sensor, dir_cache)
            api_parameter_list.append(parameters)

    if not api_parameter_list:
        print("No parameters found.")
        return

    # Loop through each set of parameters
    for parameters in api_parameter_list:
        region, datespan, sensor, dir_cache = parameters

        print(f"Processing NASA FIRMS data for {region} region, {datespan} datespan, {sensor} sensor...")

        # Fetch NASA FIRMS data
        kml_file_path = fetch_nasa_firms_data(region, datespan, sensor)
        
        # **Ensure kml_file_path is valid**
        if kml_file_path is None:
            print(f"Failed to fetch KML data for {region} with sensor {sensor}. Skipping.")
            continue

        # Convert the KML data to GeoJSON
        output_dir = dir_cache
        kml_to_geojson_parser.kml_to_geojson(kml_file_path, output_dir)

        # After converting the KML data to GeoJSON, remove the KML file
        os.remove(kml_file_path)
        print(f"Removed KML: {kml_file_path}")


def combine_nasa_firms_geojson():
    base_dir = './nasa_firms_data'
    
    # Get all directories in the base directory
    all_dirs = [d for d in os.listdir(base_dir) if os.path.isdir(os.path.join(base_dir, d))]
    
    result = {}
    
    for dir_name in all_dirs:
        dir_path = os.path.join(base_dir, dir_name)
        components = dir_name.split('_')
        
        # Ensure the directory name has at least three components
        if len(components) < 3:
            print(f"Skipping directory '{dir_name}' due to unexpected naming format.")
            continue
        
        # Extract satellite name
        # Satellite name may contain underscores; join intermediate components
        satellite_name = '_'.join(components[1:-1])
        
        # Initialize nested dictionaries
        if satellite_name not in result:
            result[satellite_name] = {
                "centroids": {
                    "type": "FeatureCollection",
                    "features": []
                },
                "polygons": {
                    "type": "FeatureCollection",
                    "features": []
                }
            }
        
        # Process 'centroids' and 'polygons' subdirectories
        for geo_type in ['centroids', 'polygons']:
            path = os.path.join(dir_path, geo_type)
            if os.path.exists(path):
                for filename in os.listdir(path):
                    if filename.endswith('.geojson'):
                        filepath = os.path.join(path, filename)
                        with open(filepath, 'r') as f:
                            data = json.load(f)
                            if data.get('type') == 'FeatureCollection':
                                result[satellite_name][geo_type]['features'].extend(data.get('features', []))
                            elif data.get('type') == 'Feature':
                                result[satellite_name][geo_type]['features'].append(data)
    return result

# Process NASA FIRMS data
process_nasa_firms_data()