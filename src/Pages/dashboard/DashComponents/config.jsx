import ChartBarIcon from "@heroicons/react/24/solid/ChartBarIcon";
import CogIcon from "@heroicons/react/24/solid/CogIcon";
import LockClosedIcon from "@heroicons/react/24/solid/LockClosedIcon";
import ShoppingBagIcon from "@heroicons/react/24/solid/ShoppingBagIcon";
import UserIcon from "@heroicons/react/24/solid/UserIcon";
import UserPlusIcon from "@heroicons/react/24/solid/UserPlusIcon";
import UsersIcon from "@heroicons/react/24/solid/UsersIcon";
import XCircleIcon from "@heroicons/react/24/solid/XCircleIcon";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AddAlertIcon from '@mui/icons-material/AddAlert';
import MapIcon from '@mui/icons-material/Map';
import { SvgIcon } from "@mui/material";

export const items = [
  {
    title: "Overview",
    path: "/",
    icon: (
      <SvgIcon fontSize="small">
        <ChartBarIcon />
      </SvgIcon>
    )
  },
  {
    title: "Users",
    path: "/users",
    icon: (
      <SvgIcon fontSize="small">
        <UsersIcon />
      </SvgIcon>
    )
  },
  {
    title: "Events",
    path: "/eventEditor",
    icon: (
      <SvgIcon fontSize="small">
        <CalendarMonthIcon />
      </SvgIcon>
    )
  },
  {
    title: "Notifications",
    path: "/notificationEditor",
    icon: (
      <SvgIcon fontSize="small">
        <AddAlertIcon />
      </SvgIcon>
    )
  },
  {
    title: "Points of Intrest",
    path: "/poiEditor",
    icon: (
      <SvgIcon fontSize="small">
        <MapIcon />
      </SvgIcon>
    )
  },
 

 
];
