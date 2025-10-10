const handleFileUpload = (e, onLoad) => {
  const file = e.target.files?.[0];
  if (!file) {
    console.warn("No file selected.");
    return;
  }

  const reader = new FileReader();

  reader.onload = (event) => {
    try {
      const result = event.target?.result;
      const data = JSON.parse(result);

      if (data?.type === "FeatureCollection" || data?.type === "Feature") {
        console.log("Valid GeoJSON loaded:", data);
        onLoad?.(data); // updates state
      } else {
        console.error("Invalid GeoJSON structure:", data);
        alert("The uploaded file does not appear to be valid GeoJSON.");
      }
    } catch (err) {
      alert("Error parsing GeoJSON file.");
      console.error("Parsing error:", err);
    }
  };

  reader.onerror = (err) => {
    console.error("File reading error:", err);
    alert("There was an error reading the file.");
  };

  reader.readAsText(file);
};

export default handleFileUpload;