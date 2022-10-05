//select layer
var osmMap = L.tileLayer.provider("OpenStreetMap.Mapnik");
var stamenMap = L.tileLayer.provider("Stamen.Terrain");
var imageryMap = L.tileLayer.provider("Esri.WorldImagery");

var baseMaps = {
  OSM: osmMap,
  "Stamen Watorcolor": stamenMap,
  "World Imagery": imageryMap,
};

// wms
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

// measure length

var ctlMeasure = L.control
  .polylineMeasure({
    position: "topleft",
    measureControlTitle: "Measure Length",
  })
  .addTo(map);

// geojson
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

// polygon polyline marker icon

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

var iconOffice = L.icon({
  iconUrl: "resources/image/office.png",
  iconSize: [35, 35],
});

function showPopup(feature, layer) {
  layer.bindPopup(makePopupcontent(feature), {
    closeButton: false,
    offset: L.point(0, -6),
  });
}

function makePopupcontent(office) {
  return `
    <div>
      <h4>${office.properties.name}</h4>
      <p>${office.properties.address}</p>
      <div class="phone-number">
        <a href="tel:${office.properties.phone}">${office.properties.phone}</a>
      </div>
    </div>
    `;
}

var officeLayer = L.geoJSON(officeList, {
  onEachFeature: showPopup,
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, { icon: iconOffice });
  },
});

officeLayer.addTo(map);

function populateOffice() {
  const ul = document.querySelector(".list");
  officeList.forEach((office) => {
    const li = document.createElement("li");
    const div = document.createElement("div");
    const a = document.createElement("a");
    const p = document.createElement("p");

    a.addEventListener("click", () => {
      flyToStore(office);
    });
    div.classList.add("office-item");
    a.innerText = office.properties.name;
    a.href = "#";
    p.innerText = office.properties.address;

    div.appendChild(a);
    div.appendChild(p);
    li.appendChild(div);
    ul.appendChild(li);
  });
}

populateOffice();

function flyToStore(office) {
  const lat = office.geometry.coordinates[1];
  const lng = office.geometry.coordinates[0];
  map.flyTo([lat, lng], 14, {
    duration: 3,
  });
  setTimeout(() => {
    L.popup({
      closeButton: false,
      offset: L.point(0, -8),
    })
      .setLatLng([lat, lng])
      .setContent(makePopupcontent(office))
      .openOn(map);
  }, 3000);
}
