import React from "react";
import CustomerRidesStatus from "./RidesCompletedTable";
import AverageRidesCustomer from "./AverageRidesStats";

export default function CustomerDashboard() {
  return (
    <div>
      <CustomerRidesStatus />
      <AverageRidesCustomer />
    </div>
  );
}
