import geojson

def osm_to_geojson(osm_data):
    features = []

    for element in osm_data['elements']:
        # Convert nodes to GeoJSON points
        if element['type'] == 'node':
            point = geojson.Point((element['lon'], element['lat']))
            properties = element.get('tags', {})
            properties['longitude'] = element['lon']  # Store longitude as a property
            properties['latitude'] = element['lat']  # Store latitude as a property
            feature = geojson.Feature(geometry=point, properties=properties)
            features.append(feature)

        # Convert ways (line/polygon) to GeoJSON
        elif element['type'] == 'way':
            if 'nodes' in element:
                coordinates = []
                for node_id in element['nodes']:
                    # Extract node coordinates
                    node = next((item for item in osm_data['elements'] if item['id'] == node_id and item['type'] == 'node'), None)
                    if node:
                        coordinates.append((node['lon'], node['lat']))
        
                # Create either a LineString or Polygon based on the way
                if element.get('tags', {}).get('area') == 'yes':
                    geometry = geojson.Polygon([coordinates])
                else:
                    geometry = geojson.LineString(coordinates)
                
                properties = element.get('tags', {})
                properties['longitude'] = coordinates[0][0]  # Store longitude of the first coordinate as a property
                properties['latitude'] = coordinates[0][1]  # Store latitude of the first coordinate as a property
                feature = geojson.Feature(geometry=geometry, properties=properties)
                features.append(feature)

    # Create a FeatureCollection
    feature_collection = geojson.FeatureCollection(features)
    return feature_collection
