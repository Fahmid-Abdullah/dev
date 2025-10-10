import { MapContainer, Marker, Polygon, Popup, TileLayer, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css"
import { rasterPoints, polygons } from "./sampleData";
import { useEffect, useState } from "react";
import { Icon } from "leaflet";
import countPointsInPolygon from "./queryFunctions/countPointsInPolygon";
import findPolygonForPoint from "./queryFunctions/findPolygonForPoint";
import aggregateStats from "./queryFunctions/aggregateStats";

function App() {
  const [pointCountInPolygons, setPointCountInPolygons] = useState([]);

  useEffect(() => {
    const counts = countPointsInPolygon(rasterPoints, polygons);
    setPointCountInPolygons(counts);
    console.log("Query 1: Points in Polygon Count:", counts);
  }, []);

  const customIcon = new Icon({
    iconUrl: "./pin.png",
    iconSize: [34, 34] 
  })
  return (
    <div>
      <MapContainer
        center={[43.00, -81.28]}
        zoom={15}
        style={{ height: "80vh", width: "100%" }}>
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png">
        </TileLayer>

        {rasterPoints.map((raster) => {
          const polyParentName = findPolygonForPoint({ lat: raster.lat, lng: raster.lng }, polygons )
          return (
          <Marker key={raster.id} position={[raster.lat, raster.lng]} icon={customIcon}>
            <Popup>
              <p>{"Raster Value: " + raster.value}</p>
              <p>{"Parent: " + polyParentName}</p>
            </Popup>
          </Marker>
        )})}

        {pointCountInPolygons.length > 0 &&
          polygons.map((polygon) => {
            const countObj = pointCountInPolygons.find(p => p.name === polygon.name);

            return (
              <Polygon
                key={polygon.id}
                positions={polygon.coords}
                pathOptions={{ color: polygon.color, fillOpacity: 0.4 }}
              >
              <Tooltip permanent direction="center">
                {polygon.name}
              </Tooltip>
                <Popup>
                  <p>{"Property Name: " + countObj.name}</p>
                  <p>{"Point Count:" + countObj.count}</p>
                  <div>
                    <p><strong>Property Names:</strong></p>
                    {countObj.data.length > 0 && countObj.data.map(data => (
                    <p>{"Property Name: " + data.properties.name}</p>
                  ))}
                  </div>
                </Popup>
              </Polygon>
            );
          })
        }

      </MapContainer>

          <button onClick={() => aggregateStats(rasterPoints, pointCountInPolygons)}>Summary</button>
    </div>
  );
}

export default App;
