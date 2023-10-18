import React from "react";
import { useSelector } from "react-redux";
import { useGetAdminEarningsQuery } from "../../app/service/api";
import Loader from "../../components/Loader/Loader";

import ArrowDownIcon from "@heroicons/react/24/outline/ArrowDownIcon";
import ArrowUpIcon from "@heroicons/react/24/outline/ArrowUpIcon";
import TitleCard from "../../components/Cards/TitleCard";
import { Doughnut } from "react-chartjs-2";
import {
  ArcElement,
  Filler,
  Legend,
  Tooltip,
  Chart as ChartJS,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, Tooltip, Filler, Legend);

const AdminPayment = () => {
  const { user } = useSelector((state) => state.auth);
  const { data: earnings, isLoading } = useGetAdminEarningsQuery();

  if (isLoading || !earnings || !user) {
    return <Loader />;
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  const labels = ["Admin Earnings", "Driver Earnings"];

  const data = {
    labels,
    datasets: [
      {
        label: "Comparison of Admin Driver Earning",
        data: [earnings.adminEarnings, earnings.driversEarnings],
        backgroundColor: ["rgba(173, 216, 230, 1)", "rgba(255, 102, 102, 1)"],
        borderColor: ["rgba(173, 216, 230, 1)", "rgba(255, 102, 102, 1)"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="container mx-auto mt-8 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-100 rounded-lg p-4 shadow-lg flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-blue-700 mb-2">
              Admin Earnings
            </h2>
            <p className="text-2xl text-blue-600">
              Total: {earnings.adminEarnings} USD
            </p>
          </div>
          <ArrowDownIcon className="h-12 w-12 text-green-500 ml-2" />
        </div>
        <div className="bg-red-100 rounded-lg p-4 shadow-lg flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-red-700 mb-2">
              Driver Earnings
            </h2>
            <p className="text-2xl text-red-600">
              Total: {earnings.driversEarnings} USD
            </p>
          </div>
          <ArrowUpIcon className="h-12 w-12 text-red-500 ml-2" />
        </div>
      </div>
      <div className="flex justify-center">
        <div className="w-6/12 flex text-center">
          <TitleCard title={"Admin Driver Comparison"}>
            <Doughnut options={options} data={data} />
          </TitleCard>
        </div>
      </div>
    </div>
  );
};

export default AdminPayment;
