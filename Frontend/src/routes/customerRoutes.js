// All components mapping with path for internal routes

import { lazy } from "react";

const Dashboard = lazy(() => import("../pages/protected/CustomerDashboard"));
const Customers = lazy(() => import("../pages/protected/ClientCustomer"));

const routes = [
  {
    path: "/dashboard", // the url
    component: Dashboard, // view rendered
  },
  {
    path: "/customer",
    component: Customers,
  },
];

export default routes;
