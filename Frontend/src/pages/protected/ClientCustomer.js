import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../features/common/headerSlice";
import CustomerClient from "../../features/Client/customer";

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Book a Ride" }));
  }, []);

  return <CustomerClient />;
}

export default InternalPage;
