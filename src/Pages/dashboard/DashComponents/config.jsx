import UsersIcon from "@heroicons/react/24/solid/UsersIcon";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AddAlertIcon from "@mui/icons-material/AddAlert";
import MapIcon from "@mui/icons-material/Map";
import { SvgIcon } from "@mui/material";
import React from "react";
import { QuestionAnswerTwoTone } from "@mui/icons-material";
import { HomeIcon } from "@heroicons/react/24/solid";
import { InformationCircleIcon } from "@heroicons/react/24/solid";

// Show content of side menu based on permissions
export const items = [
  {
    title: "Home",
    path: "/",
    icon: (
      <SvgIcon fontSize="small">
        <HomeIcon />
      </SvgIcon>
    ),
    permissions: ["PrivilegedUser"]
  },
  {
    title: "Users",
    path: "/users",
    icon: (
      <SvgIcon fontSize="small">
        <UsersIcon />
      </SvgIcon>
    ),
    permissions: ["ManageUsers"]
  },
  {
    title: "Events",
    path: "/events",
    icon: (
      <SvgIcon fontSize="small">
        <CalendarMonthIcon />
      </SvgIcon>
    ),
    permissions:["ManageEvents"]
  },
  {
    title: "Notifications",
    path: "/notifications",
    icon: (
      <SvgIcon fontSize="small">
        <AddAlertIcon />
      </SvgIcon>
    ),
    permissions: ["ManageNotifications"]
  },
  {
    title: "Points of Interest",
    path: "/points-of-interest",
    icon: (
      <SvgIcon fontSize="small">
        <MapIcon />
      </SvgIcon>
    ),
    permissions: ["ManagePoints"]
  },
  {
    title: "Vendor Locations",
    path: "/vendor-points-of-interest",
    icon: (
      <SvgIcon fontSize="small">
        <MapIcon />
      </SvgIcon>
    ),
    permissions: ["ManagePoints"]
  },
  {
    title: "About",
    path: "/about",
    icon: (
      <SvgIcon fontSize="small">
        <InformationCircleIcon />
      </SvgIcon>
    ),
    permissions: ["ManageAbout"]
  },
  {
    title: "FAQ",
    path: "/faq",
    icon: (
      <SvgIcon fontSize="small">
        <QuestionAnswerTwoTone />
      </SvgIcon>
    ),
    permissions: ["ManageFaq"]
  },
];
