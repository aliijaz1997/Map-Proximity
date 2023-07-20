import React from "react";
import DashboardStats from "../../dashboard/components/DashboardStats";
import TruckIcon from "@heroicons/react/24/outline/TruckIcon";
import CircleStackIcon from "@heroicons/react/24/outline/CircleStackIcon";
import CreditCardIcon from "@heroicons/react/24/outline/CreditCardIcon";
import MonthlyEarningChart from "./MonthlyEarningChart";
import MonthlyRidesChart from "./MonthlyRidesChart";

export default function DriverDashboard() {
  return (
    <div>
      <div className="grid lg:grid-cols-4 mt-2 md:grid-cols-2 grid-cols-1 gap-6">
        {statsData.map((d, k) => {
          return <DashboardStats key={k} {...d} colorIndex={k} />;
        })}
      </div>
      {/** ---------------------- Different charts ------------------------- */}
      <div className="grid lg:grid-cols-2 mt-4 grid-cols-1 gap-6">
        <MonthlyEarningChart />
        <MonthlyRidesChart />
      </div>
    </div>
  );
}

let statsData = [
  {
    title: "Total Rides",
    value: "400",
    icon: <TruckIcon className="w-8 h-8" />,
    description: "22%",
  },
  {
    title: "Total Earnings",
    value: "$34,545",
    icon: <CreditCardIcon className="w-8 h-8" />,
    description: "Current month",
  },
  {
    title: "Pending Payments",
    value: "450",
    icon: <CircleStackIcon className="w-8 h-8" />,
    description: "50 in hot leads",
  },
  {
    title: "Today Rides",
    value: "12",
    icon: <TruckIcon className="w-8 h-8" />,
    description: "18%",
  },
];
