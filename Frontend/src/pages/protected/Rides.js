import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../features/common/headerSlice";
import Rides from "../../features/Rides/rides";

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Rides Record" }));
  }, []);

  return <Rides />;
}

export default InternalPage;
