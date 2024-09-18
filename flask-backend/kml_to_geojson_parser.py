import xml.etree.ElementTree as ET
import geojson
import re
import os
from datetime import datetime, timezone

# Define namespaces for KML parsing
namespaces = {
    "kml": "http://earth.google.com/kml/2.1",
}

# Function to parse the description field into key-value pairs
def parse_description(description):
    # Remove HTML tags and extra spaces
    description_cleaned = re.sub(r'<[^>]+>', '', description)
    lines = [line.strip() for line in description_cleaned.split("\n") if line.strip()]
    
    data = {}
    for line in lines:
        if ": " in line:
            key, value = line.split(": ", 1)
            key = key.strip()
            value = value.strip()

            # Convert UTC to Epoch
            if key == "Detection Time":
                date_format = "%Y-%m-%d %H:%M %Z"
                date = datetime.strptime(value, date_format)
                date = date.replace(tzinfo=timezone.utc)
                value = int(date.timestamp())
            
            data[key] = value
            
    return data

# Function to convert KML to GeoJSON and separate centroids and polygons
def kml_to_geojson(kml_file_path, output_dir):
    # Parse the KML file
    tree = ET.parse(kml_file_path)
    root = tree.getroot()

    # Create directories for centroids (points) and polygons
    points_dir = os.path.join(output_dir, "centroids")
    polygons_dir = os.path.join(output_dir, "polygons")

    if not os.path.exists(points_dir):
        os.makedirs(points_dir)
    if not os.path.exists(polygons_dir):
        os.makedirs(polygons_dir)

    # Loop through each placemark (layer) in the KML
    for folder in root.findall(".//kml:Folder", namespaces):
        folder_name = folder.find("kml:name", namespaces).text.strip()

        point_features = []
        polygon_features = []

        for placemark in folder.findall(".//kml:Placemark", namespaces):
            # Extract the geometry (point, polygon, etc.)
            point = placemark.find(".//kml:Point/kml:coordinates", namespaces)
            polygon = placemark.find(".//kml:Polygon/kml:outerBoundaryIs/kml:LinearRing/kml:coordinates", namespaces)
            description = placemark.find(".//kml:description", namespaces)

            if description is not None:
                properties = parse_description(description.text)
            else:
                properties = {}

            # Handle Point
            if point is not None:
                coordinates = point.text.strip().split(",")
                lon, lat = float(coordinates[0]), float(coordinates[1])
                geometry = geojson.Point((lon, lat))
                feature = geojson.Feature(geometry=geometry, properties=properties)
                point_features.append(feature)
            # Handle Polygon
            elif polygon is not None:
                coordinates = [
                    [
                        [float(coord.split(",")[0]), float(coord.split(",")[1])]
                        for coord in polygon.text.strip().split()
                    ]
                ]
                geometry = geojson.Polygon(coordinates)
                feature = geojson.Feature(geometry=geometry, properties=properties)
                polygon_features.append(feature)

        # Save centroids (points) GeoJSON for each folder/layer
        if point_features:
            point_feature_collection = geojson.FeatureCollection(point_features)
            points_output_path = os.path.join(points_dir, f"{folder_name.replace(' ', '_')}_centroids.geojson")
            with open(points_output_path, 'w') as points_geojson_file:
                geojson.dump(point_feature_collection, points_geojson_file, indent=2)
            print(f"Saved Centroids GeoJSON: {points_output_path}")

        # Save polygons GeoJSON for each folder/layer
        if polygon_features:
            polygon_feature_collection = geojson.FeatureCollection(polygon_features)
            polygons_output_path = os.path.join(polygons_dir, f"{folder_name.replace(' ', '_')}_polygons.geojson")
            with open(polygons_output_path, 'w') as polygons_geojson_file:
                geojson.dump(polygon_feature_collection, polygons_geojson_file, indent=2)
            print(f"Saved Polygons GeoJSON: {polygons_output_path}")

# # Example usage
# kml_file_path = "SUOMI_VIIRS_C2_Canada_24h_1725740940864.kml"  # Path to your KML file
# output_dir = "./test"  # Output directory for GeoJSON files
# kml_to_geojson(kml_file_path, output_dir)
