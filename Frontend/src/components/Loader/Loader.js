import React from "react";

const Loader = () => {
  const overlayStyle = {
    position: "fixed",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    zIndex: 1000,
    background: "#00000080",
  };

  const loaderStyle = {
    position: "fixed",
    top: "40%",
    left: "45%",
    zIndex: 10010,
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "1.2rem",
    border: "16px solid #f3f3f3",
    borderTop: "16px solid #0474bf",
    borderRadius: "50%",
    width: "120px",
    height: "120px",
    animation: "spin 2s linear infinite",
  };

  return (
    <>
      <div style={overlayStyle}></div>
      <div style={loaderStyle}></div>
    </>
  );
};

export default Loader;
