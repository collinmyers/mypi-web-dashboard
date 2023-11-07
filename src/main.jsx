import React from "react";
import ReactDOM from "react-dom/client";
import Dash from "../src/Dashboard.jsx";
import Signin from "../src/auth/SignIn.jsx";
import "./index.css";
import { BrowserRouter,Route, Routes} from "react-router-dom";
import ForgotPassword from "../src/auth/ForgotPassword.jsx";


ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
  
    <Routes >
      <Route path="/" element={<Signin/>} />
       <Route path="/dash" element={<Dash/>} />
       <Route path = "/forgotPassword" element= {<ForgotPassword/>}/>
      </Routes>
  </BrowserRouter>,
);
