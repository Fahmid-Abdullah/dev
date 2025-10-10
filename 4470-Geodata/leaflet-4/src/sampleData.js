// --- Fake Raster Points (pretend pixel centers) ---
export const rasterPoints = Array.from({ length: 10 }, (_, i) => ({
  id: `r${i + 1}`,
  lat: 43.00 + Math.random() * 0.05,   // roughly 43.00–43.05
  lng: -81.28 + Math.random() * 0.05,  // roughly -81.28–-81.23
  value: Math.floor(Math.random() * 100), // pretend intensity or NDVI value
}));

// --- Fake Polygons (pretend ridings or regions) ---
export const polygons = [
  {
    id: "poly1",
    name: "Riding North",
    color: "rgba(255,0,0,0.3)",
    coords: [
      [43.02, -81.27],
      [43.04, -81.27],
      [43.04, -81.24],
      [43.02, -81.24],
      [43.02, -81.27], // closed by repeating first point
    ],
  },
  {
    id: "poly2",
    name: "Riding South",
    color: "rgba(0,255,0,0.3)",
    coords: [
      [43.00, -81.27],
      [43.02, -81.27],
      [43.02, -81.24],
      [43.00, -81.24],
      [43.00, -81.27], // closed
    ],
  },
  {
    id: "poly3",
    name: "Riding West",
    color: "rgba(0,0,255,0.3)",
    coords: [
      [43.00, -81.28],
      [43.04, -81.28],
      [43.04, -81.27],
      [43.00, -81.27],
      [43.00, -81.28], // closed
    ],
  },
];
