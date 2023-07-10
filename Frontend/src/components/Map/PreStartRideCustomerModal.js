import { useState } from "react";

const PreStartRideCustomerModal = ({ driverName }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center opacity-75">
      <div className="bg-gray-700 rounded-lg shadow-lg p-6 ">
        <div className="flex justify-between items-center mb-4">
          <h5 className="text-xl font-bold">
            Your Driver is five minute away, Please wait.
          </h5>
        </div>
        <div className="mb-4 flex">
          <h6 className="font-semibold">Driver Name:</h6>
          <p>{driverName}</p>
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
      </div>
    </div>
  );
};

export default PreStartRideCustomerModal;
