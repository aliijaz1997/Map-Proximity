import { themeChange } from "theme-change";
import React, { useEffect, useRef, useState } from "react";
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
import { changeDriverStatus } from "../app/slices/presenceChannelSlice";
import { PusherInstance } from "../utils/pusher/default";

function Header() {
  const { user: reduxUser } = useSelector((state) => state.auth);
  const { data: user, isLoading } = useGetUserByIdQuery({
    id: reduxUser?.uid,
  });
  const [driverStatus, setDriverStatus] = useState(user?.driverStatus);
  const [updateUser] = useUpdateUserMutation();

  const dispatch = useDispatch();
  const { noOfNotifications, pageTitle } = useSelector((state) => state.header);
  const [currentTheme, setCurrentTheme] = useState(
    localStorage.getItem("theme")
  );

  const channelRef = useRef();

  useEffect(() => {
    if (!user && !channelRef.current) return;
    const driverChannel = PusherInstance({ user_id: user._id }).subscribe(
      "presence-ride"
    );
    channelRef.current = driverChannel;
    driverChannel.bind(`client-status-change-request`, ({ id, status }) => {
      updateUser({ id, driverStatus: status });
      dispatch(changeDriverStatus({ id, status }));
      setDriverStatus(status);
    });
  }, [user]);
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
                  driverStatus === "online" || driverStatus === "engaged"
                    ? "bg-green-500"
                    : "bg-gray-300"
                }`}
                onClick={() => {
                  if (!user && !channelRef.current) {
                    return;
                  }
                  if (user.driverStatus === "online") {
                    channelRef.current.trigger(`client-status-change-request`, {
                      id: user._id,
                      status: "offline",
                    });
                  } else {
                    channelRef.current.trigger(`client-status-change-request`, {
                      id: user._id,
                      status: "online",
                    });
                  }
                }}
                disabled={driverStatus === "engaged"}
              >
                <span
                  className={`block w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    driverStatus === "online" || driverStatus === "engaged"
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
