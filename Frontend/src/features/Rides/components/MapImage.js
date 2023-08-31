import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { openModal } from "../../common/modalSlice";
import { MODAL_BODY_TYPES } from "../../../utils/globalConstantUtil";

const MapImage = ({ origin, destination }) => {
  const [mapUrl, setMapUrl] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    const mapImageUrl = `https://maps.googleapis.com/maps/api/staticmap?size=600x400&markers=color:red|label:O|${origin}
    &markers=color:green|label:D|${destination}&path=color:darkblue|weight:5|${origin}|${destination}&key=${process.env.REACT_APP_GOOGLE_API_KEY}`;

    setMapUrl(mapImageUrl);
  }, [origin, destination]);

  const handleImageClick = () => {
    dispatch(
      openModal({
        title: "Ride route display",
        bodyType: MODAL_BODY_TYPES.SHOW_MAP_IMAGE_MODAL,
        extraObject: {
          imageUrl: mapUrl,
        },
      })
    );
  };
  return (
    <img
      onClick={handleImageClick} // Add the onClick event handler
      className="cursor-pointer"
      width={150}
      height={150}
      src={mapUrl}
      alt="Map Image"
    />
  );
};

export default MapImage;
