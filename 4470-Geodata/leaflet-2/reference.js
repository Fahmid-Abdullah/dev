import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  GeoJSON,
  Polygon,
  useMapEvent,
} from "react-leaflet";
import { Icon, divIcon, point } from "leaflet";
import "leaflet/dist/leaflet.css";
import MarkerClusterGroup from "react-leaflet-cluster";
import "./App.css";

// Custom marker icon
const customIcon = new Icon({
  iconUrl: "/pin.png",
  iconSize: [38, 38],
});

// Click handler to add markers dynamically
function AddMarkerOnClick({ addMarker }) {
  useMapEvent("click", (e) => {
    const { lat, lng } = e.latlng;
    addMarker([+lat.toFixed(5), +lng.toFixed(5)]);
  });
  return null;
}

export default function App() {
  // Stage 1: Markers
  const [markers, setMarkers] = useState([
    { coords: [43.009811, -81.270599], popup: "Middlesex College" },
    { coords: [43.010517, -81.27285], popup: "Natural Science Center" },
    { coords: [42.992485, -81.251625], popup: "Ceeps" },
  ]);

  const addMarker = (coords) => {
    setMarkers([...markers, { coords, popup: "New Marker" }]);
  };

  // Stage 2: Polygons (predefined & dynamic)
  const [polygons, setPolygons] = useState([
    {
      name: "Campus Park",
      color: "green",
      coordinates: [
        [43.010, -81.273],
        [43.010, -81.270],
        [43.008, -81.270],
        [43.008, -81.273],
        [43.010, -81.273],
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
  ]);

  // Optional: add polygon dynamically (example placeholder)
  const addPolygon = (coords, name = "New Polygon", color = "blue") => {
    setPolygons([...polygons, { name, color, coordinates: coords }]);
  };

  // Marker cluster icon
  const createCustomClusterIcon = (cluster) =>
    new divIcon({
      html: `<div class="cluster-icon">${cluster.getChildCount()}</div>`,
      className: "custom-marker-cluster",
      iconSize: point(33, 33, true),
    });

  // GeoJSON example
  const geojsonData = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { name: "Campus Park", color: "green" },
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
        properties: { name: "Science Plaza", color: "orange" },
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

  // GeoJSON styling and interactivity
  const styleFeature = (feature) => ({
    color: feature.properties.color,
    weight: 2,
    fillOpacity: 0.4,
  });

  const onEachFeature = (feature, layer) => {
    layer.bindPopup(`<b>${feature.properties.name}</b>`);
    layer.on({
      mouseover: (e) => e.target.setStyle({ fillOpacity: 0.7 }),
      mouseout: (e) => e.target.setStyle({ fillOpacity: 0.4 }),
      click: (e) => alert(`You clicked: ${feature.properties.name}`),
    });
  };

  return (
    <MapContainer
      center={[43.008774, -81.26104]}
      zoom={15}
      scrollWheelZoom={true}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Stage 1: Marker clustering */}
      <MarkerClusterGroup
        chunkedLoading
        iconCreateFunction={createCustomClusterIcon}
      >
        {markers.map((marker, i) => (
          <Marker key={i} position={marker.coords} icon={customIcon}>
            <Popup>{marker.popup}</Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>

      {/* Stage 2: Predefined polygons */}
      {polygons.map((poly, i) => (
        <Polygon
          key={i}
          positions={poly.coordinates}
          pathOptions={{ color: poly.color, fillOpacity: 0.4 }}
        />
      ))}

      {/* Stage 2: Example GeoJSON polygons */}
      <GeoJSON
        data={geojsonData}
        style={styleFeature}
        onEachFeature={onEachFeature}
      />

      {/* Click-to-add marker */}
      <AddMarkerOnClick addMarker={addMarker} />
    </MapContainer>
  );
}
