import React, { useRef, useEffect, useState } from "react";
import { getMapStyles } from "./Styles";
import socket from "../../utils/socket";
import {
  useGetLocationQuery,
  useGetUserByIdQuery,
} from "../../app/service/api";
import { useDispatch, useSelector } from "react-redux";
import { MODAL_BODY_TYPES } from "../../utils/globalConstantUtil";
import { closeModal, openModal } from "../../features/common/modalSlice";
import DriverCustomerLocation from "./DriverAndCustomerLocation";
import TitleCard from "../Cards/TitleCard";
import { getLocation } from "../../utils/map/getLocation";

const destinationIcon = `  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="green"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
    class="w-6 h-6"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5"
    />
  </svg>`;

const personIcon = `<svg fill="#4757ed" height="800px" width="800px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
viewBox="0 0 188.111 188.111" xml:space="preserve">
<g>
<path d="M94.052,0C42.19,0.001,0,42.194,0.001,94.055c0,51.862,42.191,94.056,94.051,94.057
 c51.864-0.001,94.059-42.194,94.059-94.056C188.11,42.193,145.916,0,94.052,0z M94.052,173.111
 c-43.589-0.001-79.051-35.465-79.051-79.057C15,50.464,50.462,15.001,94.052,15c43.593,0,79.059,35.464,79.059,79.056
 C173.11,137.646,137.645,173.11,94.052,173.111z"/>
<path d="M94.053,50.851c-23.821,0.002-43.202,19.384-43.202,43.204c0,23.824,19.381,43.206,43.203,43.206
 c23.823,0,43.205-19.382,43.205-43.205C137.259,70.232,117.877,50.851,94.053,50.851z M94.054,122.261
 c-15.551,0-28.203-12.653-28.203-28.206c0-15.55,12.652-28.203,28.203-28.204c15.553,0,28.205,12.653,28.205,28.205
 C122.259,109.608,109.606,122.261,94.054,122.261z"/>
<circle cx="94.055" cy="94.056" r="16.229"/>
</g>
</svg>
`;

const pinLocationIcon = `<svg width="800px" fill="#4080bf" height="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
<g>
    <path fill="none" d="M0 0h24v24H0z"/>
    <path d="M11 19.945A9.001 9.001 0 0 1 12 2a9 9 0 0 1 1 17.945V24h-2v-4.055z"/>
</g>
</svg>`;

// Create marker icons for driver and customer
const destinationIconUrl = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
  destinationIcon
)}`;
const personIconUrl = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
  personIcon
)}`;
const pinLocationIconUrl = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
  pinLocationIcon
)}`;
const Map = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentAddress, setCurrentAddress] = useState(null);
  const [rideInformation, setRideInformation] = useState({
    distance: "",
    duration: "",
    fare: "",
  });
  const [isLightTheme, setIsLightTheme] = useState(
    localStorage.getItem("theme") === "light"
  );
  const [driversLocation, setDriversLocation] = useState(null);
  const [isLocationRestricted, setIsLocationRestricted] = useState(false);

  const { user: reduxUser } = useSelector((state) => state.auth);
  const { data: user, isLoading } = useGetUserByIdQuery({
    id: reduxUser?.uid,
  });
  const { data: polygons, isLoading: isLocationLoading } =
    useGetLocationQuery();

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

  useEffect(async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
          const address = await getLocation({ latitude, longitude });
          setCurrentAddress(address);
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

    if (mapRef.current) {
      var map = new window.google.maps.Map(mapRef.current, {
        center: {
          lat: currentAddress?.geometry.location.lat(),
          lng: currentAddress?.geometry.location.lng(),
        },
        zoom: 18,
        styles: isLightTheme ? null : getMapStyles(),
        disableDefaultUI: true,
        zoomControl: false,
        mapTypeControlOptions: {
          mapTypeIds: ["roadmap", "styled_map"],
        },
      });
    }

    directionsService = new window.google.maps.DirectionsService();
    directionsRenderer = new window.google.maps.DirectionsRenderer({
      map,
      suppressMarkers: true,
    });

    if (currentAddress) {
      fromInputRef.current.value = currentAddress.formatted_address;
    }

    let customerMarker = new window.google.maps.Marker({
      position: {
        lat: currentAddress?.geometry.location.lat(),
        lng: currentAddress?.geometry.location.lng(),
      },
      map: map,
      icon: {
        url: pinLocationIconUrl,
        scaledSize: new window.google.maps.Size(50, 50),
      },
      draggable: true,
    });

    customerMarker.addListener("dragend", async () => {
      const newLocation = customerMarker.getPosition();
      const address = await getLocation({
        latitude: newLocation.lat(),
        longitude: newLocation.lng(),
      });
      setCurrentAddress(address);
    });

    new window.google.maps.Marker({
      position: currentLocation,
      map: map,
      icon: {
        url: personIconUrl,
        scaledSize: new window.google.maps.Size(40, 40),
      },
    });

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
      customerMarker.setVisible(false);
      let isAreaRestricted = [];
      if (
        origin &&
        destination &&
        currentAddress &&
        currentLocation &&
        mapRef.current
      ) {
        if (polygons && polygons.length > 0) {
          polygons.forEach((polygon) => {
            const Polygon = new window.google.maps.Polygon({
              paths: polygon.path,
              visible: false,
            });

            Polygon.setMap(map);
            const originLocation = origin.geometry.location;
            const destinationLocation = destination.geometry.location;

            const isOriginRestricted =
              !window.google.maps.geometry.poly.containsLocation(
                originLocation,
                Polygon
              );
            const isDestinationRestricted =
              !window.google.maps.geometry.poly.containsLocation(
                destinationLocation,
                Polygon
              );
            isAreaRestricted.push(
              isOriginRestricted || isDestinationRestricted
            );
          });
        }
        console.log(isAreaRestricted);
        if (!isAreaRestricted.includes(false)) {
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

          // Create the destination marker with the SVG icon
          new window.google.maps.Marker({
            position: destination.geometry.location,
            map: map,
            icon: {
              url: destinationIconUrl,
              scaledSize: new window.google.maps.Size(40, 40),
            },
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
                  destinationAddress: destination.formatted_address,
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
        dispatch(closeModal());
        setDriversLocation(driver.location);
      });
    }
  }, [socket]);

  if (isLoading && !user) {
    document.body.classList.add("loading-indicator");
  }
  if (!isLoading && user) {
    document.body.classList.remove("loading-indicator");
  }
  if (isLocationLoading && !polygons) {
    document.body.classList.add("loading-indicator");
  }
  if (!isLocationLoading && polygons) {
    document.body.classList.remove("loading-indicator");
  }
  return !driversLocation ? (
    <div>
      <div>
        <div className="flex justify-around">
          <div className="input-container">
            <label htmlFor="fromInput">From: </label>
            <input
              id="fromInput"
              placeholder="Select your current location"
              className="input input-bordered"
              ref={fromInputRef}
              type="text"
            />
          </div>

          <div className="input-container">
            <label htmlFor="toInput">To: </label>
            <input
              id="toInput"
              placeholder="Select your destination"
              className="input input-bordered"
              ref={toInputRef}
              type="text"
            />
          </div>
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
      <TitleCard title={"Map"}>
        <div
          ref={mapRef}
          style={{
            width: "100%",
            marginTop: "4px",
            height: 450,
          }}
        ></div>
      </TitleCard>
    </div>
  ) : driversLocation.lat && driversLocation.lng ? (
    <DriverCustomerLocation
      locations={{
        initialDriverLat: driversLocation.lat,
        initialDriverLng: driversLocation.lng,
        initialCustomerLat: currentLocation.lat,
        initialCustomerLng: currentLocation.lng,
      }}
      currentLocation={currentLocation}
      socket={socket}
    />
  ) : (
    <p>Loading driver location...</p>
  );
};

export default Map;
