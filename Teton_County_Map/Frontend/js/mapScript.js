// Create a Leaflet map centered at [37.8, -96] with an initial zoom level of 4
var map = L.map("map").setView([37.8, -96], 4);

// Add OpenStreetMap tiles to the map
var tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

// Cloud Function's URL
const cloudFunctionUrl =
  "http://localhost:3000/fetch-data";

// Layer to hold the GeoJSON data
var geoJsonLayer = L.geoJSON().addTo(map);

// Function to fetch GeoJSON data from your Cloud Function
// Function to fetch GeoJSON data from your Cloud Function
function fetchGeoJsonData(bounds) {
    // Extract the bounding box coordinates
    const min_lon = bounds.getWest();
    const min_lat = bounds.getSouth();
    const max_lon = bounds.getEast();
    const max_lat = bounds.getNorth();

    // Construct the query parameters
    const queryParams = new URLSearchParams({
        min_lon,
        min_lat,
        max_lon,
        max_lat
    });

    fetch(`${cloudFunctionUrl}?${queryParams.toString()}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json(); // Parse the response as JSON
        })
        .then(data => {
            console.log('Data from Cloud Function:', data); // Log the data
            // You can add code here to process and display the data on the map
            // For example, updating the geoJsonLayer with new data:
            geoJsonLayer.clearLayers(); // Clear existing layers
            geoJsonLayer.addData(data); // Add new data
        })
        .catch(error => {
            console.error('Error fetching data from Cloud Function:', error);
        });
}


// Fetch data when the map is moved or zoomed
map.on("moveend", function () {
  var bounds = map.getBounds();
  fetchGeoJsonData(bounds);
});
map.on("zoomend", function () {
  var bounds = map.getBounds();
  fetchGeoJsonData(bounds);
});
