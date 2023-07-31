import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../features/common/headerSlice";
import MapWithPolygonDrawing from "../../features/dashboard/components/PolygonMapDraw";

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Restrict the operation areas" }));
  }, []);

  return <MapWithPolygonDrawing />;
}

export default InternalPage;
