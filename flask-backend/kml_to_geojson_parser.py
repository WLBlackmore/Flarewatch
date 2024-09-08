import xml.etree.ElementTree as ET
import geojson
import re
import os

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
            data[key.strip()] = value.strip()
    return data

# Function to convert KML to GeoJSON
def kml_to_geojson(kml_file_path, output_dir):
    # Parse the KML file
    tree = ET.parse(kml_file_path)
    root = tree.getroot()

    # Create a directory for output GeoJSON files
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # Loop through each placemark (layer) in the KML
    for folder in root.findall(".//kml:Folder", namespaces):
        folder_name = folder.find("kml:name", namespaces).text.strip()

        features = []
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
            # Handle Polygon
            elif polygon is not None:
                coordinates = [
                    [
                        [float(coord.split(",")[0]), float(coord.split(",")[1])]
                        for coord in polygon.text.strip().split()
                    ]
                ]
                geometry = geojson.Polygon(coordinates)
            else:
                continue  # Skip if no geometry

            # Create GeoJSON feature
            feature = geojson.Feature(geometry=geometry, properties=properties)
            features.append(feature)

        # Save the GeoJSON for each folder/layer
        feature_collection = geojson.FeatureCollection(features)
        geojson_output_path = os.path.join(output_dir, f"{folder_name.replace(' ', '_')}.geojson")
        with open(geojson_output_path, 'w') as geojson_file:
            geojson.dump(feature_collection, geojson_file, indent=2)

        print(f"Saved GeoJSON: {geojson_output_path}")

# Example usage
kml_file_path = "SUOMI_VIIRS_C2_Canada_24h_1725740940864.kml"  # Path to your KML file
output_dir = "./test"  # Output directory for GeoJSON files
kml_to_geojson(kml_file_path, output_dir)
