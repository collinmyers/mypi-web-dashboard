import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import { Account, Client } from "appwrite";
import { Link } from "react-router-dom";
// import AppStyle from "../styling/AppStyling";
import { validateEmail } from "../utils/Validators";
import { useNavigate } from "react-router-dom";
import "../styling/AuthStyle.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";




export default function LoginScreen() {
  const navigate = useNavigate();

  const InvalidCreds = () => {
    toast.error("Invalid Username or Password", {
        position: toast.POSITION.TOP_CENTER
    });
};

  const ValidCreds = () => {
    toast.success("Successfuly Signed in!",{
        position: toast.POSITION.TOP_CENTER
    });
  };

    const navigateToDash = () => {
      navigate("/dash");
    };

   

    const navigateToNewEvent = () => {
      navigate("/newEvent");
    };


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");



  const handleLogin = async () => {
    try {
      const client = new Client()
        .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT) // this is not working
         .setProject(import.meta.env.VITE_APPWRITE_PROJECT);

      const account = new Account(client);
      await account.createEmailSession(email, password);

      setEmail("");
      setPassword("");
      ValidCreds();
      navigateToNewEvent();
      // Navigation can be handled using React Router's Link component.
    } catch (error) {
      InvalidCreds();
      console.error(error);

    }
  };

  return (
    <div className="container">
      <ToastContainer/>
      <div className="center">
      <h2 className="AuthTitle">Sign In</h2>
          <TextField
            className="EmailTextfield"
            label="Email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => validateEmail(email, setEmail)}
          />
          <TextField
            className="PasswordText"
            label="Password"
            fullWidth
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogin}
          >
            Sign In
          </Button>
          <Link className="ForgotPassLink" to="/forgotPassword">Forgot Password</Link>
          </div>
    </div>
  );
}
