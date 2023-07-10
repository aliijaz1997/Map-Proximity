import React, { useRef, useEffect, useState } from "react";
import { getMapStyles } from "./Styles";
import FindingDriverModal from "./FindingDriverModal";
import socket from "../../utils/socket";
import { useGetUserByIdQuery } from "../../app/service/api";
import { useSelector } from "react-redux";
import NoRideFoundModal from "./NoRideFoundModal";
import PreStartRideCustomerModal from "./PreStartRideCustomerModal";

const Map = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentAddress, setCurrentAddress] = useState("");
  const [rideInformation, setRideInformation] = useState({
    distance: "",
    duration: "",
    fare: "",
  });
  const [driver, setDriver] = useState(null);
  const [showPreStartModal, setShowPreStartModal] = useState(null);
  const [isLightTheme, setIsLightTheme] = useState(
    localStorage.getItem("theme") === "light"
  );
  const [findingDriver, setFindingDriver] = useState(false);
  const [noRideFoundModal, setNoRideFoundModal] = useState(false);
  const [message, setMessage] = useState("");

  const { user: reduxUser } = useSelector((state) => state.auth);
  const { data: user, isLoading } = useGetUserByIdQuery({
    id: reduxUser?.uid,
  });

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
        async (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });

          const geocoder = new window.google.maps.Geocoder();
          const location = new window.google.maps.LatLng(latitude, longitude);

          geocoder.geocode({ location }, (results, status) => {
            if (status === window.google.maps.GeocoderStatus.OK && results[0]) {
              setCurrentAddress(results[0]);
            }
          });
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

    var map = new window.google.maps.Map(mapRef.current, {
      center: {
        lat: currentLocation?.lat || 30.3753,
        lng: currentLocation?.lng || 69.3451,
      },
      zoom: 18,
      styles: isLightTheme ? null : getMapStyles(),
    });
    // Create the DirectionsService and DirectionsRenderer objects
    directionsService = new window.google.maps.DirectionsService();
    directionsRenderer = new window.google.maps.DirectionsRenderer({
      map,
    });

    // Create the autocomplete objects for the "from" and "to" inputs
    if (currentAddress) {
      fromInputRef.current.value = currentAddress.formatted_address;
    }

    const fromAutocomplete = new window.google.maps.places.Autocomplete(
      fromInputRef.current,
      {
        types: ["geocode"],
        componentRestrictions: { country: "pk" },
      }
    );

    const toAutocomplete = new window.google.maps.places.Autocomplete(
      toInputRef.current,
      {
        types: ["geocode"],
        componentRestrictions: { country: "pk" },
      }
    );

    // Set the origin and destination based on the selected autocomplete values
    const calculateRoute = () => {
      const origin = fromAutocomplete.getPlace()
        ? fromAutocomplete.getPlace()
        : currentAddress;
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
  }, [isLightTheme, currentLocation, currentAddress, mapRef.current]);

  useEffect(() => {
    if (socket) {
      socket.on("no-ride-found", ({ message }) => {
        setFindingDriver(false);
        setMessage(message);
        setNoRideFoundModal(true);
      });
      socket.on("driver-assign", ({ customer, driver }) => {
        setFindingDriver(false);
        setShowPreStartModal(true);
        setDriver(driver);
      });
    }
  }, [socket]);

  if (isLoading && !user) {
    document.body.classList.add("loading-indicator");
  }
  if (!isLoading && user) {
    document.body.classList.remove("loading-indicator");
  }

  return (
    <div>
      <div className="flex">
        <input
          placeholder="Select your current location"
          className="input input-bordered w-full m-3"
          ref={fromInputRef}
          type="text"
        />

        <input
          placeholder="Select your destination"
          className="input input-bordered w-full m-3"
          ref={toInputRef}
          type="text"
        />
      </div>{" "}
      {toInputRef.current?.value && fromInputRef.current?.value && (
        <>
          {" "}
          <div className="flex">
            <input
              placeholder="Total Distance"
              className="input input-bordered w-full m-3"
              readOnly
              value={rideInformation.distance}
              type="text"
            />

            <input
              placeholder="Total Time"
              className="input input-bordered w-full m-3"
              readOnly
              value={rideInformation.duration}
              type="text"
            />
            <input
              placeholder="Total Fare"
              className="input input-bordered w-full m-3"
              readOnly
              value={
                rideInformation.fare ? `${rideInformation.fare} rupees` : ""
              }
              type="text"
            />
          </div>
          <button
            className="btn btn-primary w-52 m-3"
            onClick={() => {
              setFindingDriver(true);
              socket.emit("customer-ride-request", {
                rideInformation,
                currentLocation,
                currentAddress: fromInputRef.current.value,
                user,
              });
            }}
            disabled={
              !rideInformation.distance &&
              !rideInformation.duration &&
              !rideInformation.fare
            }
          >
            Find a driver
          </button>{" "}
        </>
      )}
      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: 450,
          display:
            toInputRef.current?.value && fromInputRef.current?.value
              ? ""
              : "none",
        }}
      ></div>
      <FindingDriverModal
        showModal={findingDriver}
        onClose={() => setFindingDriver(false)}
      />
      <NoRideFoundModal
        showModal={noRideFoundModal}
        message={message}
        onClose={() => setNoRideFoundModal(false)}
      />
      {showPreStartModal && (
        <PreStartRideCustomerModal driverName={driver.firstName} />
      )}
    </div>
  );
};

export default Map;
