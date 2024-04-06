// Create a map object
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
  });
  
  // Add a base layer
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(myMap);
  
  // Function to determine marker size based on earthquake magnitude
  function markerSize(magnitude) {
    return magnitude * 5;
  }
  
  // Function to determine marker color based on earthquake depth
  function markerColor(depth) {
    return depth > 90 ? '#EA2C2C' :
           depth > 70 ? '#EA822C' :
           depth > 50 ? '#EE9C00' :
           depth > 30 ? '#EECC00' :
           depth > 10 ? '#D4EE00' :
                        '#98EE00';
  }
  
  // Get GeoJSON and plot it
  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(earthquakeData) {
    // Create a GeoJSON layer with the retrieved data
    L.geoJSON(earthquakeData, {
      // Create circle markers
      pointToLayer: function(feature, latlng) {
        var geojsonMarkerOptions = {
          radius: markerSize(feature.properties.mag),
          fillColor: markerColor(feature.geometry.coordinates[2]),
          color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        };
        var marker = L.circleMarker(latlng, geojsonMarkerOptions);
  
        animateMarker(marker);
  
        return marker;
      },
      // Create popups
      onEachFeature: function(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
          "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
          "<p>Magnitude: " + feature.properties.mag + "</p>" +
          "<p>Depth: " + feature.geometry.coordinates[2] + " km</p>");
      }
    }).addTo(myMap);
  
    // Set up the legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
      var div = L.DomUtil.create('div', 'info legend'),
          depths = [-10, 10, 30, 50, 70, 90],
          labels = [];
  
      // loop through our depth intervals and generate a label with a colored square for each interval
      for (var i = 0; i < depths.length; i++) {
          div.innerHTML +=
              '<i style="background:' + markerColor(depths[i] + 1) + '"></i> ' +
              depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + ' km<br>' : '+ km');
      }
  
      return div;
    };
  
    // Adding legend to the map
    legend.addTo(myMap);
  });
  
  // Function to animate the markers
  function animateMarker(marker) {
    var originalRadius = marker.options.radius;
    var pulsing = false;
  
    setInterval(function() {
      var radius = marker.getRadius();
      if (radius > originalRadius * 1.3) {
        pulsing = false;
      } else if (radius < originalRadius * 0.7) {
        pulsing = true;
      }
      var nextRadius = pulsing ? radius * 1.1 : radius * 0.9;
      marker.setRadius(nextRadius);
    }, 200);
  }
  