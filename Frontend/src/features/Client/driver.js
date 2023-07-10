import React, { useEffect } from "react";
import socket from "../../utils/socket";
import { useSelector } from "react-redux";
import { useGetUserByIdQuery } from "../../app/service/api";
import PreStartRideDriverModal from "./PreStartRideDriverModal";

export default function DriverClient() {
  const [showRequestModal, setShowRequestModal] = React.useState(false);
  const [showPreStartRideModal, setShowPreStartModal] = React.useState(false);
  const [customerInfo, setCustomerInfo] = React.useState(null);
  const [driver, setDriver] = React.useState(null);

  const [remainingTime, setRemainingTime] = React.useState(null);

  const { user: reduxUser } = useSelector((state) => state.auth);
  const { data: user, isLoading } = useGetUserByIdQuery({
    id: reduxUser?.uid,
  });

  const progressBarWidth = ((remainingTime || 15) / 15) * 100;

  useEffect(() => {
    if (socket) {
      console.log("in socket");
      socket.on("driver-ride-request", (data) => {
        console.log("in driver request socket");
        setCustomerInfo(data);
        setShowRequestModal(true);
      });
      socket.on("timer-update", ({ time }) => {
        setRemainingTime(time);
        if (time === 0) {
          setShowRequestModal(false);
        }
      });

      socket.on("driver-assign", ({ customer, driver }) => {
        setShowRequestModal(false);
        setShowPreStartModal(true);
        setCustomerInfo(customer);
        setDriver(driver);
      });
    }
  });

  if (isLoading && !user) {
    document.body.classList.add("loading-indicator");
  }
  if (!isLoading && user) {
    document.body.classList.remove("loading-indicator");
  }

  return (
    <div className=" dark:text-gray-300 flex justify-center items-center mt-8">
      {showRequestModal && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg bg-opacity-75">
          <div className=" rounded-lg p-8 relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-gray-300 rounded">
              <div
                className="h-full bg-green-500 rounded "
                style={{
                  width: `${progressBarWidth}%`,
                  transition: "width 1s linear",
                }}
              />
            </div>
            <h2 className="text-xl font-bold mb-4">Request Details</h2>
            <p>Customer Name: {customerInfo?.customer?.firstName}</p>
            <p>Location: {customerInfo?.currentAddress}</p>
            <p>Distance: {customerInfo?.rideInformation?.distance} km</p>
            <p>Phone Number: {customerInfo?.customer?.phoneNumber}</p>
            <p>Offered Price: {customerInfo?.rideInformation?.fare}</p>
            <div className="flex justify-between items-center mt-6">
              <button className="px-4 py-2 bg-red-500 text-white rounded shadow">
                Decline
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded shadow"
                onClick={() => {
                  socket.emit("ride-accepted", {
                    customer: customerInfo,
                    driver: user,
                  });
                }}
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
      {showPreStartRideModal && (
        <PreStartRideDriverModal
          onClose={() => {
            setShowPreStartModal(false);
          }}
          handleStartRide={() => {}}
          customerName={customerInfo?.customer.firstName}
          address={customerInfo?.currentAddress}
        />
      )}
    </div>
  );
}
