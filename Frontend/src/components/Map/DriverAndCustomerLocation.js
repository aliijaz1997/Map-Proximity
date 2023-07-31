import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { showNotification } from "../../features/common/headerSlice";
import { MODAL_BODY_TYPES } from "../../utils/globalConstantUtil";
import { openModal } from "../../features/common/modalSlice";

const driverIconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="green" class="w-6 h-6">
<path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25zM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h.375a3 3 0 116 0h3a.75.75 0 00.75-.75V15z" />
<path d="M8.25 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0zM15.75 6.75a.75.75 0 00-.75.75v11.25c0 .087.015.17.042.248a3 3 0 015.958.464c.853-.175 1.522-.935 1.464-1.883a18.659 18.659 0 00-3.732-10.104 1.837 1.837 0 00-1.47-.725H15.75z" />
<path d="M19.5 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
</svg>

`;

const customerIconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="green" class="w-5 h-5">
<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.99 5.99 0 00-4.793 2.39A6.483 6.483 0 0010 16.5a6.483 6.483 0 004.793-2.11A5.99 5.99 0 0010 12z" clip-rule="evenodd" />
</svg>

`;
const driverIconUrl = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
  driverIconSvg
)}`;
const customerIconUrl = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
  customerIconSvg
)}`;
function DriverCustomerLocation({ locations, currentLocation, socket }) {
  console.log(currentLocation, locations);
  const [driverLocation, setDriverLocation] = useState(null);
  const [customerLocation, setCustomerLocation] = useState(null);
  const mapRef = useRef(null);
  const driverMarkerRef = useRef(null);
  const customerMarkerRef = useRef(null);

  const dispatch = useDispatch();

  // ... Rest of the component code ...

  useEffect(() => {
    const {
      initialDriverLat,
      initialDriverLng,
      initialCustomerLat,
      initialCustomerLng,
    } = locations;

    setDriverLocation({ lat: initialDriverLat, lng: initialDriverLng });
    setCustomerLocation({ lat: initialCustomerLat, lng: initialCustomerLng });
  }, [locations]);

  useEffect(() => {
    const mapOptions = {
      center: currentLocation || { lat: 30.362, lng: 71.509 },
      zoom: 14,
      disableDefaultUI: true,
      zoomControl: false,
    };

    const map = new window.google.maps.Map(mapRef.current, mapOptions);

    // Create marker objects for the driver and customer
    const driverMarker = new window.google.maps.Marker({
      position: driverLocation,
      map,
      icon: {
        url: driverIconUrl,
        scaledSize: new window.google.maps.Size(40, 40),
      },
    });

    const customerMarker = new window.google.maps.Marker({
      position: customerLocation,
      map,
      icon: {
        url: customerIconUrl,
        scaledSize: new window.google.maps.Size(40, 40),
      },
    });

    driverMarkerRef.current = driverMarker;
    customerMarkerRef.current = customerMarker;
  }, [driverLocation, customerLocation, currentLocation]);

  useEffect(() => {
    // Update the driver location every 15 seconds
    const locationArray = [
      { lat: 30.362, lng: 71.509 },
      { lat: 30.194553, lng: 71.477242 },
      { lat: 30.200123, lng: 71.480987 },
      { lat: 30.205432, lng: 71.483762 },
      { lat: 30.210789, lng: 71.486512 },
      { lat: 30.215987, lng: 71.489275 },
      { lat: 30.4, lng: 71.6 },
    ];

    const timer = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * locationArray.length);
      const randomLocation = locationArray[randomIndex];

      setDriverLocation(randomLocation);
    }, 5000);

    // Clean up on component unmount
    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    socket.on("ride-start", ({ customerInfo, driver }) => {
      dispatch(
        showNotification({
          message: "Map will show the destination and your current location!",
          status: 1,
        })
      );
    });
    socket.on("ride-ended", ({ customerInfo, driver }) => {
      dispatch(
        openModal({
          title: "Your ride has been ended",
          bodyType: MODAL_BODY_TYPES.RIDE_END_MODAL,
          extraObject: {
            customerInfo,
            driver,
          },
        })
      );
    });
  }, [socket]);

  return (
    <div>
      <h1 className="text-orange-700 font-bold m-4 mb-8 text-lg">
        Track the real-time location of you and your driver!
      </h1>
      <div
        ref={mapRef}
        style={{
          height: "400px",
          border: "1px solid black",
          borderRadius: "8px",
        }}
      ></div>
    </div>
  );
}

export default DriverCustomerLocation;
