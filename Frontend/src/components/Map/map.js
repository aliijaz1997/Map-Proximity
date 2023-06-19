import React, { useRef, useEffect } from "react";

const Map = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    // Create the map

    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: 30.3753, lng: 69.3451 },
      zoom: 14,
    });
  }, []);

  return <div ref={mapRef} style={{ width: "100%", height: "100vh" }}></div>;
};

export default Map;
