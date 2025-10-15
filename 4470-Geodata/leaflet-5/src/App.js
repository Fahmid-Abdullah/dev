import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState, useMemo } from "react";
import L, { Icon } from "leaflet";
import * as turf from "@turf/turf";

/* 🧭 Automatically zoom to uploaded layer */
function JumpToBounds({ geoJSON }) {
  const map = useMap();

  useEffect(() => {
    if (!geoJSON?.features?.length) return;
    try {
      const layer = L.geoJSON(geoJSON);
      map.fitBounds(layer.getBounds(), { padding: [30, 30] });
    } catch (err) {
      console.error("Fit bounds failed:", err);
    }
  }, [geoJSON, map]);

  return null;
}

/* 📂 Handle user GeoJSON uploads (points + polygons) */
function HandleFileUpload(e, setPoints, setPolygons) {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const data = JSON.parse(event.target?.result);

      if (data.type !== "FeatureCollection" && data.type !== "Feature") {
        alert("Unsupported GeoJSON structure.");
        return;
      }

      const features = data.type === "FeatureCollection" ? data.features : [data];
      const points = features.filter((f) => f.geometry?.type?.includes("Point"));
      const polys = features.filter((f) => f.geometry?.type?.includes("Polygon"));

      if (points.length)
        setPoints((prev) => [
          ...prev,
          { type: "FeatureCollection", features: points },
        ]);
      if (polys.length)
        setPolygons((prev) => [
          ...prev,
          { type: "FeatureCollection", features: polys },
        ]);

      if (!points.length && !polys.length) {
        alert("No points or polygons found in this file.");
      }
    } catch (err) {
      console.error("File parse error:", err);
      alert("Invalid GeoJSON file.");
    }
  };
  reader.readAsText(file);
}

export default function App() {
  const [parsedPoints, setParsedPoints] = useState([]);
  const [parsedPolygons, setParsedPolygons] = useState([]);

  /* 🎨 Base style for polygons */
  const styleGeoJSON = (feature) => ({
    color: feature?.properties?.color || "blue",
    weight: 2,
    fillOpacity: feature?.properties?.hasPoints ? 0.5 : 0.2,
  });

  /* 📍 Custom pin for points */
  const customIcon = new Icon({
    iconUrl: "/pin.png",
    iconSize: [14, 14],
  });

  const pointToLayer = (_feature, latlng) =>
    L.marker(latlng, { icon: customIcon });

  /* 🧠 Compute spatial relationships using turf.js */
  // 🧠 Compute relationships between points & polygons using turf.js
// 🧠 Compute relationships between points & polygons using turf.js
const { pointsWithParent, polygonsWithPoints } = useMemo(() => {
  if (!parsedPoints.length || !parsedPolygons.length)
    return { pointsWithParent: [], polygonsWithPoints: [] };

  // ✅ Flatten all points (supports Point & MultiPoint)
  const allPoints = parsedPoints
    .flatMap((p) => p.features || [])
    .flatMap((f, featureIdx) => {
      if (!f.geometry) return [];

      // Handle Point
      if (f.geometry.type === "Point") {
        return [f];
      }

      // Handle MultiPoint → split into separate points
      if (f.geometry.type === "MultiPoint") {
        return f.geometry.coordinates.map((coords, idx) =>
          turf.point(coords, {
            ...f.properties,
            name:
              f.properties?.ASSET_NAME ||
              f.properties?.id ||
              `Point_${featureIdx + 1}_${idx + 1}`,
            _originalIndex: `${featureIdx}-${idx}`,
          })
        );
      }

      return [];
    });

  // ✅ Flatten all polygons
  const allPolygons = parsedPolygons
    .flatMap((p) => p.features || [])
    .filter(
      (f) =>
        f?.geometry?.type?.includes("Polygon") &&
        Array.isArray(f.geometry.coordinates)
    );

  if (!allPoints.length || !allPolygons.length)
    return { pointsWithParent: [], polygonsWithPoints: [] };

  // 🗺️ Map polygons to points inside
  const polyMap = new Map();

  allPolygons.forEach((poly, idx) => {
    try {
      const ptsWithinPolygon = turf.pointsWithinPolygon(
        turf.featureCollection(allPoints),
        poly
      );
      // Deduplicate by coordinate string
      const uniquePoints = Array.from(
        new Map(
          ptsWithinPolygon.features.map((p) => [
            JSON.stringify(p.geometry.coordinates),
            p,
          ])
        ).values()
      );
      polyMap.set(idx, { poly, pointsInside: uniquePoints });
    } catch (err) {
      console.warn("Skipping invalid polygon:", err);
    }
  });

  // 📍 Match each point to its parent polygon
  const pointsWithParent = allPoints.map((pt) => {
    let foundPoly = null;
    try {
      foundPoly = allPolygons.find((poly) =>
        turf.booleanPointInPolygon(pt, poly)
      );
    } catch (err) {
      console.warn("Invalid point:", pt, err);
    }
    return {
      ...pt,
      properties: {
        ...pt.properties,
        parentPolygon:
          foundPoly?.properties?.name ||
          foundPoly?.properties?.project_name ||
          foundPoly?.properties?.ASSET_NAME ||
          "None",
      },
    };
  });

  const polygonsWithPoints = Array.from(polyMap.values());
  console.log(polygonsWithPoints);
  return { pointsWithParent, polygonsWithPoints };
}, [parsedPoints, parsedPolygons]);

  return (
    <div>
      <MapContainer
        center={[43.0096, -81.2737]}
        zoom={14}
        style={{ width: "100%", height: "80vh" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 📍 Render Points */}
        {pointsWithParent.map((pt, i) => (
          <GeoJSON
            key={`pt-${i}`}
            data={pt}
            pointToLayer={pointToLayer}
            onEachFeature={(feature, layer) => {
              const name = feature?.properties?.name || "Point";
              const parent = feature?.properties?.parentPolygon || "None";
              layer.bindPopup(`<b>${name}</b><br/>Inside: ${parent}`);
            }}
          />
        ))}

        {/* 🟦 Render Polygons */}
        {polygonsWithPoints.map(({ poly, pointsInside }, i) => (
          <GeoJSON
            key={`poly-${i}`}
            data={poly}
            style={styleGeoJSON}
            onEachFeature={(feature, layer) => {
              const name =
                feature?.properties?.name ||
                feature?.properties?.ASSET_NAME ||
                feature?.properties?.project_name ||
                `Polygon ${i}`;
              const insideList = pointsInside
                .map((p) => p.properties?.name || "Unnamed point")
                .join(", ");
              const popupContent = `
                <b>${name}</b><br/>
                Points inside: ${pointsInside.length}<br/>
                ${
                  insideList.length
                    ? `<small>${insideList}</small>`
                    : "<small>None</small>"
                }
              `;
              layer.bindPopup(popupContent);
            }}
          />
        ))}

        {/* 🧭 Auto-fit last uploads */}
        {parsedPoints.length >= 1 && (
          <JumpToBounds geoJSON={parsedPoints[parsedPoints.length - 1]} />
        )}
        {parsedPolygons.length >= 1 && (
          <JumpToBounds geoJSON={parsedPolygons[parsedPolygons.length - 1]} />
        )}
      </MapContainer>

      <div style={{ marginTop: "1rem" }}>
        <input
          type="file"
          accept=".geojson,application/geo+json"
          onChange={(e) =>
            HandleFileUpload(e, setParsedPoints, setParsedPolygons)
          }
        />
      </div>
    </div>
  );
}