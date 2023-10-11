// All components mapping with path for internal routes

import { lazy } from "react";

const Dashboard = lazy(() => import("../pages/protected/DriverDashboard"));
const Drivers = lazy(() => import("../pages/protected/ClientDriver"));
const DriverPayment = lazy(() => import("../pages/protected/DriverPayment"));
const DriverPaymentHistory = lazy(() =>
  import("../pages/protected/DriverPaymentHistory")
);

const routes = [
  {
    path: "/dashboard", // the url
    component: Dashboard, // view rendered
  },
  {
    path: "/driver",
    component: Drivers,
  },
  {
    path: "/payment",
    component: DriverPayment,
  },
  {
    path: "/history",
    component: DriverPaymentHistory,
  },
];

export default routes;
