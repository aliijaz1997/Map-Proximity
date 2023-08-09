/** Icons are imported separatly to reduce build time */
import Squares2X2Icon from "@heroicons/react/24/outline/Squares2X2Icon";
import TruckIcon from "@heroicons/react/24/outline/TruckIcon";

const iconClasses = `h-6 w-6`;
const submenuIconClasses = `h-5 w-5`;

const routes = [
  {
    path: "/dashboard",
    icon: <Squares2X2Icon className={iconClasses} />,
    name: "Dashboard",
  },
  {
    path: "/customer", // url
    icon: <TruckIcon className={iconClasses} />, // icon component
    name: "Book a Ride", // name that appear in Sidebar
  },
];

export default routes;
