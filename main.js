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

var tiger = L.tileLayer.wms(
    "http://localhost:8080/geoserver/tiger/wms",
    {
        layers: stateLayerName,
        format: "image/png",
        transparent: true,
        version: "2.21.1",
        tiled: true,
    }
) 

var overlayMaps = {
    "Tiger" : tiger,
}

var map = L.map("map", {
  center: [22.7356, 79.8925],
  zoom: 5,
//   layers:[osmMap]
  layers:[osmMap, tiger]
});

var mapLayers = L.control.layers(baseMaps, overlayMaps).addTo(map);

var ctlMeasure = L.control.polylineMeasure({
    position: "topleft",
    measureControlTitle: "Measure Length"
}).addTo(map)
