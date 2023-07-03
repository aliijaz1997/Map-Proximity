import React from "react";

export default function DriverClient() {
  const [isOnline, setIsOnline] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);

  const handleSwitch = () => {
    setIsOnline(!isOnline);
  };

  const handleModal = () => {
    setShowModal(!showModal);
  };
  return (
    <div className="flex justify-center items-center mt-8">
      <button
        className={`rounded-full w-16 h-8 ${
          isOnline ? "bg-green-500" : "bg-gray-300"
        }`}
        onClick={handleSwitch}
      >
        <span
          className={`block w-6 h-6 rounded-full shadow-md transform transition-transform ${
            isOnline ? "translate-x-8 bg-white" : "translate-x-0 bg-gray-500"
          }`}
        />
      </button>

      {isOnline && (
        <button
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded shadow"
          onClick={handleModal}
        >
          Request Ride
        </button>
      )}

      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-gray-800 bg-opacity-75">
          <div className="bg-white dark:bg-gray-700 dark:text-gray-300 rounded-lg p-8">
            <h2 className="text-xl font-bold mb-4">Request Details</h2>
            <p>Customer Name: John Doe</p>
            <p>Location: Example Address</p>
            <p>Distance: 20.81 km</p>
            <p>Phone Number: 123-456-7890</p>
            <p>Offered Price: Rs: 550</p>
            <div className="flex justify-between">
              <button
                className="mt-6 px-4 py-2 bg-red-500 text-white rounded shadow"
                onClick={handleModal}
              >
                Decline
              </button>
              <button
                className="mt-6 px-4 py-2 bg-green-500 text-white rounded shadow"
                onClick={handleModal}
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
