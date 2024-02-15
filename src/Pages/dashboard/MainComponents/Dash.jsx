import React, { useState} from "react";
import { Account, Client } from "appwrite";

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
                    <button className="EditEventsButton dashSelection"  color="primary" onClick={navigateToEvents}> Edit Events</button>
                    <button className="EditEventsButton dashSelection"  color="primary" onClick={navigateToPOI}> Edit POI </button>
                    <button className="SignOutButton dashSelection"  color="primary" onClick={handleLogout}> Sign Out</button>

                </div>
                
            </div>
        </div>


    );
}
