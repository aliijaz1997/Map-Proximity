import React, { lazy, useEffect } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { themeChange } from "theme-change";
import initializeApp from "./app/init";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "./utils/firebase";
import { addUserRedux, loginRedux } from "./app/slices/authSlice";
import { useGetUserByIdQuery } from "./app/service/api";

// Importing pages
const Layout = lazy(() => import("./containers/Layout"));
const Login = lazy(() => import("./pages/Login"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));

// Initializing different libraries
initializeApp();

function App() {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);
  const { data: dataBaseUser } = useGetUserByIdQuery({
    id: user?.uid,
  });

  useEffect(() => {
    themeChange(false);
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        user.getIdToken().then((token) => {
          dispatch(loginRedux(token));
          dispatch(addUserRedux(user));
        });
      }
    });

    return unsubscribe;
  }, []);

  if (token && !dataBaseUser)
    return document.body.classList.add("loading-indicator");

  if (token && dataBaseUser)
    document.body.classList.remove("loading-indicator");

  return (
    <>
      <Router>
        <Routes>
          {token ? (
            <Route path="/*" element={<Layout />} />
          ) : (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
            </>
          )}
        </Routes>
      </Router>
    </>
  );
}

export default App;
