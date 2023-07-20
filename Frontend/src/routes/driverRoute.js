// All components mapping with path for internal routes

import { lazy } from "react";

const Dashboard = lazy(() => import("../pages/protected/DriverDashboard"));
const Customers = lazy(() => import("../pages/protected/ClientCustomer"));
const Drivers = lazy(() => import("../pages/protected/ClientDriver"));

const routes = [
  {
    path: "/dashboard", // the url
    component: Dashboard, // view rendered
  },
  {
    path: "/driver",
    component: Drivers,
  },
];

export default routes;
