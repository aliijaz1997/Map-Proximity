import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../features/common/headerSlice";
import CustomerDashboard from "../../features/Client/CustomerComponents/CustomerDashboard";

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Customer Dashboard" }));
  }, []);

  return <CustomerDashboard />;
}

export default InternalPage;
