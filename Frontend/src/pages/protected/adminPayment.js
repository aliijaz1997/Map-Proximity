import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../features/common/headerSlice";
import AdminPayment from "../../features/payments/adminPayment";

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Payment Section" }));
  }, []);

  return <AdminPayment />;
}

export default InternalPage;
