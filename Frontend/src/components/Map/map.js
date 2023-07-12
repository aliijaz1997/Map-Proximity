import React, { useRef, useEffect, useState } from "react";
import { getMapStyles } from "./Styles";
import socket from "../../utils/socket";
import { useGetUserByIdQuery } from "../../app/service/api";
import { useDispatch, useSelector } from "react-redux";
import { MODAL_BODY_TYPES } from "../../utils/globalConstantUtil";
import { openModal } from "../../features/common/modalSlice";

const Map = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentAddress, setCurrentAddress] = useState("");
  const [rideInformation, setRideInformation] = useState({
    distance: "",
    duration: "",
    fare: "",
  });
  const [isLightTheme, setIsLightTheme] = useState(
    localStorage.getItem("theme") === "light"
  );
  const [isLocationRestricted, setIsLocationRestricted] = useState(false);

  const { user: reduxUser } = useSelector((state) => state.auth);
  const { data: user, isLoading } = useGetUserByIdQuery({
    id: reduxUser?.uid,
  });
  const dispatch = useDispatch();

  const mapRef = useRef(null);
  const fromInputRef = useRef(null);
  const toInputRef = useRef(null);

  const openFindingRideModal = () => {
    dispatch(
      openModal({
        title: "Finding your ride, Please wait!",
        bodyType: MODAL_BODY_TYPES.FINDING_CUSTOMER_MODAL,
      })
    );
  };
  const openNoFoundRideModal = (message) => {
    dispatch(
      openModal({
        title: "Ride Not Found",
        bodyType: MODAL_BODY_TYPES.NO_RIDE_FOUND_MODAL,
        extraObject: {
          message,
        },
      })
    );
  };

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
    const multanCityCoordinates = [
      { lat: 30.318, lng: 71.345 },
      { lat: 30.318, lng: 71.634 },
      { lat: 29.932, lng: 71.634 },
      { lat: 29.932, lng: 71.345 },
      { lat: 30.003, lng: 71.345 },
      { lat: 30.003, lng: 71.388 },
      { lat: 30.033, lng: 71.388 },
      { lat: 30.033, lng: 71.425 },
      { lat: 30.04, lng: 71.425 },
      { lat: 30.04, lng: 71.46 },
      { lat: 30.08, lng: 71.46 },
      { lat: 30.08, lng: 71.505 },
      { lat: 30.11, lng: 71.505 },
      { lat: 30.11, lng: 71.528 },
      { lat: 30.15, lng: 71.528 },
    ];

    var map = new window.google.maps.Map(mapRef.current, {
      center: {
        lat: currentLocation?.lat || 30.3753,
        lng: currentLocation?.lng || 69.3451,
      },
      zoom: 18,
      styles: isLightTheme ? null : getMapStyles(),
      disableDefaultUI: true,
      zoomControl: false,
    });

    const multanCityPolygon = new window.google.maps.Polygon({
      paths: multanCityCoordinates,
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35,
    });

    multanCityPolygon.setMap(map);

    directionsService = new window.google.maps.DirectionsService();
    directionsRenderer = new window.google.maps.DirectionsRenderer({
      map,
    });

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
        const originLocation = origin.geometry.location;
        const isOriginRestricted =
          !window.google.maps.geometry.poly.containsLocation(
            originLocation,
            multanCityPolygon
          );
        const destinationLocation = destination.geometry.location;
        const isDestinationRestricted =
          !window.google.maps.geometry.poly.containsLocation(
            destinationLocation,
            multanCityPolygon
          );

        if (isOriginRestricted || isDestinationRestricted) {
          setIsLocationRestricted(true);
        } else {
          setIsLocationRestricted(false);
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
          const distanceService =
            new window.google.maps.DistanceMatrixService();
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
      }
    };

    // Add event listeners to trigger route calculation when autocomplete values change
    fromAutocomplete.addListener("place_changed", calculateRoute);
    toAutocomplete.addListener("place_changed", calculateRoute);
  }, [isLightTheme, currentLocation, currentAddress, mapRef.current]);

  useEffect(() => {
    if (socket) {
      socket.on("no-ride-found", ({ message }) => {
        openNoFoundRideModal(message);
      });
      socket.on("driver-assign", ({ customer, driver }) => {
        console.log(customer, driver);
        // customer and driver object has location lat lng
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
        </div>
        {isLocationRestricted && (
          <div className="alert alert-error">
            The selected location is outside the restricted area.
          </div>
        )}
      </div>{" "}
      {toInputRef.current?.value &&
        fromInputRef.current?.value &&
        !isLocationRestricted && (
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
                openFindingRideModal();
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
            toInputRef.current?.value &&
            fromInputRef.current?.value &&
            !isLocationRestricted
              ? ""
              : "none",
        }}
      ></div>
    </div>
  );
};

export default Map;
