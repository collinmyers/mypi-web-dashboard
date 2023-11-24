import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";


import ForgotPassword from "./Pages/auth/ForgotPassword";
import Signin from "./Pages/auth/SignIn";
import Dash from "./Pages/dashboard/Dash";   
import EventsEditor from "./Pages/dashboard/EventsEdit";
import EditEvent from "./Pages/dashboard/EventComponents/EditEvent";
import CreateEvent from "./Pages/dashboard/EventComponents/CreateEvent";
import DeleteEvent from "./Pages/dashboard/EventComponents/DeleteEvent";



ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <Routes >
            <Route path="/" element={<Signin />} />
            <Route path="/dash" element={<Dash />} />
            <Route path="/forgotPassword" element={<ForgotPassword />} />
            <Route path="/events" element={<EventsEditor/>} />
            <Route path="/editEvent" element={<EditEvent/>} />
            <Route path="/deleteEvent" element={<DeleteEvent/>} />
            <Route path="/createEvent" element={<CreateEvent/>} />

        </Routes>
    </BrowserRouter>,
);
