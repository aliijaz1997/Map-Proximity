import { useEffect, useState } from "react";
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

function EditCustomerModal({ closeModal, extraObject }) {
  const { index: id } = extraObject;

  const dispatch = useDispatch();

  const {
    data: customerDetails,
    isLoading: isCustomerDetailsLoading,
    isError: isCustomerDetailsError,
    isSuccess: isCustomerDetailsFetched,
  } = useGetUserByIdQuery({ id });

  const [errorMessage, setErrorMessage] = useState("");
  const [customerObj, setCustomerObj] = useState(customerDetails ?? {});

  const [
    updateCustomer,
    {
      isLoading: isCustomerUpdating,
      isError: isCustomerError,
      isSuccess: isCustomerUpdated,
    },
  ] = useUpdateUserMutation();

  useEffect(() => {
    setCustomerObj(customerDetails);
  }, [customerDetails]);

  const saveCustomer = () => {
    if (customerObj.firstName.trim() === "")
      return setErrorMessage("First Name is required!");
    if (customerObj.lastName.trim() === "")
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
        firstName: customerObj.firstName,
        lastName: customerObj.lastName,
        status: customerObj.status,
        location: customerObj.location,
        imageUrl: customerObj.imageUrl,
      };
      updateCustomer({ ...newCustomerObj, id });
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

  if (isCustomerUpdating) {
    document.body.classList.add("loading-indicator");
  }
  if (!customerObj || !customerDetails || isCustomerDetailsLoading) {
    document.body.classList.add("loading-indicator");
    return;
  }

  if (isCustomerError) {
    document.body.classList.remove("loading-indicator");
    dispatch(
      showNotification({
        message: "Error Occurred while updating customer",
        status: 2,
      })
    );
  }

  if (isCustomerDetailsError) {
    document.body.classList.remove("loading-indicator");
    dispatch(
      showNotification({
        message: "Error Occurred while getting customer details",
        status: 2,
      })
    );
  }

  if (isCustomerUpdated) {
    document.body.classList.remove("loading-indicator");
    dispatch(
      showNotification({
        message: "Customer is updated successfully!",
        status: 1,
      })
    );
    closeModal();
  }
  if (isCustomerDetailsFetched) {
    document.body.classList.remove("loading-indicator");
  }
  return (
    <>
      <InputText
        type="text"
        defaultValue={customerObj.firstName}
        updateType="firstName"
        containerStyle="mt-4"
        labelTitle="First Name"
        updateFormValue={updateFormValue}
      />

      <InputText
        type="text"
        defaultValue={customerObj.lastName}
        updateType="lastName"
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
        defaultValue={customerObj.status}
        updateType="status"
        containerStyle="mt-4"
        placeholder="Select Status"
        options={[
          { name: "Active", value: "active" },
          { name: "Non Active", value: "non active" },
        ]}
        updateFormValue={updateFormValue}
      />
      <GoogleAutocomplete
        getLocation={getLocation}
        address={customerObj.location.address}
      />
      <ImageUploadComponent
        getImageUrl={getImageUrl}
        url={customerObj.imageUrl}
      />

      <ErrorText styleClass="mt-16">{errorMessage}</ErrorText>
      <div className="modal-action">
        <button className="btn btn-ghost" onClick={() => closeModal()}>
          Cancel
        </button>
        <button className="btn btn-primary px-6" onClick={() => saveCustomer()}>
          Save
        </button>
      </div>
    </>
  );
}

export default EditCustomerModal;
