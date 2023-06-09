import { useState } from "react";
import { useDispatch } from "react-redux";
import InputText from "../../../components/Input/InputText";
import ErrorText from "../../../components/Typography/ErrorText";
import { showNotification } from "../../common/headerSlice";
import SelectBox from "../../../components/Input/SelectBox";
import { isValidEmail } from "../../../utils/emailFormatTest";
import ImageUploadComponent from "../../../components/Input/ImageUpload";
import GoogleAutocomplete from "../../../components/Input/googleMapAutoComplete";
import { useAddCustomerMutation } from "../../../app/service/api";

const INITIAL_CUSTOMER_OBJ = {
  first_name: "",
  last_name: "",
  email: "",
  phoneNumber: "",
  status: "",
  imageUrl: "",
};

function AddCustomerModal({ closeModal }) {
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [customerObj, setCustomerObj] = useState(INITIAL_CUSTOMER_OBJ);

  const [addNewCustomer, { isLoading, isError, isSuccess, error }] =
    useAddCustomerMutation();
  const saveNewCustomer = () => {
    if (customerObj.first_name.trim() === "")
      return setErrorMessage("First Name is required!");
    if (customerObj.last_name.trim() === "")
      return setErrorMessage("Last Name is required!");
    else if (
      customerObj.email.trim() === "" ||
      !isValidEmail(customerObj.email)
    )
      return setErrorMessage(
        "Email is not provided or email is not in correct format!"
      );
    else if (customerObj.phoneNumber.trim() === "")
      return setErrorMessage("Phone No. is not provided!");
    else if (customerObj.status.trim() === "")
      return setErrorMessage("Please select the status");
    else if (!customerObj.location)
      return setErrorMessage("Please select the location");
    else if (customerObj.imageUrl.trim() === "")
      return setErrorMessage(
        "Upload you profile pic it is necessary for your identification."
      );
    else {
      let newCustomerObj = {
        email: customerObj.email,
        phoneNumber: customerObj.phoneNumber,
        firstName: customerObj.first_name,
        lastName: customerObj.last_name,
        status: customerObj.status,
        location: customerObj.location,
        imageUrl: customerObj.imageUrl,
      };
      addNewCustomer(newCustomerObj);
    }
  };

  const updateFormValue = ({ updateType, value }) => {
    setErrorMessage("");
    setCustomerObj({ ...customerObj, [updateType]: value });
  };

  const getImageUrl = (url) => {
    setCustomerObj((prev) => ({ ...prev, imageUrl: url }));
  };

  const getLocation = (location) => {
    setCustomerObj((prev) => ({ ...prev, location }));
  };

  if (loading) {
    document.body.classList.add("loading-indicator");
  }
  if (!loading) {
    document.body.classList.remove("loading-indicator");
  }

  if (isLoading) {
    document.body.classList.add("loading-indicator");
  }
  if (isError) {
    document.body.classList.remove("loading-indicator");
    dispatch(
      showNotification({
        message: "Error Occurred while adding customer",
        status: 2,
      })
    );
  }

  if (isSuccess) {
    document.body.classList.remove("loading-indicator");
    dispatch(showNotification({ message: "New Customer Added!", status: 1 }));
    closeModal();
  }

  return (
    <>
      <InputText
        type="text"
        defaultValue={customerObj.first_name}
        updateType="first_name"
        containerStyle="mt-4"
        labelTitle="First Name"
        updateFormValue={updateFormValue}
      />

      <InputText
        type="text"
        defaultValue={customerObj.last_name}
        updateType="last_name"
        containerStyle="mt-4"
        labelTitle="Last Name"
        updateFormValue={updateFormValue}
      />

      <InputText
        type="email"
        defaultValue={customerObj.email}
        updateType="email"
        containerStyle="mt-4"
        labelTitle="Email Id"
        updateFormValue={updateFormValue}
      />
      <InputText
        type="text"
        defaultValue={customerObj.phoneNumber}
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
      <GoogleAutocomplete getLocation={getLocation} />
      <ImageUploadComponent getImageUrl={getImageUrl} setLoading={setLoading} />

      <ErrorText styleClass="mt-16">{errorMessage}</ErrorText>
      <div className="modal-action">
        <button className="btn btn-ghost" onClick={() => closeModal()}>
          Cancel
        </button>
        <button
          className="btn btn-primary px-6"
          onClick={() => saveNewCustomer()}
        >
          Save
        </button>
      </div>
    </>
  );
}

export default AddCustomerModal;
