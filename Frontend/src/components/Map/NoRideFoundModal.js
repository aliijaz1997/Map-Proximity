function NoRideFoundModal({ message, onClose, showModal }) {
  return (
    showModal && (
      <div
        className={
          "fixed inset-0 flex justify-center items-center z-50 bg-gray-800 bg-opacity-75"
        }
      >
        <div className="bg-gray-700 rounded-lg p-8">
          <div className="flex justify-center items-center">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <h2 className="text-xl font-bold ml-2">No Driver Found</h2>
          </div>
          <p className="text-center mt-4">{message}</p>
          <div className="flex justify-center mt-6">
            <button
              className="px-4 py-2 bg-red-500 text-white rounded shadow"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )
  );
}

export default NoRideFoundModal;
