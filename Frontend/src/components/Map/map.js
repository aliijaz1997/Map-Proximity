import React, { useRef, useEffect, useState } from "react";
import { getMapStyles } from "./Styles";
import FindingDriverModal from "./FindingDriverModal";

const Map = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [rideInformation, setRideInformation] = useState({
    distance: "",
    duration: "",
    fare: "",
  });
  const [isLightTheme, setIsLightTheme] = useState(
    localStorage.getItem("theme") === "light"
  );
  const [findingDriver, setFindingDriver] = useState(false);

  const mapRef = useRef(null);
  const fromInputRef = useRef(null);
  const toInputRef = useRef(null);

  useEffect(() => {
    const handleThemeChange = () => {
      setIsLightTheme(localStorage.getItem("theme") === "light");
    };

    window.addEventListener("storage", handleThemeChange);

    return () => {
      window.removeEventListener("storage", handleThemeChange);
    };
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error getting current location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);
  useEffect(() => {
    let directionsService;
    let directionsRenderer;

    // Create the map
    const map = new window.google.maps.Map(mapRef.current, {
      center: {
        lat: currentLocation?.lat || 30.3753,
        lng: currentLocation?.lng || 69.3451,
      },
      zoom: 16,
      styles: isLightTheme ? null : getMapStyles(),
    });

    // Create the DirectionsService and DirectionsRenderer objects
    directionsService = new window.google.maps.DirectionsService();
    directionsRenderer = new window.google.maps.DirectionsRenderer({
      map,
    });

    // Create the autocomplete objects for the "from" and "to" inputs
    const fromAutocomplete = new window.google.maps.places.Autocomplete(
      fromInputRef.current,
      {
        types: ["(regions)"],
        componentRestrictions: { country: "pk" },
      }
    );
    const toAutocomplete = new window.google.maps.places.Autocomplete(
      toInputRef.current,
      {
        types: ["(regions)"],
        componentRestrictions: { country: "pk" },
      }
    );

    // Set the origin and destination based on the selected autocomplete values
    const calculateRoute = () => {
      const origin = fromAutocomplete.getPlace();
      const destination = toAutocomplete.getPlace();

      if (origin && destination) {
        // Create the DirectionsRequest object
        const request = {
          origin: { placeId: origin.place_id },
          destination: { placeId: destination.place_id },
          travelMode: window.google.maps.TravelMode.DRIVING,
        };

        // Get the route and display it on the map
        directionsService.route(request, (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(result);
          }
        });

        // Calculate the distance between the origin and destination
        const distanceService = new window.google.maps.DistanceMatrixService();
        distanceService.getDistanceMatrix(
          {
            origins: [origin.formatted_address],
            destinations: [destination.formatted_address],
            travelMode: window.google.maps.TravelMode.DRIVING,
          },
          (response, status) => {
            if (
              status === window.google.maps.DistanceMatrixStatus.OK &&
              response.rows.length > 0 &&
              response.rows[0].elements.length > 0
            ) {
              const distance = response.rows[0].elements[0].distance.text;
              const duration = response.rows[0].elements[0].duration.text;
              setRideInformation({
                distance,
                duration,
                fare: parseInt(distance) * 20 + 100,
              });
            }
          }
        );
      }
    };

    // Add event listeners to trigger route calculation when autocomplete values change
    fromAutocomplete.addListener("place_changed", calculateRoute);
    toAutocomplete.addListener("place_changed", calculateRoute);
  }, [isLightTheme, currentLocation, toInputRef.current, fromInputRef.current]);

  return (
    <div>
      <div className="flex">
        <input
          placeholder="Select you current location"
          className="input  input-bordered w-full m-3 "
          ref={fromInputRef}
          type="text"
        />

        <input
          placeholder="Select your destination"
          className="input  input-bordered w-full m-3"
          ref={toInputRef}
          type="text"
        />
      </div>
      <div className="flex">
        <input
          placeholder="Total Distance"
          className="input  input-bordered w-full m-3 "
          readOnly
          value={rideInformation.distance}
          type="text"
        />

        <input
          placeholder="Total Time"
          className="input  input-bordered w-full m-3"
          readOnly
          value={rideInformation.duration}
          type="text"
        />
        <input
          placeholder="Total Fare"
          className="input  input-bordered w-full m-3"
          readOnly
          value={rideInformation.fare ? `${rideInformation.fare} rupees` : ""}
          type="text"
        />
      </div>
      <button
        className="btn btn-primary w-52 m-3"
        onClick={() => setFindingDriver(true)}
        disabled={
          !rideInformation.distance &&
          !rideInformation.duration &&
          !rideInformation.fare
        }
      >
        {" "}
        Find a driver
      </button>

      <div ref={mapRef} style={{ width: "100%", height: 450 }}></div>

      <FindingDriverModal
        showModal={findingDriver}
        onClose={() => setFindingDriver(false)}
      />
    </div>
  );
};

export default Map;
