import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../features/common/headerSlice";
import CustomerPaymentList from "../../features/payments/customerPaymentList";

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Payment History" }));
  }, []);

  return <CustomerPaymentList />;
}

export default InternalPage;
