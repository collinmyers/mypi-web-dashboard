import React, { useEffect, useState } from "react";
import { account } from "./utils/AppwriteConfig";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import PrivateRoute from "./components/PrivateRoute";
import ForgotPassword from "./Pages/auth/ForgotPassword";
import Signin from "./Pages/auth/SignIn";
import EventEditor from "./Pages/dashboard/MainComponents/EventEditor";
import EditEvent from "./Pages/dashboard/EventComponents/EditEvent";
import CreateEvent from "./Pages/dashboard/EventComponents/CreateEvent";
import POIEditor from "./Pages/dashboard/MainComponents/POIEditor";
import EditPOI from "./Pages/dashboard/POIComponents/EditPOI";
import CreatePOI from "./Pages/dashboard/POIComponents/CreatePOI";
import NotificationEditor from "./Pages/dashboard/MainComponents/NotificationEditor";
import CreateNotification from "./Pages/dashboard/NotificationComponents/CreateNotification";
import EditNotification from "./Pages/dashboard/NotificationComponents/EditNotification";
import UserEditor from "./Pages/dashboard/MainComponents/UserEditor";
import Overview from "./Pages/dashboard/MainComponents/Overview";
import ParkInfo from "./Pages/dashboard/MainComponents/ParkInfo";
import FAQ from "./Pages/dashboard/MainComponents/FAQ";
import EditUser from "./Pages/dashboard/UserComponents/EditUser";

export default function App() {
    const [signInState, setSignInState] = useState(false);

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

    const isUserSignedIn = async () => {
        try {
            await account.get().then((response) => {
                // if (response.labels.includes("PrivilegedUser")) {
                //     return true;
                // }
                return true;
            }).catch(() => { console.log("some error"); });
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    useEffect(() => {
        const checkAuthState = async () => {
            setSignInState(await isUserSignedIn());
        };
        checkAuthState().then(() => console.log(signInState));

    }, [signInState]);

    // if (isSigned)

    return (
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={signInState ? <Overview /> : <Signin />} />
                    <Route path="/forgotPassword" element={<ForgotPassword />} />

                    <Route element={<PrivateRoute allowedRoles="ManageEvents" />}>
                        <Route path="/events" element={<EventEditor />} />
                        <Route path="/create-event" element={<CreateEvent />} />
                        <Route path="/edit-event" element={<EditEvent />} />
                    </Route>

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


                    <Route element={<PrivateRoute allowedRoles="ManagePoints" />}>
                        <Route path="/notifications" element={<NotificationEditor />} />
                        <Route path="/create-notification" element={<CreateNotification />} />
                        <Route path="/edit-notification" element={<EditNotification />} />
                    </Route>


                    <Route element={<PrivateRoute allowedRoles="ManageUsers" />}>
                        <Route path="/users" element={<UserEditor />} />
                        <Route path="/edit-user" element={<EditUser />} />
                    </Route>


                    <Route element={<PrivateRoute allowedRoles="ManageParkInfo" />}>
                        <Route path="/park-info" element={<ParkInfo />} />
                    </Route>


                    <Route element={<PrivateRoute allowedRoles="ManageFaq" />}>
                        <Route path="/faq" element={<FAQ />} />
                    </Route>

                    <Route path="/editFAQ" element={<EditFAQ />} />
                    <Route path="/createFAQ" element={<CreateFAQ />} />

                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}