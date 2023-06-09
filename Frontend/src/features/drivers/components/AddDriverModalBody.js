import { useState } from "react";
import { useDispatch } from "react-redux";
import InputText from "../../../components/Input/InputText";
import ErrorText from "../../../components/Typography/ErrorText";
import { showNotification } from "../../common/headerSlice";
import SelectBox from "../../../components/Input/SelectBox";
import { isValidEmail } from "../../../utils/emailFormatTest";
import ImageUploadComponent from "../../../components/Input/ImageUpload";
import GoogleAutocomplete from "../../../components/Input/googleMapAutoComplete";
import { useAddDriverMutation } from "../../../app/service/api";

const INITIAL_Driver_OBJ = {
  first_name: "",
  last_name: "",
  email: "",
  phoneNumber: "",
  status: "",
  imageUrl: "",
  carImage: "",
  carName: "",
  carNumber: "",
};

function AddDriverModalBody({ closeModal }) {
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState("");
  const [driverObj, setDriverObj] = useState(INITIAL_Driver_OBJ);

  const [addNewDriver, { isLoading, isError, isSuccess }] =
    useAddDriverMutation();
  const saveNewDriver = () => {
    if (driverObj.first_name.trim() === "")
      return setErrorMessage("First Name is required!");
    if (driverObj.last_name.trim() === "")
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
        firstName: driverObj.first_name,
        lastName: driverObj.last_name,
        status: driverObj.status,
        location: driverObj.location,
        imageUrl: driverObj.imageUrl,
        carImage: driverObj.carImage,
        carName: driverObj.carName,
        carNumber: driverObj.carNumber,
      };
      addNewDriver(newCustomerObj);
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

  if (isLoading) {
    document.body.classList.add("loading-indicator");
  }
  if (isError) {
    document.body.classList.remove("loading-indicator");
    dispatch(
      showNotification({
        message: "Error Occurred while adding driver",
        status: 2,
      })
    );
  }

  if (isSuccess) {
    document.body.classList.remove("loading-indicator");
    dispatch(showNotification({ message: "New Driver Added!", status: 1 }));
    closeModal();
  }
  return (
    <>
      <InputText
        type="text"
        defaultValue={driverObj.first_name}
        updateType="first_name"
        containerStyle="mt-4"
        labelTitle="First Name"
        updateFormValue={updateFormValue}
      />

      <InputText
        type="text"
        defaultValue={driverObj.last_name}
        updateType="last_name"
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

      <SelectBox
        defaultValue="PLACEHOLDER"
        updateType="status"
        containerStyle="mt-4"
        placeholder="Select Status"
        options={[
          { name: "Active", value: "active" },
          { name: "Non Active", value: "non active" },
        ]}
        updateFormValue={updateFormValue}
      />
      <InputText
        type="text"
        defaultValue={driverObj.carName}
        updateType="carName"
        containerStyle="mt-4"
        labelTitle="Car Name"
        updateFormValue={updateFormValue}
      />
      <InputText
        type="text"
        defaultValue={driverObj.carNumber}
        updateType="carNumber"
        containerStyle="mt-4"
        labelTitle="Car Number"
        updateFormValue={updateFormValue}
      />
      <GoogleAutocomplete getLocation={getLocation} />
      <ImageUploadComponent title="Profile" getImageUrl={getImageUrl} />
      <ImageUploadComponent title="Car" getImageUrl={getCarImageUrl} />

      <ErrorText styleClass="mt-16">{errorMessage}</ErrorText>
      <div className="modal-action">
        <button className="btn btn-ghost" onClick={() => closeModal()}>
          Cancel
        </button>
        <button
          className="btn btn-primary px-6"
          onClick={() => saveNewDriver()}
        >
          Save
        </button>
      </div>
    </>
  );
}

export default AddDriverModalBody;
