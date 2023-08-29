import { themeChange } from "theme-change";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import BellIcon from "@heroicons/react/24/outline/BellIcon";
import Bars3Icon from "@heroicons/react/24/outline/Bars3Icon";
import MoonIcon from "@heroicons/react/24/outline/MoonIcon";
import SunIcon from "@heroicons/react/24/outline/SunIcon";
import { openRightDrawer } from "../features/common/rightDrawerSlice";
import { RIGHT_DRAWER_TYPES } from "../utils/globalConstantUtil";

import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import { logoutRedux } from "../app/slices/authSlice";
import { useGetUserByIdQuery, useUpdateUserMutation } from "../app/service/api";
import socket from "../utils/socket";

function Header() {
  const [isOnline, setIsOnline] = useState(true);

  const { user: reduxUser } = useSelector((state) => state.auth);
  const { data: user, isLoading } = useGetUserByIdQuery({
    id: reduxUser?.uid,
  });
  const [updateUser] = useUpdateUserMutation();

  const dispatch = useDispatch();
  const { noOfNotifications, pageTitle } = useSelector((state) => state.header);
  const [currentTheme, setCurrentTheme] = useState(
    localStorage.getItem("theme")
  );

  useEffect(() => {
    themeChange(false);
    if (currentTheme === null) {
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        setCurrentTheme("dark");
      } else {
        setCurrentTheme("light");
      }
    }
  }, []);

  const openNotification = () => {
    dispatch(
      openRightDrawer({
        header: "Notifications",
        bodyType: RIGHT_DRAWER_TYPES.NOTIFICATION,
      })
    );
  };

  function logoutUser() {
    signOut(auth).then(() => {
      window.location.href = "/login";
      dispatch(logoutRedux());
    });
  }

  useEffect(() => {
    if (!user) return;
    if (user.role === "driver") {
      socket.emit("add-driver", {
        name: user.firstName,
        phoneNumber: user.phoneNumber,
        online: isOnline,
        location: user.location,
      });
    }
    if (user.role === "customer") {
      socket.emit("add-customer", {
        name: user.firstName,
        phoneNumber: user.phoneNumber,
      });
    }
  }, [isOnline, user]);

  useEffect(() => {
    let locationUpdateInterval;

    const updateLocation = () => {
      if (!user) return;
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const updatedLat = position.coords.latitude;
          const updatedLng = position.coords.longitude;

          updateUser({
            id: user._id,
            lat: updatedLat,
            lng: updatedLng,
          });
          console.log(updatedLat, updatedLng);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    };

    if (isOnline && user?.role === "driver") {
      updateLocation();
      locationUpdateInterval = setInterval(updateLocation, 10000);
    } else {
      clearInterval(locationUpdateInterval);
    }

    return () => clearInterval(locationUpdateInterval);
  }, [isOnline, user, updateUser]);

  if (isLoading && !user) {
    return document.body.classList.add("loading-indicator");
  }
  if (!isLoading && user) {
    document.body.classList.remove("loading-indicator");
    return (
      <>
        <div className="navbar  flex justify-between bg-base-100  z-10 shadow-md ">
          <div className="">
            <label
              htmlFor="left-sidebar-drawer"
              className="btn btn-primary drawer-button lg:hidden"
            >
              <Bars3Icon className="h-5 inline-block w-5" />
            </label>
            <h1 className="text-2xl font-semibold ml-2">{pageTitle}</h1>
          </div>

          <div className="order-last">
            {user.role === "driver" && (
              <button
                className={`rounded-full w-14 h-6 ${
                  isOnline ? "bg-green-500" : "bg-gray-300"
                }`}
                onClick={() => {
                  setIsOnline(!isOnline);
                }}
              >
                <span
                  className={`block w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    isOnline
                      ? "translate-x-8 bg-white"
                      : "translate-x-0 bg-gray-500"
                  }`}
                />
              </button>
            )}
            <label className="swap ">
              <input type="checkbox" />
              <SunIcon
                data-set-theme="light"
                data-act-class="ACTIVECLASS"
                className={
                  "fill-current w-6 h-6 " +
                  (currentTheme === "dark" ? "swap-on" : "swap-off")
                }
                onClick={() => {
                  window.dispatchEvent(new Event("storage"));
                }}
              />
              <MoonIcon
                data-set-theme="dark"
                data-act-class="ACTIVECLASS"
                className={
                  "fill-current w-6 h-6 " +
                  (currentTheme === "light" ? "swap-on" : "swap-off")
                }
                onClick={() => {
                  window.dispatchEvent(new Event("storage"));
                }}
              />
            </label>

            {/* Notification icon */}
            <button
              className="btn btn-ghost ml-4  btn-circle"
              onClick={() => openNotification()}
            >
              <div className="indicator">
                <BellIcon className="h-6 w-6" />
                {noOfNotifications > 0 ? (
                  <span className="indicator-item badge badge-secondary badge-sm">
                    {noOfNotifications}
                  </span>
                ) : null}
              </div>
            </button>

            {/* Profile icon, opening menu on click */}
            <div className="dropdown dropdown-end ml-4">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img src="https://placeimg.com/80/80/people" alt="profile" />
                </div>
              </label>
              <ul
                tabIndex={0}
                className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li className="justify-between">
                  <Link to={"/admin/settings-profile"}>
                    Profile Settings
                    <span className="badge">New</span>
                  </Link>
                </li>
                <li className="">
                  <Link to={"/admin/settings-billing"}>Bill History</Link>
                </li>
                <div className="divider mt-0 mb-0"></div>
                <li>
                  <a onClick={logoutUser}>Logout</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Header;
