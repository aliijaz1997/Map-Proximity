import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../features/common/headerSlice";
import DriverPaymentList from "../../features/payments/driverPaymentList";

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Payment History" }));
  }, []);

  return <DriverPaymentList />;
}

export default InternalPage;
