import { useState } from "react";

const PreStartRideDriverModal = ({ closeModal, extraObject }) => {
  const { customerName, address } = extraObject;

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h5 className="text-xl font-bold">Ride Details</h5>
      </div>
      <div className="mb-4 flex">
        <h6 className="font-semibold">Customer Name: </h6>
        <p>{customerName}</p>
      </div>
      <div className="mb-4">
        <h6 className="font-semibold">Address:</h6>
        <p>{address}</p>
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="w-6 h-6 mb-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
        />
      </svg>
      <div className="flex justify-end">
        <button
          type="button"
          className="bg-blue-500 text-white rounded-md px-4 py-2 mr-2"
          // onClick={handleStartRide}
        >
          Start Ride
        </button>
        <button
          type="button"
          className="bg-gray-300 text-gray-700 rounded-md px-4 py-2"
          onClick={closeModal}
        >
          Close
        </button>
      </div>
    </>
  );
};

export default PreStartRideDriverModal;
