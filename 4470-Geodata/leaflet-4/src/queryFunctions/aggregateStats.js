const aggregateStats = (points, pointCountInPolygons) => {
  const total = points.length;
  const summary = pointCountInPolygons.map((r) => ({
    ...r,
    percent: ((r.count / total) * 100).toFixed(1) + "%",
  }));
  console.log("Aggregate stats:", summary);
  alert(
    summary
      .map((s) => `${s.name}: ${s.count} points (${s.percent})`)
      .join("\n")
  );
};

export default aggregateStats;