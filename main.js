var osmMap = L.tileLayer.provider("OpenStreetMap.Mapnik");
var stamenMap = L.tileLayer.provider("Stamen.Terrain");
var imageryMap = L.tileLayer.provider("Esri.WorldImagery");

var baseMaps = {
  OSM: osmMap,
  "Stamen Watorcolor": stamenMap,
  "World Imagery": imageryMap,
};

// var geoServerIPPort = "localhost:8080";
// var geoServerWorkspace = "GIS";
var stateLayerName = "tiger:tiger_roads";

var tiger = L.tileLayer.wms("http://localhost:8080/geoserver/tiger/wms", {
  layers: stateLayerName,
  format: "image/png",
  transparent: true,
  version: "2.21.1",
  tiled: true,
});

var map = L.map("map", {
  center: [22.7356, 79.8925],
  zoom: 5,
  layers: [osmMap, tiger],
});

var ctlMeasure = L.control
  .polylineMeasure({
    position: "topleft",
    measureControlTitle: "Measure Length",
  })
  .addTo(map);
var stringFilter = new RegExp("a", "g");

// var indiaDistrict = $.getJSON("./resources/data/india_district.geojson", function (data) {
//   L.geoJSON(data, {
//     style: function (feature) {
//       return { color: "black" };
//     },
//     filter: function (feature, latlng) {
//       if (feature.properties.NAME_2.match(stringFilter)) {
//         return true;
//       }
//     },
//   })
//     .bindPopup(function (layer) {
//       return "<h3>District name</h3>" + layer.feature.properties.NAME_2;
//     })
// });

var polygon = L.polygon(
  [
    [0, 0],
    [21.028511, 105.804817],
    [51.509865, -0.118092],
  ],
  {
    color: "red",
    weight: 5,
    fillOpacity: 0.1,
  }
);

var myIcon = L.icon({
  iconUrl: "resources/image/icon.jpg",
  iconSize: [32, 32],
});

var pointMarker = L.marker([0, 0], {
  draggable: true,
  icon: myIcon,
});
pointMarker.bindPopup("point marker");

var polyline = L.polyline(
  [
    [0, 0],
    [21.028511, 105.804817],
    [51.509865, -0.118092],
  ],
  {
    color: "blue",
    weight: 2,
    dashArray: [10, 10],
  }
);

var myMarkerLayer = L.layerGroup([pointMarker, polygon, polyline]);

var overlayMaps = {
  Tiger: tiger,
  "My Marker": myMarkerLayer,
};

var mapLayers = L.control.layers(baseMaps, overlayMaps).addTo(map);
