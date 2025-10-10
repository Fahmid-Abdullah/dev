import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import L, { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import handleFileUpload from "./lib/handleFileUpload";
import { useEffect, useState } from "react";

function FitBoundsOnData({ geoJSON }) {
  const map = useMap();

  useEffect(() => {
    if (geoJSON) {
      try {
        console.log("Moving to acceptable coordinates.")
        const layer = L.geoJSON(geoJSON);
        map.fitBounds(layer.getBounds(), { padding: [30, 30] });
      } catch (err) {
        console.error("Could not fit bounds:", err);
      }
    }
  }, [geoJSON, map]);

  return null;
}

function App() {
  const [geoJSON, setGeoJSON] = useState();

  const customIcon = new Icon({
    iconUrl: "/pin.png",
    iconSize: [34, 43]
  })

  const styleGeoJSON = (feature) => ({
    color: feature?.properties?.color || "blue",
    weight: 2,
    fillOpacity: 0.5,
  });

  const onEachFeature = (feature, layer) => {
    const featureName = feature?.properties?.name || feature?.properties?.project_name || feature?.properties?.ASSET_NAME || "Unnamed Feature";
    layer.bindPopup(`<b>${featureName}</b>`);
    layer.on("click", () => console.log("Clicked:", feature));
  };

  const pointToLayer = (_feature, latlng) => {
    return L.marker(latlng, { icon: customIcon });
  }

  return (
    <div>
      <MapContainer
        center={[43.008774, -81.26104]}
        zoom={15}
        style={{ width: "100%", height: "80vh" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {geoJSON && (
          <>
            <GeoJSON
              key={JSON.stringify(geoJSON)}
              data={geoJSON}
              style={styleGeoJSON}
              onEachFeature={onEachFeature}
              pointToLayer={pointToLayer}
            />
            <FitBoundsOnData geoJSON={geoJSON} />
          </>
        )}
      </MapContainer>

      <input
        type="file"
        accept=".geojson,application/geo+json"
        onChange={(e) => handleFileUpload(e, setGeoJSON)}
        className="p-2 border rounded-md m-2"
      />
    </div>
  );
}

export default App;
