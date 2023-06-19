import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../features/common/headerSlice";
import CustomerClient from "../../features/Client/customer";

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Customers" }));
  }, []);

  return <CustomerClient />;
}

export default InternalPage;
