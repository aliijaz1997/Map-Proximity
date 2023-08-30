import React, { useEffect, useState } from "react";

const MapImage = ({ origin, destination }) => {
  const [mapUrl, setMapUrl] = useState("");
  useEffect(() => {
    const mapImageUrl = `https://maps.googleapis.com/maps/api/staticmap?size=600x400&markers=color:red|label:O|${origin}
    &markers=color:green|label:D|${destination}&path=color:darkblue|weight:5|${origin}|${destination}&key=${process.env.REACT_APP_GOOGLE_API_KEY}`;

    setMapUrl(mapImageUrl);
  }, [origin, destination]);

  return <img width={150} height={150} src={mapUrl} alt="Map Image" />;
};

export default MapImage;
