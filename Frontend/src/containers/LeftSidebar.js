import routes from "../routes/sidebar";
import customerSideBar from "../routes/customerSideBar";
import driverSideBar from "../routes/driverSideBar";
import { NavLink, Routes, Link, useLocation } from "react-router-dom";
import SidebarSubmenu from "./SidebarSubmenu";
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";
import { useDispatch, useSelector } from "react-redux";
import { useGetUserByIdQuery } from "../app/service/api";

function LeftSidebar() {
  const { user } = useSelector((state) => state.auth);
  const { data: dataBaseUser } = useGetUserByIdQuery({
    id: user?.uid,
  });

  const location = useLocation();

  const close = (e) => {
    document.getElementById("left-sidebar-drawer").click();
  };

  return (
    <div className="drawer-side ">
      <label htmlFor="left-sidebar-drawer" className="drawer-overlay"></label>
      <ul className="menu  pt-2 w-72 bg-base-100 text-base-content">
        <button
          className="btn btn-ghost bg-base-300  btn-circle z-50 top-0 right-0 mt-4 mr-2 absolute lg:hidden"
          onClick={() => close()}
        >
          <XMarkIcon className="h-5 inline-block w-5" />
        </button>

        <li className="mb-2 font-semibold text-xl">
          <Link to={"/admin/dashboard"}>
            <img
              className="mask mask-squircle w-10"
              src="/logo192.jpg"
              alt="DashWind Logo"
            />
            Map Proximity
          </Link>{" "}
        </li>
        {dataBaseUser?.role === "admin"
          ? routes.map((route, k) => {
              return (
                <li className="" key={k}>
                  {route.submenu ? (
                    <SidebarSubmenu {...route} />
                  ) : (
                    <NavLink
                      end
                      to={route.path}
                      className={({ isActive }) =>
                        `${
                          isActive
                            ? "font-semibold  bg-base-200 "
                            : "font-normal"
                        }`
                      }
                    >
                      {route.icon} {route.name}
                      {location.pathname === route.path ? (
                        <span
                          className="absolute inset-y-0 left-0 w-1 rounded-tr-md rounded-br-md bg-primary "
                          aria-hidden="true"
                        ></span>
                      ) : null}
                    </NavLink>
                  )}
                </li>
              );
            })
          : dataBaseUser?.role === "customer"
          ? customerSideBar.map((route, k) => {
              return (
                <li className="" key={k}>
                  {route.submenu ? (
                    <SidebarSubmenu {...route} />
                  ) : (
                    <NavLink
                      end
                      to={route.path}
                      className={({ isActive }) =>
                        `${
                          isActive
                            ? "font-semibold  bg-base-200 "
                            : "font-normal"
                        }`
                      }
                    >
                      {route.icon} {route.name}
                      {location.pathname === route.path ? (
                        <span
                          className="absolute inset-y-0 left-0 w-1 rounded-tr-md rounded-br-md bg-primary "
                          aria-hidden="true"
                        ></span>
                      ) : null}
                    </NavLink>
                  )}
                </li>
              );
            })
          : driverSideBar.map((route, k) => {
              return (
                <li className="" key={k}>
                  {route.submenu ? (
                    <SidebarSubmenu {...route} />
                  ) : (
                    <NavLink
                      end
                      to={route.path}
                      className={({ isActive }) =>
                        `${
                          isActive
                            ? "font-semibold  bg-base-200 "
                            : "font-normal"
                        }`
                      }
                    >
                      {route.icon} {route.name}
                      {location.pathname === route.path ? (
                        <span
                          className="absolute inset-y-0 left-0 w-1 rounded-tr-md rounded-br-md bg-primary "
                          aria-hidden="true"
                        ></span>
                      ) : null}
                    </NavLink>
                  )}
                </li>
              );
            })}
      </ul>
    </div>
  );
}

export default LeftSidebar;
