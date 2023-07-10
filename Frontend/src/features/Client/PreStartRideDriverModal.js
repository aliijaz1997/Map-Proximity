import { useState } from "react";

const PreStartRideDriverModal = ({
  onClose,
  customerName,
  address,
  handleStartRide,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center opacity-75">
      <div className="bg-gray-700 rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h5 className="text-xl font-bold">Ride Details</h5>
          <button
            type="button"
            className="text-gray-500 hover:text-gray-800"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <div className="mb-4">
          <h6 className="font-semibold">Customer Name:</h6>
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
            onClick={handleStartRide}
          >
            Start Ride
          </button>
          <button
            type="button"
            className="bg-gray-300 text-gray-700 rounded-md px-4 py-2"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreStartRideDriverModal;
