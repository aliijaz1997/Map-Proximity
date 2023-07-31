import { useEffect } from "react";
import socket from "../../utils/socket";
import { useUpdateRideMutation } from "../../app/service/api";
import { showNotification } from "../common/headerSlice";
import { useDispatch } from "react-redux";
import { MODAL_BODY_TYPES } from "../../utils/globalConstantUtil";
import { openModal } from "../common/modalSlice";

const PreStartRideDriverModal = ({ closeModal, extraObject }) => {
  const { customer: customerInfo, driver } = extraObject;
  const [updateRide, { isSuccess }] = useUpdateRideMutation();

  const dispatch = useDispatch();

  useEffect(() => {
    if (isSuccess) {
      dispatch(showNotification({ message: "Ride is updated!", status: 1 }));
    }
  }, [isSuccess]);
  const handleStartRide = async () => {
    socket.emit("ride-started", {
      customerInfo,
      driver,
    });
    await updateRide({
      id: customerInfo.rideId,
      body: {
        status: "started",
      },
    });

    dispatch(
      openModal({
        title: "You're ride has been started",
        bodyType: MODAL_BODY_TYPES.START_DRIVER_RIDE_MODAL,
        extraObject: {
          customerInfo,
          driver,
        },
      })
    );
  };
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h5 className="text-xl font-bold">Ride Details</h5>
      </div>
      <div className="mb-4 flex">
        <h6 className="font-semibold">Customer Name: </h6>
        <p>
          {customerInfo.customer.firstName} {customerInfo.customer.lastName}
        </p>
      </div>
      <div className="mb-4">
        <h6 className="font-semibold">Address:</h6>
        <p>{customerInfo.currentAddress}</p>
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
          className="bg-green-700 text-gray-700 rounded-md px-4 py-2"
          onClick={closeModal}
        >
          Close
        </button>
      </div>
    </>
  );
};

export default PreStartRideDriverModal;
