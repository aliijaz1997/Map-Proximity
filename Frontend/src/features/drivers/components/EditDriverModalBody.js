import { useEffect, useLayoutEffect, useState } from "react";
import { useDispatch } from "react-redux";
import InputText from "../../../components/Input/InputText";
import ErrorText from "../../../components/Typography/ErrorText";
import { showNotification } from "../../common/headerSlice";
import SelectBox from "../../../components/Input/SelectBox";
import { isValidEmail } from "../../../utils/emailFormatTest";
import ImageUploadComponent from "../../../components/Input/ImageUpload";
import GoogleAutocomplete from "../../../components/Input/googleMapAutoComplete";
import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from "../../../app/service/api";

function EditDriverModalBody({ closeModal, extraObject }) {
  const { index: id } = extraObject;

  const dispatch = useDispatch();

  const {
    data: driverDetails,
    isLoading: isDriverDetailsLoading,
    isError: isDriverDetailsError,
    isSuccess: isDriverDetailsFetched,
  } = useGetUserByIdQuery({ id });

  const [errorMessage, setErrorMessage] = useState("");
  const [driverObj, setDriverObj] = useState(driverDetails ?? {});

  const [
    updateDriver,
    {
      isLoading: isDriverUpdating,
      isError: isDriverError,
      isSuccess: isDriverUpdated,
    },
  ] = useUpdateUserMutation();

  useEffect(() => {
    setDriverObj(driverDetails);
  }, [driverDetails]);

  const saveDriver = () => {
    if (driverObj.firstName.trim() === "")
      return setErrorMessage("First Name is required!");
    if (driverObj.lastName.trim() === "")
      return setErrorMessage("Last Name is required!");
    else if (driverObj.email.trim() === "" || !isValidEmail(driverObj.email))
      return setErrorMessage(
        "Email is not provided or email is not in correct format!"
      );
    else if (driverObj.phoneNumber.trim() === "")
      return setErrorMessage("Phone No. is not provided!");
    else if (driverObj.status.trim() === "")
      return setErrorMessage("Please select the status");
    else if (driverObj.carName.trim() === "")
      return setErrorMessage("Please provide the car name");
    else if (driverObj.carNumber.trim() === "")
      return setErrorMessage("Please provide the car number");
    else if (!driverObj.location)
      return setErrorMessage("Please select the location");
    else if (driverObj.imageUrl.trim() === "")
      return setErrorMessage(
        "Upload your profile pic it is necessary for your identification!"
      );
    else if (driverObj.carImage.trim() === "")
      return setErrorMessage("Upload your car image it is necessary!");
    else {
      let newCustomerObj = {
        email: driverObj.email,
        phoneNumber: driverObj.phoneNumber,
        firstName: driverObj.firstName,
        lastName: driverObj.lastName,
        status: driverObj.status,
        location: driverObj.location,
        imageUrl: driverObj.imageUrl,
        carImage: driverObj.carImage,
        carName: driverObj.carName,
        carNumber: driverObj.carNumber,
      };
      updateDriver({ ...newCustomerObj, id });
    }
  };

  const updateFormValue = ({ updateType, value }) => {
    setErrorMessage("");
    setDriverObj({ ...driverObj, [updateType]: value });
  };

  const getImageUrl = (url) => {
    setDriverObj((prev) => ({ ...prev, imageUrl: url }));
  };
  const getCarImageUrl = (url) => {
    setDriverObj((prev) => ({ ...prev, carImage: url }));
  };

  const getLocation = (location) => {
    setDriverObj((prev) => ({ ...prev, location }));
  };

  if (isDriverUpdating) {
    document.body.classList.add("loading-indicator");
  }
  if (!driverObj || !driverDetails || isDriverDetailsLoading) {
    document.body.classList.add("loading-indicator");
    return;
  }
  if (isDriverError) {
    document.body.classList.remove("loading-indicator");
    dispatch(
      showNotification({
        message: "Error Occurred while updating driver",
        status: 2,
      })
    );
  }
  if (isDriverDetailsError) {
    document.body.classList.remove("loading-indicator");
    dispatch(
      showNotification({
        message: "Error Occurred while getting driver details",
        status: 2,
      })
    );
  }

  if (isDriverUpdated) {
    document.body.classList.remove("loading-indicator");
    dispatch(
      showNotification({
        message: "Driver is updated successfully!",
        status: 1,
      })
    );
    closeModal();
  }
  if (isDriverDetailsFetched) {
    document.body.classList.remove("loading-indicator");
  }
  return (
    <>
      <InputText
        type="text"
        defaultValue={driverObj.firstName}
        updateType="firstName"
        containerStyle="mt-4"
        labelTitle="First Name"
        updateFormValue={updateFormValue}
      />

      <InputText
        type="text"
        defaultValue={driverObj.lastName}
        updateType="lastName"
        containerStyle="mt-4"
        labelTitle="Last Name"
        updateFormValue={updateFormValue}
      />

      <InputText
        type="email"
        defaultValue={driverObj.email}
        updateType="email"
        containerStyle="mt-4"
        labelTitle="Email Id"
        updateFormValue={updateFormValue}
      />
      <InputText
        type="text"
        defaultValue={driverObj.phoneNumber}
        updateType="phoneNumber"
        containerStyle="mt-4"
        labelTitle="Phone No."
        updateFormValue={updateFormValue}
      />

      <div className="flex flex-col">
        <SelectBox
          defaultValue={driverObj.status}
          updateType="status"
          containerStyle="mt-4"
          labelTitle="Status"
          options={[
            { name: "Active", value: "active" },
            { name: "Non Active", value: "non active" },
          ]}
          updateFormValue={updateFormValue}
        />
        <SelectBox
          defaultValue={driverObj.carName}
          updateType="carName"
          containerStyle="mt-4"
          labelTitle="Car Name"
          options={[
            { name: "Hatch Back", value: "hatchback" },
            { name: "Sedan", value: "sedan" },
            { name: "Pick Up Carry", value: "pick up" },
          ]}
          updateFormValue={updateFormValue}
        />
      </div>
      <InputText
        type="text"
        defaultValue={driverObj.carNumber}
        updateType="carNumber"
        containerStyle="mt-4"
        labelTitle="Car Number"
        updateFormValue={updateFormValue}
      />
      <GoogleAutocomplete
        getLocation={getLocation}
        address={driverObj.location.address}
      />
      <ImageUploadComponent
        title="Profile"
        getImageUrl={getImageUrl}
        url={driverObj.imageUrl}
      />
      <ImageUploadComponent
        title="Car"
        getImageUrl={getCarImageUrl}
        url={driverObj.carImage}
      />

      <ErrorText styleClass="mt-16">{errorMessage}</ErrorText>
      <div className="modal-action">
        <button className="btn btn-ghost" onClick={() => closeModal()}>
          Cancel
        </button>
        <button className="btn btn-primary px-6" onClick={() => saveDriver()}>
          Save
        </button>
      </div>
    </>
  );
}

export default EditDriverModalBody;
