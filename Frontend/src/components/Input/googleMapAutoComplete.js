import React, { useRef, useState, useEffect } from "react";
import { usePlacesWidget } from "react-google-autocomplete";

const GoogleAutocomplete = ({ getLocation }) => {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);

  const { ref } = usePlacesWidget({
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    options: {
      types: ["(regions)"],
      componentRestrictions: { country: "pk" }, // Restrict results to Pakistan
    },
    onPlaceSelected: (place) => {
      const { formatted_address: address, geometry } = place;

      const location = {
        address,
        lat: geometry.location.lat(),
        lng: geometry.location.lng(),
      };
      getLocation(location);
      setInputValue(address);
    },
  });

  useEffect(() => {
    if (inputRef.current && !inputValue) {
      inputRef.current.value = "";
    }
  }, [inputValue]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputFocus = () => {
    setInputValue("");
    inputRef.current.value = "";
  };

  return (
    <div className={`form-control w-full `}>
      <label className="label">
        <span className={"label-text text-base-content "}>Location</span>
      </label>{" "}
      <input
        placeholder="Select the location"
        ref={(element) => {
          ref.current = element;
          inputRef.current = element;
        }}
        className="input  input-bordered w-full "
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
      />
    </div>
  );
};

export default GoogleAutocomplete;
