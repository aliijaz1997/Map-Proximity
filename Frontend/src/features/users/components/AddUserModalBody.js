import { useState } from "react";
import { useDispatch } from "react-redux";
import InputText from "../../../components/Input/InputText";
import ErrorText from "../../../components/Typography/ErrorText";
import { showNotification } from "../../common/headerSlice";
import SelectBox from "../../../components/Input/SelectBox";
import { isValidEmail } from "../../../utils/emailFormatTest";
import ImageUploadComponent from "../../../components/Input/ImageUpload";
import { useAddUserMutation } from "../../../app/service/api";

const INITIAL_USER_OBJ = {
  first_name: "",
  last_name: "",
  email: "",
  phoneNumber: "+92",
  status: "active",
  imageUrl: "",
  password: "",
  role: "admin",
};

function AddUserModal({ closeModal }) {
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [userObj, setUserObj] = useState(INITIAL_USER_OBJ);

  const [addNewCustomer, { isLoading, isError, isSuccess }] =
    useAddUserMutation();
  const saveNewCustomer = () => {
    if (userObj.first_name.trim() === "")
      return setErrorMessage("First Name is required!");
    if (userObj.last_name.trim() === "")
      return setErrorMessage("Last Name is required!");
    else if (userObj.email.trim() === "" || !isValidEmail(userObj.email))
      return setErrorMessage(
        "Email is not provided or email is not in correct format!"
      );
    else if (userObj.phoneNumber.trim() === "")
      return setErrorMessage("Phone No. is not provided!");
    else if (userObj.password.trim() === "")
      return setErrorMessage("Password is not provided!");
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
        firstName: userObj.first_name,
        lastName: userObj.last_name,
        status: userObj.status,
        location: userObj.location,
        imageUrl: userObj.imageUrl,
        password: userObj.password,
        role: userObj.role,
        addedBy: true,
      };
      addNewCustomer(newUserObj);
    }
  };

  const updateFormValue = ({ updateType, value }) => {
    setErrorMessage("");
    setUserObj({ ...userObj, [updateType]: value });
  };

  const getImageUrl = (url) => {
    setUserObj((prev) => ({ ...prev, imageUrl: url }));
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
        message: "Error Occurred while adding user",
        status: 2,
      })
    );
  }

  if (isSuccess) {
    document.body.classList.remove("loading-indicator");
    dispatch(showNotification({ message: "New User Added!", status: 1 }));
    closeModal();
  }

  return (
    <>
      <InputText
        type="text"
        defaultValue={userObj.first_name}
        updateType="first_name"
        containerStyle="mt-4"
        labelTitle="First Name"
        updateFormValue={updateFormValue}
      />

      <InputText
        type="text"
        defaultValue={userObj.last_name}
        updateType="last_name"
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
        type="password"
        defaultValue={userObj.password}
        updateType="password"
        containerStyle="mt-4"
        labelTitle="Password"
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

export default AddUserModal;
