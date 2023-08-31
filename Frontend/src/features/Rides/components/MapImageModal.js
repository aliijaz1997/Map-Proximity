import React from "react";

const MapImageModal = ({ extraObject }) => {
  const { imageUrl } = extraObject;

  return <img src={imageUrl} alt="Map Image" />;
};

export default MapImageModal;
