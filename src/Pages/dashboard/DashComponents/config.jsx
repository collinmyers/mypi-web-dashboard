import ChartBarIcon from "@heroicons/react/24/solid/ChartBarIcon";
import UsersIcon from "@heroicons/react/24/solid/UsersIcon";
import XCircleIcon from "@heroicons/react/24/solid/XCircleIcon";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AddAlertIcon from "@mui/icons-material/AddAlert";
import MapIcon from "@mui/icons-material/Map";
import { SvgIcon } from "@mui/material";
import React from "react";

export const items = [
  {
    title: "Overview",
    path: "/overview",
    icon: (
      <SvgIcon fontSize="small">
        <ChartBarIcon />
      </SvgIcon>
    )
  },
  {
    title: "Users",
    path: "/userEditor",
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
    title: "Points of Interest",
    path: "/poiEditor",
    icon: (
      <SvgIcon fontSize="small">
        <MapIcon />
      </SvgIcon>
    )
  },

];
