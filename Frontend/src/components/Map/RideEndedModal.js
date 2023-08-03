import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function RideEndedModal({ closeModal }) {
  const [seconds, setSeconds] = useState(5);
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = "/";
    }, 5000);

    const interval = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);
    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);
  return (
    <div className="flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg ">
        <p className="text-xl font-semibold mb-4">Ride Ended</p>
        <p className="text-2xl">{seconds}</p>
        <p className="text-gray-600 mb-8">
          Press OK to book your next ride or the page will automatically be
          redirected.
        </p>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => {
            dispatch(closeModal());
            window.location.href = "/";
          }}
        >
          OK
        </button>
      </div>
    </div>
  );
}
