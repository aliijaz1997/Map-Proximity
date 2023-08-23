/** Icons are imported separatly to reduce build time */
import Squares2X2Icon from "@heroicons/react/24/outline/Squares2X2Icon";
import UserIcon from "@heroicons/react/24/outline/UserIcon";
import Cog6ToothIcon from "@heroicons/react/24/outline/Cog6ToothIcon";
import TruckIcon from "@heroicons/react/24/outline/TruckIcon";
import CustomersIcon from "@heroicons/react/24/outline/UserGroupIcon";
import UsersIcon from "@heroicons/react/24/outline/UsersIcon";
import ServiceIcon from "@heroicons/react/24/outline/ServerIcon";
import CircleStackIcon from "@heroicons/react/24/outline/CircleStackIcon";

const iconClasses = `h-6 w-6`;
const submenuIconClasses = `h-5 w-5`;

const routes = [
  {
    path: "/dashboard",
    icon: <Squares2X2Icon className={iconClasses} />,
    name: "Dashboard",
  },
  {
    path: "/users", // url
    icon: <UsersIcon className={iconClasses} />, // icon component
    name: "Users", // name that appear in Sidebar
  },
  {
    path: "/customers", // url
    icon: <CustomersIcon className={iconClasses} />, // icon component
    name: "Customers", // name that appear in Sidebar
  },
  {
    path: "/drivers", // url
    icon: <TruckIcon className={iconClasses} />, // icon component
    name: "Drivers", // name that appear in Sidebar
  },
  {
    path: "/service", // url
    icon: <ServiceIcon className={iconClasses} />, // icon component
    name: "Service Area", // name that appear in Sidebar
  },
  {
    path: "/rides", // url
    icon: <CircleStackIcon className={iconClasses} />, // icon component
    name: "Rides Data", // name that appear in Sidebar
  },
  {
    path: "", //no url needed as this has submenu
    icon: <Cog6ToothIcon className={`${iconClasses} inline`} />, // icon component
    name: "Settings", // name that appear in Sidebar
    submenu: [
      {
        path: "/settings-profile", //url
        icon: <UserIcon className={submenuIconClasses} />, // icon component
        name: "Profile", // name that appear in Sidebar
      },
    ],
  },
];

export default routes;
