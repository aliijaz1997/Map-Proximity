import React, { useRef, useState, useEffect } from "react";

const GoogleAutocomplete = ({ getLocation, address }) => {
  const [inputValue, setInputValue] = useState(address || "");
  const [addressData, setAddressData] = useState({
    city: address?.split(",")[0] || "",
    country: address?.split(",")[1] || "",
    postalCode: "",
    state: address?.split(",")[2] || "",
  });
  const inputRef = useRef(null);
  let autocomplete;

  useEffect(() => {
    autocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ["(regions)"],
        componentRestrictions: { country: "pk" },
      }
    );

    autocomplete.addListener("place_changed", handlePlaceSelected);

    return () => {
      window.google.maps.event.clearInstanceListeners(autocomplete);
    };
  }, []);

  const handlePlaceSelected = () => {
    const selectedPlace = autocomplete.getPlace();
    const { formatted_address: address, geometry } = selectedPlace;

    const location = {
      address,
      lat: geometry.location.lat(),
      lng: geometry.location.lng(),
    };
    const [city, state, country] = address.split(",");
    setAddressData({ city, state, country });

    getLocation(location);
    setInputValue(address);
  };

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
        <span className={"label-text text-base-content "}>Address</span>
      </label>{" "}
      <input
        placeholder="Select the Address"
        ref={inputRef}
        className="input  input-bordered w-full "
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
      />
      {inputValue && (
        <div className="flex flex-col m-8">
          <div className="flex">
            <div className="w-1/2 mr-2">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="city"
              >
                City
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                type="text"
                id="city"
                value={addressData.city}
                readOnly
              />
            </div>
            <div className="w-1/2">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="state"
              >
                State
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                type="text"
                id="state"
                value={addressData.state}
                readOnly
              />
            </div>
          </div>
          <div className="flex mt-4">
            <div className="w-1/2 mr-2">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="country"
              >
                Country
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                type="text"
                id="country"
                value={addressData.country}
                readOnly
              />
            </div>
            <div className="w-1/2">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="postalCode"
              >
                Postal Code
              </label>
              <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                type="text"
                id="postalCode"
                value={addressData.postalCode}
                readOnly
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleAutocomplete;
