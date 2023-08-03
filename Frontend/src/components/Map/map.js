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
import {
  destinationIconUrl,
  personIconUrl,
  pinLocationIconUrl,
} from "../../utils/icons";

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
          fromInputRef.current.value = address.formatted_address;
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
    if (mapRef.current) {
      let directionsService;
      let directionsRenderer;

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

      directionsService = new window.google.maps.DirectionsService();
      directionsRenderer = new window.google.maps.DirectionsRenderer({
        map,
        suppressMarkers: true,
      });

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

      fromAutocomplete.addListener("place_changed", calculateRoute);
      toAutocomplete.addListener("place_changed", calculateRoute);
    }
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
