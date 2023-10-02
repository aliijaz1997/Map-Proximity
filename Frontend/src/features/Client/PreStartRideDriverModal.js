import { useEffect } from "react";
import {
  useTriggerEventsMutation,
  useUpdateRideMutation,
} from "../../app/service/api";
import { showNotification } from "../common/headerSlice";
import { useDispatch } from "react-redux";
import { MODAL_BODY_TYPES } from "../../utils/globalConstantUtil";
import { openModal } from "../common/modalSlice";

const PreStartRideDriverModal = ({ closeModal, extraObject }) => {
  const { rideRequestData, driver } = extraObject;

  const [updateRide, { isSuccess }] = useUpdateRideMutation();
  const [triggerEvent] = useTriggerEventsMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isSuccess) {
      dispatch(showNotification({ message: "Ride is updated!", status: 1 }));
    }
  }, [isSuccess]);
  const handleStartRide = async () => {
    triggerEvent({
      bodyData: {
        rideRequestData,
        driver,
      },
      eventName: `presence-started-${rideRequestData.customer._id}`,
    });
    await updateRide({
      id: rideRequestData.rideId,
      body: {
        status: "started",
      },
    });

    dispatch(
      openModal({
        title: "You're ride has been started",
        bodyType: MODAL_BODY_TYPES.START_DRIVER_RIDE_MODAL,
        extraObject: {
          rideRequestData,
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
          {rideRequestData.customer.firstName}{" "}
          {rideRequestData.customer.lastName}
        </p>
      </div>
      <div className="mb-4">
        <h6 className="font-semibold">Address:</h6>
        <p>{rideRequestData.currentAddress}</p>
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
          className="bg-green-500 text-white rounded-md px-4 py-2 mr-2"
          onClick={handleStartRide}
        >
          Start Ride
        </button>
        <button
          type="button"
          className="bg-red-500 text-white rounded-md px-4 py-2"
          onClick={closeModal}
        >
          Close
        </button>
      </div>
    </>
  );
};

export default PreStartRideDriverModal;
