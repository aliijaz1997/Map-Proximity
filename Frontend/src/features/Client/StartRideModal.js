import React from "react";

const StartRideModal = ({ closeModal, extraObject }) => {
  const { customerInfo, driver } = extraObject;

  const handleEndRide = () => {};
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
