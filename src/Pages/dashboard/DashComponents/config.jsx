import UsersIcon from "@heroicons/react/24/solid/UsersIcon";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AddAlertIcon from "@mui/icons-material/AddAlert";
import MapIcon from "@mui/icons-material/Map";
import { SvgIcon } from "@mui/material";
import React from "react";
import { QuestionAnswerTwoTone } from "@mui/icons-material";
import { HomeIcon } from "@heroicons/react/24/solid";
import { InformationCircleIcon } from "@heroicons/react/24/solid";

export const items = [
  {
    title: "Home",
    path: "/",
    icon: (
      <SvgIcon fontSize="small">
        <HomeIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Users",
    path: "/users",
    icon: (
      <SvgIcon fontSize="small">
        <UsersIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Events",
    path: "/events",
    icon: (
      <SvgIcon fontSize="small">
        <CalendarMonthIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Notifications",
    path: "/notifications",
    icon: (
      <SvgIcon fontSize="small">
        <AddAlertIcon />
      </SvgIcon>
    ),
  },
  {
    title: "Points of Interest",
    path: "/points-of-interest",
    icon: (
      <SvgIcon fontSize="small">
        <MapIcon />
      </SvgIcon>
    ),
  },
  {
    title: "About",
    path: "/about",
    icon: (
      <SvgIcon fontSize="small">
        <InformationCircleIcon />
      </SvgIcon>
    ),
  },
  {
    title: "FAQ",
    path: "/faq",
    icon: (
      <SvgIcon fontSize="small">
        <QuestionAnswerTwoTone />
      </SvgIcon>
    ),
  },
];
