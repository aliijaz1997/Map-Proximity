import React from "react";
import { useSelector } from "react-redux";
import { useGetAdminEarningsQuery } from "../../app/service/api";
import Loader from "../../components/Loader/Loader";

const AdminPayment = () => {
  const { user } = useSelector((state) => state.auth);

  const { data: totalEarnings, isLoading } = useGetAdminEarningsQuery();
  console.log(totalEarnings);
  if (isLoading || !totalEarnings || !user) {
    return <Loader />;
  }
  return (
    <div className="flex items-center justify-center">
      <h2 className="text-6xl font-bold">
        Total Earnings: {totalEarnings} USD
      </h2>
    </div>
  );
};

export default AdminPayment;
