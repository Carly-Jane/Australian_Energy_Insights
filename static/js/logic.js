// Create the tile layer that will be the background of our map
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "light-v10",
  accessToken: API_KEY
});

// Initialize all of the LayerGroups we'll be using
var layers = {
  RENEWABLE: new L.LayerGroup(),
  NONRENEWABLE: new L.LayerGroup(),
  // TWENTYSEVENTEEN_RENEWABLE: new L.LayerGroup(),
  // TWENTYSEVENTEEN_NONRENEWABLE: new L.LayerGroup(),
  // TWENTYTWENTY_RENEWABLE: new L.LayerGroup(),
  // TWENTYTWENTY_NONRENEWABLE: new L.LayerGroup()
};

// Create the map with our layers
var map = L.map("map-id", {
  center: [-25.27, 133.77],
  zoom: 12,
  layers: [
    layers.RENEWABLE,
    layers.NONRENEWABLE,
    // layers.TWENTYSEVENTEEN_RENEWABLE,
    // layers.TWENTYSEVENTEEN_NONRENEWABLE,
    // layers.TWENTYTWENTY_RENEWABLE,
    // layers.TWENTYTWENTY_NONRENEWABLE
  ]
});

// Add our 'lightmap' tile layer to the map
lightmap.addTo(map);

// Create an overlays object to add to the layer control
var overlays = {
  "Renewable Power Plants 2014/2015": layers.RENEWABLE,
  "Non-Renewable Power Plants 2014/2015": layers.NONRENEWABLE,
  // "Renewable Power Plants 2017/2018": layers.TWENTYSEVENTEEN_RENEWABLE,
  // "Non-Renewable Power Plants 2017/2018": layers.TWENTYSEVENTEEN_NONRENEWABLE,
  // "Renewable Power Plants 2020/2021": layers.TWENTYTWENTY_RENEWABLE,
  // "Non-Renewable Power Plants 2020/2021": layers.TWENTYTWENTY_NONRENEWABLE,
};

// Create a control for our layers, add our overlay layers to it
L.control.layers(null, overlays).addTo(map);

// Create a legend to display information about our map
var info = L.control({
  position: "bottomright"
});

// When the layer control is added, insert a div with the class of "legend"
info.onAdd = function () {
  var div = L.DomUtil.create("div", "legend");
  return div;
};

// Add the info legend to the map
info.addTo(map);

// TWENTYFOURTEEN_RENEWABLE
//     TWENTYFOURTEEN_NONRENEWABLE
//     TWENTYSEVENTEEN_RENEWABLE
//     TWENTYSEVENTEEN_NONRENEWABLE
//     TWENTYTWENTY_RENEWABLE
//     TWENTYTWENTY_NONRENEWABLE

// Initialize an object containing icons for each layer group
var icons = {
  RENEWABLE: L.ExtraMarkers.icon({
    icon: "ion-settings",
    iconColor: "white",
    markerColor: "green",
    shape: "star"
  }),
  // TWENTYSEVENTEEN_RENEWABLE: L.ExtraMarkers.icon({
  //   icon: "ion-settings",
  //   iconColor: "white",
  //   markerColor: "green",
  //   shape: "star"
  // }),
  // TWENTYTWENTY_RENEWABLE: L.ExtraMarkers.icon({
  //   icon: "ion-settings",
  //   iconColor: "white",
  //   markerColor: "green",
  //   shape: "star"
  // }),
  NONRENEWABLE: L.ExtraMarkers.icon({
    icon: "ion-android-bicycle",
    iconColor: "white",
    markerColor: "red",
    shape: "circle"
  })
  // TWENTYSEVENTEEN_NONRENEWABLE: L.ExtraMarkers.icon({
  //   icon: "ion-android-bicycle",
  //   iconColor: "white",
  //   markerColor: "red",
  //   shape: "circle"
  // }),
  // TWENTYTWENTY_NONRENEWABLE: L.ExtraMarkers.icon({
  //   icon: "ion-android-bicycle",
  //   iconColor: "white",
  //   markerColor: "red",
  //   shape: "circle"
  // }),
};

// Perform an API call to the 2014/2015 endpoint
d3.json("/combined_plant_data").then(function (plant_info) {
      var plantName = plant_info.map((plant => plant.Facility_Name))
      var renewableStatus = plant_info.map((plant => plant.Renewable))
      var primaryFuel = plant_info.map((plant => plant.Primary_Fuel))

      // Create an object to keep of the number of markers in each layer
      var typeCount = {
        RENEWABLE: 0,
        NONRENEWABLE: 0
      };

      // Initialize a stationStatusCode, which will be used as a key to access the appropriate layers, icons, and station count for layer group
      var plantType;

      // Loop through the stations (they're the same size and have partially matching data)
      for (var i = 0; i < plant_info.length; i++) {

        // Create a new station object with properties of both station objects
        // var plant = Object.assign({}, plantName[i], renewableStatus[i], primaryFuel[i]);
        // If a station is listed but not installed, it's coming soon
        if (plant = plant_info.filter(plant => plant.Renewable == 'True')) {
          plantType = "RENEWABLE";
        }
        // If a station has no bikes available, it's empty
        else if (plant = plant_info.filter(plant => plant.Renewable != 'True')) {
          plantType = "NONRENEWABLE";
        }

        // Update the station count
        typeCount[plantType]++;

        var plantLng = Object.assign({}, plant_info[i].Lng, plant_info[i].Lng);
        var plantLat = Object.assign({}, plant_info[i].Lat, plant_info[i].Lat);

        // Create a new marker with the appropriate icon and coordinates
        var newMarker = L.marker([parseFloat(plantLat), parseFloat(plantLng)], {
          icon: icons[plantType]
        });

        // Add the new marker to the appropriate layer
        newMarker.addTo(layers[plantType]);

        // Bind a popup to the marker that will  display on click. This will be rendered as HTML
        newMarker.bindPopup(plantName + "<br> Renewable: " + renewableStatus + "<br>" + " Primary Fuel: " + primaryFuel);
      }

      // Call the updateLegend function, which will... update the legend!
      updateLegend(plantName, primaryFuel);
    });

// Update the legend's innerHTML with the last updated time and station count
function updateLegend(time, stationCount) {
  document.querySelector(".legend").innerHTML = [
    "<p>Updated: " + moment.unix(time).format("h:mm:ss A") + "</p>",
    "<p class='renewable'>Renewable Power Plants: " + typeCount.RENEWABLE + "</p>",
    "<p class='non-renewable'>Non-Renewable Power Plants: " + typeCount.NONRENEWABLE + "</p>"
  ].join("");
}
