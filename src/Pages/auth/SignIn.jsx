import React, { useState, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styling/AuthStyle.css";
import {account} from "../../utils/AppwriteConfig";



export default function LoginScreen() {
  const navigate = useNavigate();

  const InvalidCreds = () => {
    toast.error("Invalid Username or Password", {
      position: toast.POSITION.TOP_CENTER,
    });
  };

  const ValidCreds = () => {
    toast.success("Successfully Signed in!", {
      position: toast.POSITION.TOP_CENTER,
    });
  };

  const navigateToDash = () => {
    navigate("/dash");
  };

  // const navigateToNewEvent = () => {
  //   navigate("/newEvent");
  // };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is already logged in
    const checkLoggedInStatus = async () => {
      try {
     

        // Check if the user is already logged in
        if (await account.get()) {
          setIsLoggedIn(true);
          // Redirect to the dashboard or another protected route
          navigateToDash();
        }
      } catch (error) {
        console.log("not Logged in");
      }
    };

    checkLoggedInStatus();
  }, []); // Empty dependency array ensures that this effect runs only once on component mount

  const handleLogin = async () => {
    try {
    

      await account.createEmailSession(email, password);

      setEmail("");
      setPassword("");
      ValidCreds();
      navigateToDash();
      
    } catch (error) {
      InvalidCreds();
      console.error(error);
    }
  };

  if (isLoggedIn) {
    // Redirect the user to the dashboard if already logged in
    return null;
  }

  return (
    <div className="container">
      <ToastContainer />
      <div className="center">
        <h2 className="AuthTitle">Sign In</h2>
        <TextField
          className="EmailTextfield"
          label="Email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          className="PasswordText"
          label="Password"
          fullWidth
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleLogin}>
          Sign In
        </Button>
        <Link className="ForgotPassLink" to="/forgotPassword">
          Forgot Password
        </Link>
      </div>
    </div>
  );
}
