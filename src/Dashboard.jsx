import React from "react";
import { Account, Client } from "appwrite";
import {  Button } from "@mui/material";
import { useNavigate } from "react-router-dom";


export default function Dashboard() {
 

      const navigate = useNavigate();

      const navigateToLogin = () => {
        navigate("/");
      };

      
    const handleLogout = async () => {
      try {
          const client = new Client()
              .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
              .setProject(import.meta.env.VITE_APPWRITE_PROJECT);

          const account = new Account(client);

          await account.deleteSessions("current");

        navigateToLogin();

      } catch (error) {
          console.error(error);
      }
  };
      
  return (

    <div className="content">
      <h1 className="dashTitle">Welcome to the Admin Dashboard!</h1>
      <Button variant="contained" color="primary" onClick={handleLogout}> Sign Out</Button>
    </div>

  );
}
