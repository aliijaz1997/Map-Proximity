// All components mapping with path for internal routes

import { lazy } from "react";

const Dashboard = lazy(() => import("../pages/protected/Dashboard"));
const Page404 = lazy(() => import("../pages/protected/404"));
const Blank = lazy(() => import("../pages/protected/Blank"));
const Customers = lazy(() => import("../pages/protected/Customers"));
const Drivers = lazy(() => import("../pages/protected/Drivers"));
const Users = lazy(() => import("../pages/protected/Users"));
const Service = lazy(() => import("../pages/protected/Service"));
const Rides = lazy(() => import("../pages/protected/Rides"));
const ProfileSettings = lazy(() =>
  import("../pages/protected/ProfileSettings")
);

const routes = [
  {
    path: "/dashboard", // the url
    component: Dashboard, // view rendered
  },
  {
    path: "/users",
    component: Users,
  },
  {
    path: "/customers",
    component: Customers,
  },
  {
    path: "/drivers",
    component: Drivers,
  },
  {
    path: "/service",
    component: Service,
  },
  {
    path: "/rides",
    component: Rides,
  },
  {
    path: "/settings-profile",
    component: ProfileSettings,
  },
  {
    path: "/404",
    component: Page404,
  },
  {
    path: "/blank",
    component: Blank,
  },
];

export default routes;
