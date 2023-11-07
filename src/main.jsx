import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import ForgotPassword from "./Pages/auth/ForgotPassword";
import Signin from "./Pages/auth/SignIn";
import Dash from "./Pages/dashboard/Dash";   



ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>

        <Routes >
            <Route path="/" element={<Signin />} />
            <Route path="/dash" element={<Dash />} />
            <Route path="/forgotPassword" element={<ForgotPassword />} />
        </Routes>
    </BrowserRouter>,
);
