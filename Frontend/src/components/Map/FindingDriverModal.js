import React, { useState, useEffect } from "react";

export default function FindingDriverModal({ onClose }) {
  const [loading, setLoading] = useState(true);

  return (
    <div className=" w-56 h-56 mx-auto mb-4">
      {loading ? (
        <div className="relative w-full h-full flex items-center justify-center animate-ping">
          <div className="absolute w-full h-full border-8 border-green-500 rounded-full animate-pin"></div>
          <div className="absolute w-full h-full border-6 border-green-500 rounded-full animate-pin-reverse"></div>
        </div>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full text-green-500"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 2a8 8 0 100 16 8 8 0 000-16zM4.293 7.707a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 10-1.414-1.414L7 8.586 4.293 5.879a1 1 0 00-1.414 1.414z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </div>
  );
}
