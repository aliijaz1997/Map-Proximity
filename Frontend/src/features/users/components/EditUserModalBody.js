import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import InputText from "../../../components/Input/InputText";
import ErrorText from "../../../components/Typography/ErrorText";
import { showNotification } from "../../common/headerSlice";
import SelectBox from "../../../components/Input/SelectBox";
import { isValidEmail } from "../../../utils/emailFormatTest";
import ImageUploadComponent from "../../../components/Input/ImageUpload";
import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from "../../../app/service/api";

function EditUserModal({ closeModal, extraObject }) {
  const { index: id } = extraObject;

  const dispatch = useDispatch();

  const {
    data: userDetails,
    isLoading: isUserDetailsLoading,
    isError: isUserDetailsError,
    isSuccess: isUserDetailsFetched,
  } = useGetUserByIdQuery({ id });

  const [errorMessage, setErrorMessage] = useState("");
  const [userObj, setUserObj] = useState(userDetails ?? {});

  const [
    updateUser,
    {
      isLoading: isUserUpdating,
      isError: isUserError,
      isSuccess: isUserUpdated,
    },
  ] = useUpdateUserMutation();

  useEffect(() => {
    setUserObj(userDetails);
  }, [userDetails]);

  const saveUser = () => {
    if (userObj.firstName.trim() === "")
      return setErrorMessage("First Name is required!");
    if (userObj.lastName.trim() === "")
      return setErrorMessage("Last Name is required!");
    else if (userObj.email.trim() === "" || !isValidEmail(userObj.email))
      return setErrorMessage(
        "Email is not provided or email is not in correct format!"
      );
    else if (userObj.phoneNumber.trim() === "")
      return setErrorMessage("Phone No. is not provided!");
    else if (userObj.status.trim() === "")
      return setErrorMessage("Please select the status");
    else if (userObj.imageUrl.trim() === "")
      return setErrorMessage(
        "Upload you profile pic it is necessary for your identification."
      );
    else {
      let newUserObj = {
        email: userObj.email,
        phoneNumber: userObj.phoneNumber,
        firstName: userObj.firstName,
        lastName: userObj.lastName,
        status: userObj.status,
        location: userObj.location,
        imageUrl: userObj.imageUrl,
      };
      updateUser({ ...newUserObj, id });
    }
  };

  const updateFormValue = ({ updateType, value }) => {
    setErrorMessage("");
    setUserObj({ ...userObj, [updateType]: value });
  };

  const getImageUrl = (url) => {
    setUserObj((prev) => ({ ...prev, imageUrl: url }));
  };

  if (isUserUpdating) {
    document.body.classList.add("loading-indicator");
  }
  if (!userObj || !userDetails || isUserDetailsLoading) {
    document.body.classList.add("loading-indicator");
    return;
  }

  if (isUserError) {
    document.body.classList.remove("loading-indicator");
    dispatch(
      showNotification({
        message: "Error Occurred while updating user",
        status: 2,
      })
    );
  }

  if (isUserDetailsError) {
    document.body.classList.remove("loading-indicator");
    dispatch(
      showNotification({
        message: "Error Occurred while getting user details",
        status: 2,
      })
    );
  }

  if (isUserUpdated) {
    document.body.classList.remove("loading-indicator");
    dispatch(
      showNotification({
        message: "user is updated successfully!",
        status: 1,
      })
    );
    closeModal();
  }
  if (isUserDetailsFetched) {
    document.body.classList.remove("loading-indicator");
  }
  return (
    <>
      <InputText
        type="text"
        defaultValue={userObj.firstName}
        updateType="firstName"
        containerStyle="mt-4"
        labelTitle="First Name"
        updateFormValue={updateFormValue}
      />

      <InputText
        type="text"
        defaultValue={userObj.lastName}
        updateType="lastName"
        containerStyle="mt-4"
        labelTitle="Last Name"
        updateFormValue={updateFormValue}
      />

      <InputText
        type="email"
        defaultValue={userObj.email}
        updateType="email"
        containerStyle="mt-4"
        labelTitle="Email Id"
        updateFormValue={updateFormValue}
      />
      <InputText
        type="text"
        defaultValue={userObj.phoneNumber}
        updateType="phoneNumber"
        containerStyle="mt-4"
        labelTitle="Phone No."
        updateFormValue={updateFormValue}
      />

      <SelectBox
        defaultValue={userObj.status}
        updateType="status"
        containerStyle="mt-4"
        placeholder="Select Status"
        options={[
          { name: "Active", value: "active" },
          { name: "Non Active", value: "non active" },
        ]}
        updateFormValue={updateFormValue}
      />

      <ImageUploadComponent getImageUrl={getImageUrl} url={userObj.imageUrl} />

      <ErrorText styleClass="mt-16">{errorMessage}</ErrorText>
      <div className="modal-action">
        <button className="btn btn-ghost" onClick={() => closeModal()}>
          Cancel
        </button>
        <button className="btn btn-primary px-6" onClick={() => saveUser()}>
          Save
        </button>
      </div>
    </>
  );
}

export default EditUserModal;
