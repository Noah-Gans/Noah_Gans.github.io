import json

def extract_unique_zoning_types(geojson_file_path):
    with open('/Users/noahgans/Desktop/GeographicViewExample/Database/geojsons/county_zoning.geojson', 'r') as file:
        geojson_data = json.load(file)
    
    zoning_types = set()  # Use a set to store unique zoning types

    for feature in geojson_data['features']:
        if 'properties' in feature and 'zoning' in feature['properties']:
            zoning_types.add(feature['properties']['zoning'])

    print("Unique Zoning Types:")
    for zoning_type in zoning_types:
        print(zoning_type)

# Replace 'path/to/your/geojson_file.geojson' with the actual path to your GeoJSON file
geojson_file_path = 'path/to/your/geojson_file.geojson'
extract_unique_zoning_types(geojson_file_path)