import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../features/common/headerSlice";
import CustomerPayments from "../../features/payments/customerPayments";

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Customer Payment" }));
  }, []);

  return <CustomerPayments />;
}

export default InternalPage;
