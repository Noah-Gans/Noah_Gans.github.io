from flask import Flask, jsonify, request
from flask_cors import CORS
import psycopg2
import psycopg2.extras

app = Flask(__name__)
#CORS(app, resources={r"/fetch-geography/*": {"origins": "*"}})
CORS(app)  # This will enable CORS for all routes
@app.route('/fetch-geography')
def fetch_geography():
    # ... (rest of your co
    delineation = request.args.get('delineation')
    min_lon = request.args.get('min_lon', type=float)
    min_lat = request.args.get('min_lat', type=float)
    max_lon = request.args.get('max_lon', type=float)
    max_lat = request.args.get('max_lat', type=float)

    # Connection parameters
    db_params = {
        'dbname': '2020LandView',
        'user': 'noahgans',
        'password': 'your_password',  # Replace with your actual password
        'host': 'localhost'
    }

    # Mapping to correct schema and table name based on delineation
    schema_table_mapping = {
    'bg': '"2020_bg"."national_block_groups"',
    'tract': '"2020_tract"."national_tracts"',
    'place': '"2020_place"."national_places"',
    'state': '"2020_state"."national_state"',
    'county': '"2020_county"."national_county"'
    }



    if delineation not in schema_table_mapping:
        return jsonify({'error': 'Invalid delineation type.'}), 400

    table_name = schema_table_mapping[delineation]

    try:
        with psycopg2.connect(**db_params) as conn:
            with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cursor:
                # ...
                # ...
                sql_query = f"""
                    SELECT json_build_object(
                        'type', 'FeatureCollection',
                        'features', json_agg(
                            json_build_object(
                                'type', 'Feature',
                                'geometry', ST_AsGeoJSON(ST_Transform(ST_Simplify(geom, 0.0001), 4326))::json,
                                'properties', json_build_object(
                                    'displayName', geoid,
                                    'statefp', statefp,
                                    'geoid', geoid
                                    -- Add more properties as needed
                                )
                            )
                        )
                    )
                    FROM {table_name}
                    WHERE ST_Intersects(
                        geom,
                        ST_Transform(ST_MakeEnvelope({min_lon}, {min_lat}, {max_lon}, {max_lat}, 4326), 4269)
                    )
                """



                app.logger.debug(f"SQL Query: {sql_query}")  # Log at debug level
                
                cursor.execute(sql_query)
                result = cursor.fetchone()

                if result and result['json_build_object']:
                    response = jsonify(result['json_build_object'])
                    return response
                else:
                    return jsonify({'error': 'No data found.'}), 404
    except psycopg2.Error as e:
        app.logger.error(f"SQL Error: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
