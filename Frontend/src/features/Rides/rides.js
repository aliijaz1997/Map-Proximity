import React from "react";
import { useGetAllRidesQuery } from "../../app/service/api";
import moment from "moment";
import MapImage from "./components/MapImage";
import TitleCard from "../../components/Cards/TitleCard";

export default function Rides() {
  const { data: rides, isLoading } = useGetAllRidesQuery();

  if (isLoading && !rides) {
    document.body.classList.add("loading-indicator");
  }
  if (!isLoading && rides) {
    document.body.classList.remove("loading-indicator");
  }
  console.log(rides);
  return (
    <TitleCard title="Total Rides" topMargin="mt-2">
      <div>
        <table className="table-auto">
          <thead>
            <tr>
              <th>Serial No.</th>
              <th>Date</th>
              <th>Customer Name</th>
              <th>Driver Name</th>
              <th>Origin Address</th>
              <th>Destination Address</th>
              <th>Ride Static Image</th>
              <th>Status</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {rides &&
              rides.map((ride, k) => {
                const clampedRating = Math.min(Math.max(1, ride.rating), 5);
                const filledStars = clampedRating;
                const emptyStars = 5 - filledStars;

                return (
                  <tr key={k}>
                    <td className="border p-3">{k + 1}</td>
                    <td className="border p-3">
                      {moment(ride.createdAt).format("DD MMM YY")}
                    </td>
                    <td className="border p-3">{ride.customer.name}</td>
                    <td className="border p-3">{ride.driver.name}</td>
                    <td className="border p-3">
                      {ride.rideInformation.origin.address}
                    </td>
                    <td className="border p-3">
                      {ride.rideInformation.destination.address}
                    </td>
                    <td className="border p-3">
                      <MapImage
                        origin={`${ride.rideInformation.origin.coordinates.lat},${ride.rideInformation.origin.coordinates.lng}`}
                        destination={`${ride.rideInformation.destination.coordinates.lat},${ride.rideInformation.destination.coordinates.lng}`}
                      />
                    </td>
                    <td className="border p-3">
                      {ride.status !== "completed" ? (
                        <div className="badge badge-error text-white">
                          {ride.status.toUpperCase()}
                        </div>
                      ) : (
                        <div className="badge badge-success text-white">
                          {ride.status.toUpperCase()}
                        </div>
                      )}
                    </td>
                    <td className="border p-3">
                      <div className="flex space-x-1">
                        {[...Array(filledStars)].map((_, index) => (
                          <span key={index} className="text-yellow-400">
                            ★
                          </span>
                        ))}
                        {[...Array(emptyStars)].map((_, index) => (
                          <span key={index} className="text-gray-300">
                            ★
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </TitleCard>
  );
}
