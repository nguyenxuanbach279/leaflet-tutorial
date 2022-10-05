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

var overlayMaps = {
  Tiger: tiger,
};

var map = L.map("map", {
  center: [22.7356, 79.8925],
  zoom: 5,
  layers: [osmMap, tiger],
});

var mapLayers = L.control.layers(baseMaps, overlayMaps).addTo(map);

var ctlMeasure = L.control
  .polylineMeasure({
    position: "topleft",
    measureControlTitle: "Measure Length",
  })
  .addTo(map);
var stringFilter = new RegExp("ra", "g");

$.getJSON("./resources/data/india_district.geojson", function (data) {
  L.geoJSON(data, {
    style: function (feature) {
      return { color: "black", fillColor: "red" };
    },
    filter: function (feature, latlng) {
      if (feature.properties.NAME_2.match(stringFilter)) {
        return true;
      }
    },
  })
    .bindPopup(function (layer) {
      return "<h3>District name</h3>" + layer.feature.properties.NAME_2;
    })
    .addTo(map);
});
