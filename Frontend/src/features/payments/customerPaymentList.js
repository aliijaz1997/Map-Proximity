import React from "react";
import { useGetUserRidesQuery } from "../../app/service/api";
import { useSelector } from "react-redux";
import Loader from "../../components/Loader/Loader";
import dayjs from "dayjs";

export default function CustomerPaymentList() {
  const { user } = useSelector((state) => state.auth);
  const { data: customerRides, isLoading } = useGetUserRidesQuery({
    id: user.uid,
    userType: "customer",
  });

  const getShortAddress = (address) => {
    return address.split(",").slice(0, 2).join(",");
  };

  if (!user || !customerRides || isLoading) {
    return <Loader />;
  }
  return (
    <div className="overflow-x-auto">
      <table className="table table-compact w-full ">
        <thead className="">
          <tr>
            <th></th>
            <th>Driver</th>
            <th>Origin</th>
            <th>Destination</th>
            <th>Date</th>
            <th>Ride Status</th>
            <th>Amount</th>
            <th>Payment Status</th>
          </tr>
        </thead>
        <tbody>
          {customerRides.map((ride, idx) => {
            return (
              <tr key={ride._id}>
                <th>{idx}</th>
                <td>{ride.driver.name}</td>
                <td>
                  {getShortAddress(ride.rideInformation.destination.address)}
                </td>
                <td>{getShortAddress(ride.rideInformation.origin.address)}</td>
                <td> {dayjs(ride.createdAt).format("DD MMM YYYY")}</td>
                <td
                  className={`text-${
                    ride.status === "accepted" ? "primary" : "green-700"
                  } text-right font-semibold`}
                >
                  {ride.status.toUpperCase()}
                </td>
                <td className="text-primary text-right font-semibold">
                  ${ride.amount}
                </td>
                <td
                  className={`text-${
                    ride.paymentStatus === "pending"
                      ? "yellow-600"
                      : "green-700"
                  } text-right font-semibold`}
                >
                  {ride.paymentStatus.toUpperCase()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
