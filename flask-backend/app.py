from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import osm_to_geojson

app = Flask(__name__)
CORS(app)

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
        return jsonify({'message': 'No fire stations found'})
    else:
        # Convert OSM data to GeoJSON
        geojson_data = osm_to_geojson.osm_to_geojson(osm_data)
        return jsonify(geojson_data)


    



if __name__ == '__main__':
    app.run(debug=True)