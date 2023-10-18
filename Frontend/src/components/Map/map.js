import React, { useRef, useEffect, useState } from "react";
import { getMapStyles } from "./Styles";
import {
  useGetLocationQuery,
  useGetUserByIdQuery,
  useTriggerEventsMutation,
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
import { PusherInstance } from "../../utils/pusher/default";
import uuid from "react-uuid";
import {
  changeDriverStatus,
  setActiveDrivers,
} from "../../app/slices/presenceChannelSlice";
import { getNearestDriver } from "../../utils/pusher/getNearestDriver";

const Map = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [rideInformation, setRideInformation] = useState({
    distance: "",
    duration: "",
    fare: "",
  });
  const [mapInstance, setMapInstance] = useState(null);
  const [isLightTheme, setIsLightTheme] = useState(
    localStorage.getItem("theme") === "light"
  );
  const [driversLocation, setDriversLocation] = useState(null);
  const [isLocationRestricted, setIsLocationRestricted] = useState(false);

  const { user: reduxUser } = useSelector((state) => state.auth);
  const { activeDrivers } = useSelector((state) => state.presenceChannel);
  const { data: user, isLoading } = useGetUserByIdQuery({
    id: reduxUser?.uid,
  });
  const { data: polygons, isLoading: isLocationLoading } =
    useGetLocationQuery();
  const [triggerEvent] = useTriggerEventsMutation();

  const dispatch = useDispatch();

  const mapRef = useRef(null);
  const fromInputRef = useRef(null);
  const toInputRef = useRef(null);
  const channelRef = useRef(null);

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
    const fetchCurrentLocation = async () => {
      try {
        if (navigator.geolocation) {
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });

          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });

          const address = await getLocation({ latitude, longitude });
          fromInputRef.current.value = address.formatted_address;
        } else {
          console.error("Geolocation is not supported by this browser.");
        }
      } catch (error) {
        console.error("Error getting current location:", error);
      }
    };

    fetchCurrentLocation();
  }, []);

  useEffect(() => {
    if (currentLocation) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: currentLocation,
        zoom: 18,
        styles: isLightTheme
          ? [
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }],
              },
            ]
          : getMapStyles(),
        disableDefaultUI: true,
        zoomControl: false,
        mapTypeControlOptions: {
          mapTypeIds: ["roadmap", "styled_map"],
        },
      });

      setMapInstance(map);
    }
  }, [currentLocation]);
  useEffect(() => {
    if (mapRef.current && mapInstance) {
      let directionsService;
      let directionsRenderer;
      const map = mapInstance;

      directionsService = new window.google.maps.DirectionsService();
      directionsRenderer = new window.google.maps.DirectionsRenderer({
        map,
        suppressMarkers: true,
      });
      let customerMarker = new window.google.maps.Marker({
        position: currentLocation,
        map: map,
        icon: {
          url: pinLocationIconUrl,
          scaledSize: new window.google.maps.Size(50, 100),
        },
        draggable: true,
      });
      map.setCenter(customerMarker.getPosition());

      customerMarker.addListener("dragend", async () => {
        const newLocation = customerMarker.getPosition();
        const address = await getLocation({
          latitude: newLocation.lat(),
          longitude: newLocation.lng(),
        });
        if (fromInputRef.current) {
          fromInputRef.current.value = address.formatted_address;
        }
        map.setCenter(newLocation);
      });

      new window.google.maps.Marker({
        position: currentLocation,
        map: map,
        icon: {
          url: personIconUrl,
          scaledSize: new window.google.maps.Size(40, 40),
        },
      });

      const destinationMarker = new window.google.maps.Marker({
        map: map,
        icon: {
          url: destinationIconUrl,
          scaledSize: new window.google.maps.Size(40, 40),
        },
      });
      destinationMarker.setVisible(false);

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

      const calculateRoute = async () => {
        const newPinnedLocation = customerMarker.getPosition();
        const pinnedLocationAddress = await getLocation({
          latitude: newPinnedLocation.lat(),
          longitude: newPinnedLocation.lng(),
        });
        const origin = fromAutocomplete.getPlace()
          ? fromAutocomplete.getPlace()
          : pinnedLocationAddress;
        const destination = toAutocomplete.getPlace();

        let isAreaRestricted = [];
        if (origin && destination && mapRef.current) {
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
          if (!isAreaRestricted.includes(false)) {
            setIsLocationRestricted(true);
          } else {
            setIsLocationRestricted(false);
            const request = {
              origin: { placeId: origin.place_id },
              destination: { placeId: destination.place_id },
              travelMode: window.google.maps.TravelMode.DRIVING,
            };

            directionsService.route(request, (result, status) => {
              if (status === window.google.maps.DirectionsStatus.OK) {
                directionsRenderer.setDirections(result);
              }
            });
            destinationMarker.setPosition(destination.geometry.location);
            customerMarker.setPosition(origin.geometry.location);
            destinationMarker.setVisible(true);
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
                    fare: parseInt(distance) * 5,
                    destination: {
                      coordinates: {
                        lat: destination.geometry.location.lat(),
                        lng: destination.geometry.location.lng(),
                      },
                      address: destination.formatted_address,
                    },
                    origin: {
                      coordinates: {
                        lat: origin.geometry.location.lat(),
                        lng: origin.geometry.location.lng(),
                      },
                      address: origin.formatted_address,
                    },
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
  }, [
    isLightTheme,
    currentLocation,
    mapRef.current,
    fromInputRef.current,
    polygons,
  ]);

  useEffect(() => {
    if (!user) return;
    const customerChannel = PusherInstance({
      user_id: user._id,
    }).subscribe("presence-ride");

    channelRef.current = customerChannel;
    customerChannel.bind("pusher:subscription_succeeded", (data) => {
      const memberList = Object.entries(data.members)
        .filter(([_key, value]) => value.role === "driver")
        .map(([key, value]) => ({ id: key, info: value }));
      dispatch(setActiveDrivers(memberList));
    });

    customerChannel.bind("pusher:subscription_error", (status) => {
      console.error("Pusher subscription error:", status);
    });
    customerChannel.bind("pusher:member_added", (member) => {
      if (member.info.role !== "driver") return;
      const existingMemberIndex = activeDrivers.findIndex(
        (existingMember) => existingMember.id === member.id
      );
      let updatedMembers = [];
      if (existingMemberIndex !== -1) {
        updatedMembers = [...activeDrivers];
        updatedMembers[existingMemberIndex] = member;
      } else {
        updatedMembers = [...activeDrivers, member];
      }

      dispatch(setActiveDrivers(updatedMembers));
    });

    customerChannel.bind("pusher:member_removed", (member) => {
      if (member.info.role !== "driver") return;
      const updatedMembers = activeDrivers.filter(
        (existingMember) => existingMember.id !== member.id
      );

      dispatch(setActiveDrivers(updatedMembers));
    });
    customerChannel.bind(`presence-accepted-${user._id}`, ({ driver }) => {
      dispatch(closeModal());
      setDriversLocation(driver.location);
      customerChannel.trigger(`client-status-change-request`, {
        id: driver._id,
        status: "engaged",
      });
    });

    customerChannel.bind(`client-status-change-request`, ({ id, status }) => {
      dispatch(changeDriverStatus({ id, status }));
    });
  }, [mapInstance, user]);

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
                if (activeDrivers.length > 0) {
                  const driverToRequest = getNearestDriver({
                    driversList: activeDrivers,
                    pickupLocation: rideInformation.origin.coordinates,
                  });

                  if (driverToRequest) {
                    openFindingRideModal();
                    triggerEvent({
                      bodyData: {
                        rideInformation,
                        currentLocation,
                        currentAddress: fromInputRef.current.value,
                        customer: user,
                        rideId: uuid(),
                      },
                      eventName: `presence-request-${driverToRequest.id}`,
                    });
                  } else {
                    openNoFoundRideModal("Drivers are busy");
                  }
                } else {
                  openNoFoundRideModal("No driver is available");
                }
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
      customer={user}
      currentLocation={currentLocation}
      customerChannel={channelRef.current}
    />
  ) : (
    <p>Loading driver location...</p>
  );
};

export default Map;
