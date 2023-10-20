import React from "react";
import DashboardStats from "../../dashboard/components/DashboardStats";
import TruckIcon from "@heroicons/react/24/outline/TruckIcon";
import CircleStackIcon from "@heroicons/react/24/outline/CircleStackIcon";
import CreditCardIcon from "@heroicons/react/24/outline/CreditCardIcon";
import MonthlyEarningChart from "./MonthlyEarningChart";
import MonthlyRidesChart from "./MonthlyRidesChart";
import { useSelector } from "react-redux";
import { useGetDriverStatsQuery } from "../../../app/service/api";
import Loader from "../../../components/Loader/Loader";

export default function DriverDashboard() {
  const { user } = useSelector((state) => state.auth);
  const { data: driverStat, isLoading } = useGetDriverStatsQuery({
    id: user?.uid,
  });

  if (!user || !driverStat || isLoading) return <Loader />;
  let statsData = [
    {
      title: "Total Rides",
      value: driverStat.totalRides,
      icon: <TruckIcon className="w-8 h-8" />,
      description: "You're total rides with us!",
    },
    {
      title: "Total Earnings",
      value: `$${driverStat.totalEarnings}`,
      icon: <CreditCardIcon className="w-8 h-8" />,
      description: "You're total earnings",
    },
    {
      title: "Pending Payments",
      value: driverStat.pendingPayments,
      icon: <CircleStackIcon className="w-8 h-8" />,
      description: "You're pending amount",
    },
    {
      title: "Today's Rides",
      value: driverStat.currentDayRides,
      icon: <TruckIcon className="w-8 h-8" />,
      description: "You total rides for today",
    },
  ];
  return (
    <div>
      <div className="grid lg:grid-cols-4 mt-2 md:grid-cols-2 grid-cols-1 gap-6">
        {statsData.map((d, k) => {
          return <DashboardStats key={k} {...d} colorIndex={k} />;
        })}
      </div>
      {/** ---------------------- Different charts ------------------------- */}
      <div className="grid lg:grid-cols-2 mt-4 grid-cols-1 gap-6">
        <MonthlyEarningChart earningsPerMonth={driverStat.earningsPerMonth} />
        <MonthlyRidesChart
          ridesPerMonth={driverStat.ridesPerMonth}
          earningsPerMonth={driverStat.earningsPerMonth}
        />
      </div>
    </div>
  );
}
