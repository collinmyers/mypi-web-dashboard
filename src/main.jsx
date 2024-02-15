import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import ForgotPassword from "./Pages/auth/ForgotPassword";
import Signin from "./Pages/auth/SignIn";
import Dash from "./Pages/dashboard/MainComponents/Dash";   
import EventEditor from "./Pages/dashboard/MainComponents/EventEditor";
import EditEvent from "./Pages/dashboard/EventComponents/EditEvent";
import CreateEvent from "./Pages/dashboard/EventComponents/CreateEvent";
import DeleteEvent from "./Pages/dashboard/EventComponents/DeleteEvent";
import POIEditor from "./Pages/dashboard/MainComponents/POIEditor";
import EditPOI from "./Pages/dashboard/POIComponents/EditPOI";
import CreatePOI from "./Pages/dashboard/POIComponents/CreatePOI";



ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <Routes >
            <Route path="/" element={<Signin />} />
            <Route path="/dash" element={<Dash />} />
            <Route path="/forgotPassword" element={<ForgotPassword />} />
            <Route path="/eventEditor" element={<EventEditor/>} />
            <Route path="/editEvent" element={<EditEvent/>} />
            <Route path="/deleteEvent" element={<DeleteEvent/>} />
            <Route path="/createEvent" element={<CreateEvent/>} />
            <Route path="/poiEditor" element={<POIEditor/>} />
            <Route path = "/editPOI" element={<EditPOI/>}/>
            <Route path = "/createPOI" element={<CreatePOI/>}/>



        </Routes>
    </BrowserRouter>,
);
