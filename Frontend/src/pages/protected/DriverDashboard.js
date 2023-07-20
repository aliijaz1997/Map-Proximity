import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../features/common/headerSlice";
import DriverDashboard from "../../features/Client/DriverComponents/DriverDashboard";

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Driver Dashboard" }));
  }, []);

  return <DriverDashboard />;
}

export default InternalPage;
