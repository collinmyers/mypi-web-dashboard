import React from "react";
import "./index.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import PrivateRoute from "./components/PrivateRoute";
import Signin from "./Pages/auth/SignIn";
import ForgotPassword from "./Pages/auth/ForgotPassword";
import Home from "./Pages/dashboard/MainComponents/Home";
import EventEditor from "./Pages/dashboard/MainComponents/EventEditor";
import CreateEvent from "./Pages/dashboard/EventComponents/CreateEvent";
import EditEvent from "./Pages/dashboard/EventComponents/EditEvent";
import POIEditor from "./Pages/dashboard/MainComponents/POIEditor";
import CreatePOI from "./Pages/dashboard/POIComponents/CreatePOI";
import EditPOI from "./Pages/dashboard/POIComponents/EditPOI";
import NotificationEditor from "./Pages/dashboard/MainComponents/NotificationEditor";
import CreateNotification from "./Pages/dashboard/NotificationComponents/CreateNotification";
import EditNotification from "./Pages/dashboard/NotificationComponents/EditNotification";
import UserEditor from "./Pages/dashboard/MainComponents/UserEditor";
import EditUser from "./Pages/dashboard/UserComponents/EditUser";
import ParkInfo from "./Pages/dashboard/MainComponents/ParkInfo";
import FAQ from "./Pages/dashboard/MainComponents/FAQ";
import EditFAQ from "./Pages/dashboard/FAQComponents/EditFAQ";
import CreateFAQ from "./Pages/dashboard/FAQComponents/CreateFAQ";
import VendorPOITable from "./Pages/dashboard/VendorPOI/VendorPOITable";
import CreateVendorPOI from "./Pages/dashboard/VendorPOI/CreateVendorPOI";
import EditVendorPOI from "./Pages/dashboard/VendorPOI/EditVendorPOI";
import { useAuth } from "./components/AuthContext";
export default function App() {

    const { isSignedIn } = useAuth();

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

    return (
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={isSignedIn === true ? <Home /> : <Signin />} />
                    <Route path="/forgotPassword" element={<ForgotPassword />} />

                    <Route element={<PrivateRoute allowedRoles="ManageEvents" />}>
                        <Route path="/events" element={<EventEditor />} />
                        <Route path="/create-event" element={<CreateEvent />} />
                        <Route path="/edit-event" element={<EditEvent />} />
                    </Route>

                    <Route element={<PrivateRoute allowedRoles="ManagePoints" />}>
                        <Route path="/points-of-interest" element={<POIEditor />} />
                        <Route path="/create-point-of-interest" element={<CreatePOI />} />
                        <Route path="/edit-point-of-interest" element={<EditPOI />} />
                    </Route>


                    <Route element={<PrivateRoute allowedRoles="ManageNotifications" />}>
                        <Route path="/notifications" element={<NotificationEditor />} />
                        <Route path="/create-notification" element={<CreateNotification />} />
                        <Route path="/edit-notification" element={<EditNotification />} />
                    </Route>

                    <Route element={<PrivateRoute allowedRoles="ManageUsers" />}>
                        <Route path="/users" element={<UserEditor />} />
                        <Route path="/edit-user" element={<EditUser />} />
                    </Route>

                    <Route element={<PrivateRoute allowedRoles="ManageAbout" />}>
                        <Route path="/about" element={<ParkInfo />} />
                    </Route>

                    <Route element={<PrivateRoute allowedRoles="ManageFaq" />}>
                        <Route path="/faq" element={<FAQ />} />
                        <Route path="/edit-faq" element={<EditFAQ />} />
                        <Route path="/create-faq" element={<CreateFAQ />} />
                    </Route>

                    <Route element={<PrivateRoute allowedRoles="ManagePoints" />}>
                        <Route path="/vendor-points-of-interest" element={<VendorPOITable />} />
                        <Route path="/create-vendor-point-of-interest" element={<CreateVendorPOI />} />
                        <Route path="/edit-vendor-point-of-interest" element={<EditVendorPOI />} />
                    </Route>

                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}