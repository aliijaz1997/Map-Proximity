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
import { loginRedux } from "./app/slices/authSlice";

// Importing pages
const Layout = lazy(() => import("./containers/Layout"));
const Login = lazy(() => import("./pages/Login"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));

// Initializing different libraries
initializeApp();

function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  useEffect(() => {
    themeChange(false);
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        user.getIdToken().then((token) => {
          dispatch(loginRedux(token));
        });
      }
    });

    return unsubscribe;
  }, []);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Place new routes over this */}
          <Route path="/admin/*" element={<Layout />} />

          <Route
            path="*"
            element={
              <Navigate to={token ? "/admin/dashboard" : "/login"} replace />
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
