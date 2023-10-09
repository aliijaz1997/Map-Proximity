// All components mapping with path for internal routes

import { lazy } from "react";

const Dashboard = lazy(() => import("../pages/protected/CustomerDashboard"));
const Customers = lazy(() => import("../pages/protected/ClientCustomer"));
const Payment = lazy(() => import("../pages/protected/CustomerPayments"));

const routes = [
  {
    path: "/dashboard", // the url
    component: Dashboard, // view rendered
  },
  {
    path: "/customer",
    component: Customers,
  },
  {
    path: "/payment",
    component: Payment,
  },
];

export default routes;
