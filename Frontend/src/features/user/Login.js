import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ErrorText from "../../components/Typography/ErrorText";
import InputText from "../../components/Input/InputText";
import { useDispatch, useSelector } from "react-redux";
import { registerOrLoginUser } from "../../app/slices/authSlice";
import SelectBox from "../../components/Input/SelectBox";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useAddUserMutation } from "../../app/service/api";
import { auth } from "../../utils/firebase";

function Login() {
  const INITIAL_LOGIN_OBJ = {
    password: "",
    emailId: "",
    role: "admin",
  };

  const [addUser] = useAddUserMutation();

  const { loading, user } = useSelector((state) => state.auth);

  const [errorMessage, setErrorMessage] = useState("");
  const [loginObj, setLoginObj] = useState(INITIAL_LOGIN_OBJ);

  useEffect(() => {
    localStorage.setItem("theme", "light");
  }, []);

  const submitForm = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (loginObj.emailId.trim() === "")
      return setErrorMessage("Email Id is required!");
    if (loginObj.password.trim() === "")
      return setErrorMessage("Password is required!");
    if (loginObj.role.trim() === "")
      return setErrorMessage("role is required!");
    else {
      try {
        const response = await signInWithEmailAndPassword(
          auth,
          loginObj.emailId,
          loginObj.password
        );
        window.location.href = "/";
        return response.user;
      } catch (error) {
        if (error.code === "auth/user-not-found") {
          const response = await createUserWithEmailAndPassword(
            auth,
            loginObj.emailId,
            loginObj.password
          );
          await addUser({
            email: loginObj.emailId,
            password: loginObj.password,
            role: loginObj.role,
            id: response.user.uid,
          });
          window.location.href = "/";
          return response.user;
        } else {
          console.log(error);
          throw error;
        }
      }
    }
  };

  const updateFormValue = ({ updateType, value }) => {
    setErrorMessage("");
    setLoginObj({ ...loginObj, [updateType]: value });
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center">
      <div className="card mx-auto w-full max-w-5xl  shadow-xl">
        <div className="grid  md:grid-cols-2 grid-cols-1  bg-base-100 rounded-xl">
          <div className="">
            <img src="/logo192.jpg" className="h-5/6" alt="Map image" />
          </div>
          <div className="py-24 px-10">
            <h2 className="text-2xl font-semibold mb-2 text-center">Login</h2>
            <form onSubmit={(e) => submitForm(e)}>
              <div className="mb-4">
                <InputText
                  type="emailId"
                  defaultValue={loginObj.emailId}
                  updateType="emailId"
                  containerStyle="mt-4"
                  labelTitle="Email Id"
                  updateFormValue={updateFormValue}
                />

                <InputText
                  defaultValue={loginObj.password}
                  type="password"
                  updateType="password"
                  containerStyle="mt-4"
                  labelTitle="Password"
                  updateFormValue={updateFormValue}
                />
                {/* <SelectBox
                  defaultValue={loginObj.status}
                  updateType="role"
                  containerStyle="mt-4"
                  placeholder="Select Role"
                  options={[
                    { name: "Admin", value: "admin" },
                    { name: "Driver", value: "driver" },
                    { name: "Customer", value: "customer" },
                  ]}
                  updateFormValue={updateFormValue}
                /> */}
              </div>

              <div className="text-right text-primary">
                <Link to="/forgot-password">
                  <span className="text-sm  inline-block  hover:text-primary hover:underline hover:cursor-pointer transition duration-200">
                    Forgot Password?
                  </span>
                </Link>
              </div>

              <ErrorText styleClass="mt-8">{errorMessage}</ErrorText>
              <button
                type="submit"
                className={
                  "btn mt-2 w-full btn-primary" + (loading ? " loading" : "")
                }
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
