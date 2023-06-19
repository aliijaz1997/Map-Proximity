import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../features/common/headerSlice";
import DriverClient from "../../features/Client/driver";

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Drivers" }));
  }, []);

  return <DriverClient />;
}

export default InternalPage;
