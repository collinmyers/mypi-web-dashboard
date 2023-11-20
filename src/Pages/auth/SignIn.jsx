import React, { useState, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import { Account, Client } from "appwrite";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styling/AuthStyle.css";


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
        const client = new Client()
          .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
          .setProject(import.meta.env.VITE_APPWRITE_PROJECT);

        const account = new Account(client);

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
      const client = new Client()
        .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
        .setProject(import.meta.env.VITE_APPWRITE_PROJECT);

      const account = new Account(client);
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
