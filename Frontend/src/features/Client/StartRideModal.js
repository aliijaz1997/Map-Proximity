import React, { useEffect } from "react";
import socket from "../../utils/socket";
import { useUpdateRideMutation } from "../../app/service/api";
import { useDispatch } from "react-redux";
import { showNotification } from "../common/headerSlice";

const StartRideModal = ({ closeModal, extraObject }) => {
  const { customerInfo, driver } = extraObject;

  const dispatch = useDispatch();
  const [updateRide, { isSuccess }] = useUpdateRideMutation();

  useEffect(() => {
    if (isSuccess) {
      dispatch(showNotification({ message: "Ride is updated!", status: 1 }));
    }
  }, [isSuccess]);

  const handleEndRide = async () => {
    socket.emit("ride-ended", {
      customerInfo,
      driver,
    });
    await updateRide({
      id: customerInfo.rideId,
      body: {
        status: "completed",
      },
    });

    closeModal();
  };
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
      <div className="mb-4">
        <span className="font-bold text-green-500 text-xl">Ride Started</span>
      </div>
      <div className="mb-4">
        <span className="font-bold">Destination:</span>{" "}
        {customerInfo.rideInformation.destinationAddress}
      </div>
      <div className="mb-4">
        <span className="font-bold">Time:</span>{" "}
        {customerInfo.rideInformation.duration}
      </div>
      <div className="mb-6">
        <span className="font-bold">Distance:</span>{" "}
        {customerInfo.rideInformation.distance} km
      </div>
      <button
        onClick={handleEndRide}
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Ride End
      </button>
    </div>
  );
};

export default StartRideModal;
