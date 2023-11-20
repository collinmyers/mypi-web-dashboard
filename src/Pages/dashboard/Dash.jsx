import React, { useState} from "react";
import { Account, Client } from "appwrite";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "../../styling/DashStyling.css";


export default function Dashboard() {
    
    const [isSigningOut, setIsSigningOut] = useState(false);

    const navigate = useNavigate();

    const navigateToLogin = () => {
        navigate("/");
    };

    const navigateToNewEvent = () => {
        navigate("/newEvent");
    };


    const handleLogout = async () => {
        if(!isSigningOut){
            setIsSigningOut(true);
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
    }

    };

    return (
        <div className="container">
            <div className="content">
                <h1 className="dashTitle">Welcome to the Admin Dashboard!</h1>
                <Button className="SignOutButton" variant="contained" color="primary" onClick={handleLogout}> Sign Out</Button>
                <Button className="NewEventButton" variant="contained" color="primary" onClick={navigateToNewEvent}> New Event</Button>

            </div>
        </div>


    );
}
