import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import ForgotPassword from "./Pages/auth/ForgotPassword";
import Signin from "./Pages/auth/SignIn";
import EventEditor from "./Pages/dashboard/MainComponents/EventEditor";
import EditEvent from "./Pages/dashboard/EventComponents/EditEvent";
import CreateEvent from "./Pages/dashboard/EventComponents/CreateEvent";
import DeleteEvent from "./Pages/dashboard/EventComponents/DeleteEvent";
import POIEditor from "./Pages/dashboard/MainComponents/POIEditor";
import EditPOI from "./Pages/dashboard/POIComponents/EditPOI";
import CreatePOI from "./Pages/dashboard/POIComponents/CreatePOI";
import NotificationEditor from "./Pages/dashboard/MainComponents/NotificationEditor";
import CreateNotification from "./Pages/dashboard/NotificationComponents/CreateNotification";
import EditNotification from "./Pages/dashboard/NotificationComponents/EditNotification";
import Layout from "./Pages/dashboard/MainComponents/Layout"; 


 const theme = createTheme({
    palette: {
      primary: {
        main: "#005588",
      },
      secondary: {
        main: "#FFB238",
      },
    },
  });


ReactDOM.createRoot(document.getElementById("root")).render(
    <ThemeProvider theme={theme}>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Signin />} />
                <Route path="/forgotPassword" element={<ForgotPassword />} />
                <Route path="/eventEditor" element={<EventEditor />} />
                <Route path="/editEvent" element={<EditEvent />} />
                <Route path="/deleteEvent" element={<DeleteEvent />} />
                <Route path="/createEvent" element={<CreateEvent />} />
                <Route path="/poiEditor" element={<POIEditor />} />
                <Route path="/editPOI" element={<EditPOI />} />
                <Route path="/createPOI" element={<CreatePOI />} />
                <Route path="/notificationEditor" element={<NotificationEditor />} />
                <Route path="/createNotification" element={<CreateNotification />} />
                <Route path="/editNotification" element={<EditNotification />} />
                <Route path="/dashLayout" element={<Layout />} />
            </Routes>
        </BrowserRouter>
    </ThemeProvider>,
);
