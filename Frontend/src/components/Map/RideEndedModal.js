import React from "react";
import { useDispatch } from "react-redux";

export default function RideEndedModal({ closeModal }) {
  const dispatch = useDispatch();

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg z-10">
        <p className="text-xl font-semibold mb-4">Ride Ended</p>
        <p className="text-gray-600 mb-8">Press OK to book your next ride.</p>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => {
            dispatch(closeModal());
            window.location.href("/");
          }}
        >
          OK
        </button>
      </div>
    </div>
  );
}
