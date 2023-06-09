/** Icons are imported separatly to reduce build time */
import Squares2X2Icon from "@heroicons/react/24/outline/Squares2X2Icon";
import UserIcon from "@heroicons/react/24/outline/UserIcon";
import Cog6ToothIcon from "@heroicons/react/24/outline/Cog6ToothIcon";
import TruckIcon from "@heroicons/react/24/outline/TruckIcon";
import CustomersIcon from "@heroicons/react/24/outline/UserGroupIcon";
import UsersIcon from "@heroicons/react/24/outline/UsersIcon";

const iconClasses = `h-6 w-6`;
const submenuIconClasses = `h-5 w-5`;

const routes = [
  {
    path: "/admin/dashboard",
    icon: <Squares2X2Icon className={iconClasses} />,
    name: "Dashboard",
  },
  {
    path: "/admin/users", // url
    icon: <UsersIcon className={iconClasses} />, // icon component
    name: "Users", // name that appear in Sidebar
  },
  {
    path: "/admin/customers", // url
    icon: <CustomersIcon className={iconClasses} />, // icon component
    name: "Customers", // name that appear in Sidebar
  },
  {
    path: "/admin/drivers", // url
    icon: <TruckIcon className={iconClasses} />, // icon component
    name: "Drivers", // name that appear in Sidebar
  },
  {
    path: "", //no url needed as this has submenu
    icon: <Cog6ToothIcon className={`${iconClasses} inline`} />, // icon component
    name: "Settings", // name that appear in Sidebar
    submenu: [
      {
        path: "/admin/settings-profile", //url
        icon: <UserIcon className={submenuIconClasses} />, // icon component
        name: "Profile", // name that appear in Sidebar
      },
    ],
  },
];

export default routes;
