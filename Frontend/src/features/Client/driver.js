import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetUserByIdQuery,
  useTriggerEventsMutation,
  useUpdateRideMutation,
} from "../../app/service/api";
import { MODAL_BODY_TYPES } from "../../utils/globalConstantUtil";
import { openModal } from "../common/modalSlice";
import { showNotification } from "../common/headerSlice";
import { PusherInstance } from "../../utils/pusher/default";

export default function DriverClient() {
  const [showRequestModal, setShowRequestModal] = React.useState(false);
  const [rideRequestData, setRideRequestData] = React.useState(null);
  const [remainingTime, setRemainingTime] = React.useState(null);

  const { user: reduxUser } = useSelector((state) => state.auth);
  const { data: user, isLoading } = useGetUserByIdQuery({
    id: reduxUser?.uid,
  });
  const [updateRide, { isSuccess }] = useUpdateRideMutation();
  const [triggerEvent] = useTriggerEventsMutation();
  const dispatch = useDispatch();

  const channelRef = useRef();

  const progressBarWidth = ((remainingTime || 15) / 15) * 100;

  const openPreStartRideModal = ({ rideRequestData, driver }) => {
    dispatch(
      openModal({
        title: "Customer is waiting!",
        bodyType: MODAL_BODY_TYPES.PRE_START_DRIVER_RIDE_MODAL,
        extraObject: {
          rideRequestData,
          driver,
        },
      })
    );
  };

  const checkForInactivity = () => {
    const expireTime = localStorage.getItem("expireTime");
    if (expireTime < Date.now()) {
      console.log("User is inavtive", user);
      if (user && user.driverStatus === "online") {
        channelRef.current.trigger(`client-status-change-request`, {
          id: user._id,
          status: "offline",
        });
      }
    }
  };

  const updateExpireTime = () => {
    const expireTime = Date.now() + 20000;

    localStorage.setItem("expireTime", expireTime);
  };

  useEffect(() => {
    let interval;
    if (user && user.driverStatus === "online") {
      interval = setInterval(() => {
        checkForInactivity();
      }, 5000);
    }
    if (interval) {
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    updateExpireTime();

    window.addEventListener("click", updateExpireTime);
    window.addEventListener("keypress", updateExpireTime);
    window.addEventListener("scroll", updateExpireTime);
    window.addEventListener("mousemove", updateExpireTime);
    return () => {
      window.removeEventListener("click", updateExpireTime);
      window.removeEventListener("keypress", updateExpireTime);
      window.removeEventListener("scroll", updateExpireTime);
      window.removeEventListener("mousemove", updateExpireTime);
    };
  }, []);

  useEffect(() => {
    if (!user && !channelRef.current) return;
    const pusher = PusherInstance({ user_id: user._id });
    const driverChannel = pusher.subscribe("presence-ride");
    channelRef.current = driverChannel;

    driverChannel.bind("pusher:subscription_succeeded", (members) => {
      console.log("Subscription Succeeded", members);
    });

    driverChannel.bind("pusher:subscription_error", (status) => {
      console.error("Pusher subscription error:", status);
    });

    // when a new member joins the chat
    driverChannel.bind("pusher:member_added", (member) => {
      console.log(member, "ADDED");
    });

    // when a member leaves the chat
    driverChannel.bind("pusher:member_removed", (member) => {
      console.log(member, "REMOVED");
    });
    driverChannel.bind(`presence-request-${user._id}`, (data) => {
      console.log("Customer Request Information", data);
      setRideRequestData(data);
      setShowRequestModal(true);
    });
  }, [user]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(showNotification({ message: "New Ride is Added!", status: 1 }));
    }
  }, [isSuccess]);

  if (isLoading && !user) {
    document.body.classList.add("loading-indicator");
  }
  if (!isLoading && user) {
    document.body.classList.remove("loading-indicator");
  }

  console.log(rideRequestData, "kjhkjdh");
  return (
    <div className=" dark:text-gray-300 flex justify-center items-center mt-8">
      Hey {user.firstName} {user.lastName}The popup will appear when any
      customer will request the ride with in your area!
      {showRequestModal && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg bg-opacity-75">
          <div className=" rounded-lg p-8 relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-gray-300 rounded">
              <div
                className="h-full bg-green-500 rounded "
                style={{
                  width: `${progressBarWidth}%`,
                  transition: "width 1s linear",
                }}
              />
            </div>
            <h2 className="text-xl font-bold mb-4">Request Details</h2>
            <p>Customer Name: {rideRequestData?.customer?.firstName}</p>
            <p>
              Location: {rideRequestData?.rideInformation?.destination.address}
            </p>
            <p>Distance: {rideRequestData?.rideInformation?.distance} km</p>
            <p>Phone Number: {rideRequestData?.customer?.phoneNumber}</p>
            <p>Offered Price: {rideRequestData?.rideInformation?.fare}</p>
            <div className="flex justify-between items-center mt-6">
              <button className="px-4 py-2 bg-red-500 text-white rounded shadow">
                Decline
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded shadow"
                onClick={() => {
                  triggerEvent({
                    bodyData: {
                      rideRequestData,
                      driver: user,
                    },
                    eventName: `presence-accepted-${rideRequestData.customer._id}`,
                  });
                  setShowRequestModal(false);
                  openPreStartRideModal({
                    rideRequestData,
                    driver: user,
                  });
                  updateRide({
                    id: rideRequestData.rideId,
                    body: {
                      _id: rideRequestData.rideId,
                      status: "accepted",
                      customer: {
                        _id: rideRequestData.customer._id,
                        name: rideRequestData.customer.firstName,
                      },
                      driver: {
                        _id: user._id,
                        name: user.firstName,
                      },
                      rideInformation: rideRequestData?.rideInformation,
                      amount: rideRequestData.rideInformation.fare,
                    },
                  });
                }}
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
