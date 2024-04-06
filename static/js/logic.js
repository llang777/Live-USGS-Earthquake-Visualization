// Initialize the map on the "map" div with a given center and zoom level
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
  });
  
  // Add a base map layer
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(myMap);
  
  // Function to determine the size of the marker based on the earthquake's magnitude
  function markerSize(magnitude) {
    return magnitude * 5;
  }
  
  // Function to choose the color of the marker based on the earthquake's depth
  function markerColor(depth) {
    // This function assumes depth is a number representing the depth in kilometers
    return depth > 90 ? '#EA2C2C' :
           depth > 70 ? '#EA822C' :
           depth > 50 ? '#EE9C00' :
           depth > 30 ? '#EECC00' :
           depth > 10 ? '#D4EE00' :
                        '#98EE00';
  }
  
  // Fetch the GeoJSON data
  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(earthquakeData) {
    // Check that the data is loaded
    console.log(earthquakeData);
  
    // Create a marker for the first earthquake feature
    var firstFeature = earthquakeData.features[0];
    var coords = firstFeature.geometry.coordinates;
    var magnitude = firstFeature.properties.mag;
    var depth = coords[2]; // The depth is the third item in the coordinates array
  
    // Create a circle marker with the appropriate size and color
    var earthquakeMarker = L.circleMarker([coords[1], coords[0]], { // latitude, longitude
      radius: markerSize(magnitude),
      fillColor: markerColor(depth),
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    }).addTo(myMap);
  
    // Bind a popup to the marker with some of the earthquake's data
    earthquakeMarker.bindPopup("Magnitude: " + magnitude + "<br>Depth: " + depth + "<br>Location: " + firstFeature.properties.place);
  });
  
  // You can omit the legend and animation for this minimal example to focus on getting one marker to show up
  