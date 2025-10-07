import { divIcon, Icon, point } from "leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

function App() {
  const customIcon = new Icon({
    iconUrl: "/pin.png",
    iconSize: [38, 38],
  });

  const markers = [
    {
      geocode: [43.00981140136719, -81.27059936523438],
      popUp: "Middlesex College",
    },
    {
      geocode: [43.01051712036133, -81.2728500366211],
      popUp: "Natural Science Center",
    },
    {
      geocode: [42.99248504638672, -81.25162506103516],
      popUp: "Ceeps",
    },
  ];

  const createCustomClusterIcon = (cluster) => {
    return new divIcon({
      html: `<div class="cluster-icon">${cluster.getChildCount()}</div>`,
      className: "customer-marker-cluster",
      iconSize: point(33,33, true)
    });
  };

  return (
    <MapContainer
      center={[43.008774, -81.26104]}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MarkerClusterGroup
        chunkedLoading
        iconCreateFunction={createCustomClusterIcon}>
        {markers.map((marker, i) => (
          <Marker key={i} position={marker.geocode} icon={customIcon}>
            <Popup>{marker.popUp}</Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
}

export default App;
