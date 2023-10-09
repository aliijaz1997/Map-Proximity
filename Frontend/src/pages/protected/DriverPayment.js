import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../features/common/headerSlice";
import DriverEarnings from "../../features/payments/driverPayment";

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Driver Payment" }));
  }, []);

  return <DriverEarnings />;
}

export default InternalPage;
