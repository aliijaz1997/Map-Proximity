import React from "react";
import { useSelector } from "react-redux";
import { useGetDriverEarningsQuery } from "../../app/service/api";
import Loader from "../../components/Loader/Loader";

const DriverPayment = () => {
  const { user } = useSelector((state) => state.auth);

  const { data: totalDriverEarning, isLoading } = useGetDriverEarningsQuery({
    id: user?.uid,
  });
  console.log(totalDriverEarning);
  if (isLoading || !totalDriverEarning || !user) {
    return <Loader />;
  }
  return (
    <div className="flex items-center justify-center">
      <h2 className="text-6xl font-bold">
        Total Earnings: {totalDriverEarning} USD
      </h2>
    </div>
  );
};

export default DriverPayment;
