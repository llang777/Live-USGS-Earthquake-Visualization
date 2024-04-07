// Define the API endpoint URL for the earthquake data
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Function to determine the marker size based on the earthquake magnitude
function markerSize(magnitude) {
  return magnitude * 4; // Adjust the multiplier as needed for visual effect
}

// Function to determine the marker color based on the earthquake depth
function markerColor(depth) {
  if (depth > 90) return "#FF0000";
  else if (depth > 70) return "orangered";
  else if (depth > 50) return "orange";
  else if (depth > 30) return "gold";
  else if (depth > 10) return "yellow";
  else return "lightgreen";
}

// Perform a GET request to the query URL to get earthquake data
d3.json(queryUrl).then(function(data) {
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {
  // Define a function for each feature to bind a popup
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>Location: " + feature.properties.place +
      "</h3><hr><p>Date: " + new Date(feature.properties.time) +
      "</p><p>Magnitude: " + feature.properties.mag + "</p><p>Depth: " + feature.geometry.coordinates[2] + " km</p>");
  }

  // Create a GeoJSON layer containing the features array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng, {
        radius: markerSize(feature.properties.mag),
        fillColor: markerColor(feature.geometry.coordinates[2]),
        color: "#000000",
        weight: 0.5,
        opacity: 1,
        fillOpacity: 0.7
      });
    }
  });

  // Send earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {
  // Define the tile layer for the map background
  var lightmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  // Create the map object with layers
  var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [lightmap, earthquakes]
  });

  // Create a legend for the map
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create('div', 'info legend'),
      depths = [-10, 10, 30, 50, 70, 90],
      colors = [
        "lightgreen",
        "yellow",
        "gold",
        "orange",
        "orangered",
        "red"
      ],
      names = [
        "0-10: Light Green",
        "10-30: Yellow",
        "30-50: Gold",
        "50-70: Orange",
        "70-90: Orangered",
        "90+: Red"
      ];

    div.innerHTML += '<h3>Depth</h3>'
    for (var i = 0; i < depths.length; i++) {
      div.innerHTML +=
        '<i style="background:' + colors[i] + '"></i> ' +
        names[i] + '<br>';
    }

    return div;
  };

  // Adding legend to the map
  legend.addTo(myMap);
}
