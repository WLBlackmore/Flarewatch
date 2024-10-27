from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import osm_to_geojson
from dotenv import load_dotenv
import os
import json
from fetch_nasa_firms_data import combine_nasa_firms_geojson

# Database imports
from models import db, FireReport
from config import DATABASE_URL

# Load environment variables
load_dotenv()

# Initialize Flask app and enable CORS
app = Flask(__name__)
CORS(app)

# Configure SQLAlchemy database
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize SQLAlchemy database
db.init_app(app)

# Create tables
with app.app_context():
    db.create_all()

# Mapbox token
mapbox_token = os.getenv('MAPBOX_TOKEN')

@app.route('/')
def hello_world():
    return jsonify({'message': 'Welcome to the Wildfire Dashboard API'})

@app.route('/find-fire-stations', methods=['POST'])
def find_fire_stations():
    data = request.get_json()
    latitude = data['latitude']
    longitude = data['longitude']
    radius = 10000
    print (latitude, longitude)

    # Build OSM query
    overpass_url = "http://overpass-api.de/api/interpreter"
    overpass_query = f"""
    [out:json];
    (
        node["amenity"="fire_station"](around:{radius},{latitude},{longitude});
    );
    out body;
    """

    overpass_response = requests.post(overpass_url, data={'data': overpass_query})
    osm_data = overpass_response.json()
    fire_stations = osm_data['elements']

    for station in fire_stations:
        print(station)

    # if no fire stations found, let the user know
    if len(fire_stations) == 0:
        return jsonify({'message': 'No fire stations found within a 10km radius.'})
    else:
        # Convert OSM data to GeoJSON
        geojson_data = osm_to_geojson.osm_to_geojson(osm_data)
        return jsonify(geojson_data)


@app.route('/find-route', methods=['POST'])
def find_route():
    data = request.get_json()
    station_latitude = data['stationCoordinates']['latitude']
    station_longitude = data['stationCoordinates']['longitude']
    fire_latitude = data['fireCoordinates']['latitude']
    fire_longitude = data['fireCoordinates']['longitude']

    # Build Mapbox Directions API request
    directions_url = "https://api.mapbox.com/directions/v5/mapbox/driving"
    coords = f"{station_longitude},{station_latitude};{fire_longitude},{fire_latitude}"
    request_string = f"{directions_url}/{coords}?geometries=geojson&access_token={mapbox_token}"

    # Fetch route data from Mapbox Directions API
    try:
        response = requests.get(request_string)
        response.raise_for_status()
        route_data = response.json()
        return jsonify(route_data)
    except requests.exceptions.HTTPError as err:
        print(f"HTTP error occurred: {err}")
        return jsonify({'message': 'Error fetching route data'})

@app.route('/get-nasa-fire-data')
def get_nasa_fire_data():
    sattelite_data_geojson = combine_nasa_firms_geojson()
    return jsonify(sattelite_data_geojson)
    
# Fire report service

@app.route('/firereports', methods=['POST'])
def post_fire_report():
    # Get data from request
    data = request.get_json()
    longitude = data['longitude']
    latitude = data['latitude']
    severity = data['severity']
    description = data['description']
    phone = data['phone']

    print(data)
    
    # Save data to PostGis database

    return jsonify({'message': 'Fire report submitted successfully'})

@app.route('/firereports', methods=['GET'])
def get_fire_reports():
    # Get data from PostGis database

    return jsonify({'message': 'Fire reports fetched successfully'})

@app.route('/firereports/<id>', methods=['GET'])
def get_fire_report(id):
    # Get data from PostGis database

    return jsonify({'message': 'Fire report fetched successfully'})

@app.route('/firereports/<id>', methods=['PUT'])
def update_fire_report(id):
    # Get data from request
    data = request.get_json()
    longitude = data['longitude']
    latitude = data['latitude']
    severity = data['severity']
    description = data['description']
    phone = data['phone']

    # Update data in PostGis database

    return jsonify({'message': 'Fire report updated successfully'})

if __name__ == '__main__':
    app.run(debug=True)