import * as turf from "@turf/turf";

const findPolygonForPoint = ({ lat, lng }, polygons) => {
    const point = turf.point([lng, lat]);
    const found = polygons.find((poly) => {
        const turfPoly = turf.polygon([
            poly.coords.map((c) => [c[1], c[0]])
        ]);
        return turf.booleanPointInPolygon(point, turfPoly);
    });
    return found ? found.name : "Outside all ridings."
}

export default findPolygonForPoint;