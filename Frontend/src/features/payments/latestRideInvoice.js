import React, { useEffect, useRef } from "react";
import {
  useGetLatestPendingRideQuery,
  useGetUserByIdQuery,
  useMakePaymentMutation,
  useUpdateRideMutation,
} from "../../app/service/api";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader/Loader";
import { showNotification } from "../common/headerSlice";
import { PusherInstance } from "../../utils/pusher/default";

export default function LatestRideInvoice() {
  const { user } = useSelector((state) => state.auth);
  const { data: dbUser } = useGetUserByIdQuery({ id: user.uid });
  const { data: ride, isLoading } = useGetLatestPendingRideQuery({
    id: user.uid,
  });

  const channelRef = useRef(null);

  const [makePayment, { isSuccess, isError, isLoading: makingPayment }] =
    useMakePaymentMutation();
  const [updateRide, { isLoading: updatingRide }] = useUpdateRideMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user && !channelRef.current) return;
    const driverChannel = PusherInstance({ user_id: user.uid }).subscribe(
      "presence-ride"
    );
    channelRef.current = driverChannel;
  }, [user]);
  useEffect(() => {
    if (isSuccess) {
      dispatch(
        showNotification({
          message: "Your payment is successful!",
          status: 1,
        })
      );
    }
    if (isError) {
      dispatch(
        showNotification({
          message: "Problem in paying. Please try again!",
          status: 2,
        })
      );
    }
  }, [isSuccess, isError]);
  const executePayment = async () => {
    if (dbUser && ride) {
      await makePayment({
        customerId: dbUser.customerPaymentId,
        amount: ride.amount,
      });

      await updateRide({
        id: ride._id,
        body: {
          paymentStatus: "success",
        },
      });

      channelRef.current.trigger(`client-payment-success-${ride.driver._id}`, {
        name: ride.customer.name,
        amount: ride.amount,
      });
    }
  };

  if (!user || isLoading) {
    return <Loader />;
  }

  if (makingPayment || updatingRide) {
    return <Loader />;
  }
  return (
    <div className="flex justify-center mt-5 ">
      {!ride ? (
        <div className="bg-warning p-4 rounded-lg shadow-md">
          <p className="text-3xl font-bold text-white">No recent rides found</p>
        </div>
      ) : (
        <div className="card w-2/4 glass">
          <figure className="card-image">
            <img
              src={`https://maps.googleapis.com/maps/api/staticmap?size=600x400&markers=color:red|label:O|${`${ride.rideInformation.origin.coordinates.lat},${ride.rideInformation.origin.coordinates.lng}`}
    &markers=color:green|label:D|${`${ride.rideInformation.destination.coordinates.lat},${ride.rideInformation.destination.coordinates.lng}`}&path=color:darkblue|weight:5|${`${ride.rideInformation.origin.coordinates.lat},${ride.rideInformation.origin.coordinates.lng}`}|${`${ride.rideInformation.destination.coordinates.lat},${ride.rideInformation.destination.coordinates.lng}`}&key=${
                process.env.REACT_APP_GOOGLE_API_KEY
              }`}
              alt="Ride Pic"
            />
          </figure>
          <div className="card-body">
            <div className="flex justify-between">
              <h2 className="card-title">Ride Invoice</h2>
              <h2 className="text-red-600 font-bold text-3xl">
                ${ride.amount}
              </h2>
            </div>
            <p>
              <strong>From:</strong> {ride.rideInformation.origin.address}
            </p>
            <p>
              <strong>To:</strong> {ride.rideInformation.destination.address}
            </p>
            <p className="text-yellow-500">
              <strong className="text-black">Status of Payment:</strong>{" "}
              {ride.paymentStatus.toUpperCase()}
            </p>
            <p className="card-text">
              Please pay by clicking the button below.
            </p>
            <div className="card-actions justify-end">
              <button
                className="btn btn-success w-full"
                onClick={executePayment}
                disabled={!ride}
              >
                Pay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
