import React, { useEffect, useState } from "react";
import { useUpdateRideMutation } from "../../app/service/api";
import { showNotification } from "../../features/common/headerSlice";
import { useDispatch } from "react-redux";

export default function RideEndedModal({ closeModal, extraObject }) {
  const [rating, setRating] = useState(null);

  const dispatch = useDispatch();

  const { rideRequestData, driver } = extraObject;
  const [updateRide, { isSuccess }] = useUpdateRideMutation();

  useEffect(() => {
    if (isSuccess) {
      dispatch(
        showNotification({
          message: "Thank you for giving rating!",
          status: 1,
        })
      );
      closeModal();
      window.location.href = "/customer";
    }
  }, [isSuccess]);

  const handleRatingClick = (value) => {
    const ratingValue = parseInt(value);
    setRating(ratingValue);

    updateRide({
      id: rideRequestData.rideId,
      body: { rating: ratingValue },
    });
  };
  return (
    <div className="">
      <div className="flex flex-col items-center space-x-4">
        <img
          src={driver.imageUrl}
          alt="profile picture"
          className="w-28 h-28 rounded-full object-cover"
        />
        <div className="flex flex-col items-center">
          <p className="text-3xl font-semibold">
            {driver.firstName} {driver.lastName}
          </p>
          <div className="flex space-x-4 m-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`cursor-pointer ${
                  rating >= star ? "text-yellow-400" : "text-gray-300"
                } text-5xl`}
                onClick={() => handleRatingClick(star)}
              >
                ★
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
