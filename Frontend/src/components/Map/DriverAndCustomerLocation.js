import React, { useEffect, useState } from "react";

function DriverCustomerLocation() {
  const [map, setMap] = useState(null);
  const [driverMarker, setDriverMarker] = useState(null);
  const [customerMarker, setCustomerMarker] = useState(null);

  useEffect(() => {
    // Initialize the map
    const mapOptions = {
      center: { lat: initialLat, lng: initialLng },
      zoom: 14,
    };

    const map = new window.google.maps.Map(
      document.getElementById("map-container"),
      mapOptions
    );

    setMap(map);

    // Create marker objects for the driver and customer
    const driverMarker = new window.google.maps.Marker({
      position: { lat: initialDriverLat, lng: initialDriverLng },
      map,
      label: "Driver",
    });

    const customerMarker = new window.google.maps.Marker({
      position: { lat: initialCustomerLat, lng: initialCustomerLng },
      map,
      label: "Customer",
    });

    setDriverMarker(driverMarker);
    setCustomerMarker(customerMarker);

    // Clean up on component unmount
    return () => {
      driverMarker.setMap(null);
      customerMarker.setMap(null);
    };
  }, []);

  useEffect(() => {
    // Update the driver and customer locations every 15 seconds
    const locationArray = [
      { lat: 30.362, lng: 71.509 },
      // Add more latitudes and longitudes to cover the route between Wapdatown Multan and Buch Villas Multan
      // ...
      { lat: 30.4, lng: 71.6 },
    ];

    const timer = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * locationArray.length);
      const randomLocation = locationArray[randomIndex];

      driverMarker.setPosition(randomLocation);
      customerMarker.setPosition(randomLocation);
    }, 15000);

    // Clean up on component unmount
    return () => {
      clearInterval(timer);
    };
  }, [driverMarker, customerMarker]);

  return <div id="map-container" style={{ height: "400px" }}></div>;
}

export default DriverCustomerLocation;
