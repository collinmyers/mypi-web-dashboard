import React, { useState } from "react";
import { Card, TextField, Button } from "@mui/material";
import { Account, Client } from "appwrite";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
// import AppStyle from "../styling/AppStyling";
import { validateEmail } from "../utils/Validators";
import { useNavigate } from "react-router-dom";
import "../styling/AuthStyle.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


LoginScreen.propTypes = {
  handleLoginSuccess: PropTypes.func.isRequired,
};


export default function LoginScreen({ handleLoginSuccess }) {

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


  const navigate = useNavigate();

    const navigateToDash = () => {
      navigate("/dash");
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
      
      navigateToDash();
      // Navigation can be handled using React Router's Link component.
    } catch (error) {
      InvalidCreds();
      console.error(error);

    }
  };

  return (
    <div>
      <ToastContainer/>
      <div className="center">
      <h2 className="AuthTitle">Sign In</h2>
          <TextField
            className="EmailTextfield"
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => validateEmail(email, setEmail)}
          />
          <TextField
            // className={AuthStyle.userInput}
            label="Password"
            variant="outlined"
            fullWidth
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogin}
            // className={AuthStyle.ButtonOpacity}
          >
            Sign In
          </Button>
          <Link to="/forgotPassword">Forgot Password</Link>
          </div>
    </div>
  );
}
