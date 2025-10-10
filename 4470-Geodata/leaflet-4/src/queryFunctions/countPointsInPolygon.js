import * as turf from "@turf/turf";

const countPointsInPolygon = (points, polygons) => {
    const turfPoints = turf.featureCollection(
        points.map((p) => turf.point([p.lng, p.lat], { id: p.id, name: p.value }))
    );

    const counts = polygons.map((poly) => {
        const turfPoly = turf.polygon([
            poly.coords.map((c) => [c[1], c[0]]),
        ]);

        const ptsInside = turf.pointsWithinPolygon(turfPoints, turfPoly);

        return {
            name: poly.name,
            count: ptsInside.features.length,
            data: ptsInside.features,
        };
    });

    return counts;
}

export default countPointsInPolygon;
