function NoRideFoundModal({ closeModal, extraObject }) {
  const { message } = extraObject;
  return (
    <>
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
          onClick={closeModal}
        >
          Close
        </button>
      </div>
    </>
  );
}

export default NoRideFoundModal;
