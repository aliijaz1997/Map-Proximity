import React from "react";
import { useGetAllRidesQuery } from "../../app/service/api";
import moment from "moment";

export default function Rides() {
  const { data: rides, isLoading } = useGetAllRidesQuery();

  if (isLoading && !rides) {
    document.body.classList.add("loading-indicator");
  }
  if (!isLoading && rides) {
    document.body.classList.remove("loading-indicator");
  }

  return (
    <div className=" w-full">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Serial No.</th>
            <th>Date</th>
            <th>Customer Name</th>
            <th>Customer Address</th>
            <th>Driver Name</th>
            <th>Driver Address</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rides &&
            rides.map((ride, k) => {
              return (
                <tr key={k}>
                  <td>{k + 1}</td>
                  <td>{moment(ride.createdAt).format("DD MMM YY")}</td>
                  <td>{ride.customer.name}</td>
                  <td>{ride.customerAddress?.address}</td>
                  <td>{ride.driver.name}</td>
                  <td>{ride.driverAddress?.address}</td>
                  <td>
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
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}
