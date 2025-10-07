import { divIcon, Icon, point } from "leaflet";
import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvent, Polygon, GeoJSON } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

const customIcon = new Icon({
  iconUrl: "/pin.png",
  iconSize: [38, 32]
});

function NewCoord({ addMarker }) {
  useMapEvent("click", (e) => {
    const { lat, lng } = e.latlng;
    addMarker(lat, lng);
  });

  return null;
}

const polygons = [
  {
    name: "Campus Park",
    color: "green",
    coordinates: [
      [43.010, -81.273],
      [43.010, -81.270],
      [43.008, -81.270],
      [43.008, -81.273],
      [43.010, -81.273], // close the polygon
    ],
  },
  {
    name: "Science Plaza",
    color: "orange",
    coordinates: [
      [43.009, -81.272],
      [43.009, -81.271],
      [43.0085, -81.271],
      [43.0085, -81.272],
      [43.009, -81.272],
    ],
  },
];

  // Sample GeoJSON polygon
  const geojsonData = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { name: "Campus Park 1", color: "green" },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-81.273, 43.010],
              [-81.270, 43.010],
              [-81.270, 43.008],
              [-81.273, 43.008],
              [-81.273, 43.010],
            ],
          ],
        },
      },
      {
        type: "Feature",
        properties: { name: "Science Plaza 1", color: "orange" },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-81.272, 43.009],
              [-81.271, 43.009],
              [-81.271, 43.0085],
              [-81.272, 43.0085],
              [-81.272, 43.009],
            ],
          ],
        },
      },
    ],
  };

const App = () => {
  const [markers, setMarkers] = useState([]);

  const addMarker = (lat, lng) => {
    setMarkers((prev) => [
      ...prev,
      { lat: +lat.toFixed(4), lng: +lng.toFixed(4) } // 4 decimals for ~10m accuracy
    ]);
  };

  const createCustomClusterIcon = (cluster) => {
    return new divIcon({
      html: `<div class="cluster-icon">${cluster.getChildCount()}</div>`,
      className: 'custom-marker-cluster',
      iconSize: point(33, 33, true)
    })
  }

  // GeoJSON styling function
  const styleFeature = (feature) => ({
    color: feature.properties.color,
    weight: 2,
    fillOpacity: 0.4,
  });

  // Event handlers
  const onEachFeature = (feature, layer) => {
    layer.bindPopup(`<b>${feature.properties.name}</b>`);
    layer.on({
      mouseover: (e) => e.target.setStyle({ fillOpacity: 0.7 }),
      mouseout: (e) => e.target.setStyle({ fillOpacity: 0.4 }),
      click: (e) => alert(`You clicked: ${feature.properties.name}`),
    });
  };

  return (
    <div>
      <MapContainer
        center={[43.008774, -81.26104]}
        zoom={15}
        style={{ height: "100vh", width: "100%" }}>
        
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        attribution='Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics'
      />

      <MarkerClusterGroup
        chunkedLoading
        iconCreateFunction={createCustomClusterIcon}>
      { markers.map((marker, i) => (
        <Marker key={i} position={[marker.lat, marker.lng]} icon={customIcon} >
          <Popup>{marker.lat}, {marker.lng}</Popup>
        </Marker>
      ))}
      </MarkerClusterGroup>

      {/* { polygons.map((poly, i) => (
        <Polygon
          key={i}
          positions={poly.coordinates}
          pathOptions={{ color: poly.color, fillOpacity: 0.4 }}
        />
      )) } */}

      <NewCoord addMarker={addMarker} />

      <GeoJSON
        data={geojsonData}
        style={styleFeature}
        onEachFeature={onEachFeature}
      />
      </MapContainer>
    </div>
  )
}

export default App
