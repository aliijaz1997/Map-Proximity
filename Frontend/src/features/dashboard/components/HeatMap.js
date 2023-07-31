import React, { useEffect, useRef } from "react";
import TitleCard from "../../../components/Cards/TitleCard";

export default function HeatMap() {
  const mapRef = useRef(null);
  const heatmapRef = useRef({ customer: null, driver: null });

  useEffect(() => {
    const mapOptions = {
      center: { lat: 30.3753, lng: 69.3451 }, // Set the center to Pakistan's coordinates
      zoom: 10,
    };

    const map = new window.google.maps.Map(mapRef.current, mapOptions);

    // Sample data for customers and drivers (replace these with your actual data)
    const customersData = [
      { lat: 30.3753, lng: 69.3451 },
      { lat: 30.1234, lng: 69.6789 },
      // Add more customer coordinates here
    ];

    const driversData = [
      { lat: 30.123, lng: 69.456 },
      { lat: 30.234, lng: 69.567 },
      // Add more driver coordinates here
    ];

    // Convert data to HeatMap format
    const customersHeatMapData = customersData.map(
      (customer) => new window.google.maps.LatLng(customer.lat, customer.lng)
    );
    const driversHeatMapData = driversData.map(
      (driver) => new window.google.maps.LatLng(driver.lat, driver.lng)
    );

    // Create Heatmap layer for customers
    heatmapRef.current.customer =
      new window.google.maps.visualization.HeatmapLayer({
        data: customersHeatMapData,
        map: map,
        radius: 30,
        gradient: ["rgba(0, 255, 0, 0)", "rgba(0, 255, 0, 1)"], // Green for customers
      });

    // Create Heatmap layer for drivers
    heatmapRef.current.driver =
      new window.google.maps.visualization.HeatmapLayer({
        data: driversHeatMapData,
        map: map,
        radius: 30,
        gradient: ["rgba(255, 255, 0, 0)", "rgba(255, 255, 0, 1)"], // Yellow for drivers
      });
  }, []);

  // Function to update the heatmap data when the component receives new data
  const updateHeatmapData = (customersData, driversData) => {
    const customersHeatMapData = customersData.map(
      (customer) => new window.google.maps.LatLng(customer.lat, customer.lng)
    );
    const driversHeatMapData = driversData.map(
      (driver) => new window.google.maps.LatLng(driver.lat, driver.lng)
    );

    // Set new heatmap data for customers
    heatmapRef.current.customer.setData(customersHeatMapData);

    // Set new heatmap data for drivers
    heatmapRef.current.driver.setData(driversHeatMapData);
  };

  // Sample function to demonstrate updating data (you can replace it with your own data update logic)
  const handleUpdateData = () => {
    const newCustomersData = [
      { lat: 30.3753, lng: 69.3451 },
      { lat: 30.1234, lng: 69.6789 },
      { lat: 30.456, lng: 69.89 },
    ];

    const newDriversData = [
      { lat: 30.123, lng: 69.456 },
      { lat: 30.234, lng: 69.567 },
      { lat: 30.345, lng: 69.678 },
    ];

    updateHeatmapData(newCustomersData, newDriversData);
  };

  return (
    <TitleCard title={"Heat Map For customers and drivers"}>
      <div className="flex flex-col">
        <div ref={mapRef} style={{ width: "100%", height: "100vh" }}></div>
        <button className="btn btn-success mt-2" onClick={handleUpdateData}>
          Update Data
        </button>
      </div>
    </TitleCard>
  );
}
