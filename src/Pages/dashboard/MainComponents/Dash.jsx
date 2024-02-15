import React, { useState} from "react";
import { Account, Client } from "appwrite";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "../../../styling/DashStyling/DashStyle.css";


export default function Dashboard() {
    
    const [isSigningOut, setIsSigningOut] = useState(false);

    const navigate = useNavigate();

    const navigateToLogin = () => {
        navigate("/");
    };

    const navigateToEvents = () => {
        navigate("/events");
    };
    const navigateToPOI = () => {
        navigate("/poiEdit");
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
                <div className="buttonContainer">
                    <Button className="EditEventsButton dashSelection" variant="contained" color="primary" onClick={navigateToEvents}> Edit Events</Button>
                    <Button className="EditEventsButton dashSelection" variant="contained" color="primary" onClick={navigateToPOI}> Edit POI </Button>
                    <Button className="SignOutButton dashSelection" variant="contained" color="primary" onClick={handleLogout}> Sign Out</Button>

                </div>
                
            </div>
        </div>


    );
}
