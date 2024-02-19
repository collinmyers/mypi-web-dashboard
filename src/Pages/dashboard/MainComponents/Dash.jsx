import React, { useEffect, useState } from "react";
import { account } from "../../../utils/AppwriteConfig";

import { useNavigate } from "react-router-dom";
import "../../../styling/DashStyling/DashStyle.css";


export default function Dashboard() {

    const [isSigningOut, setIsSigningOut] = useState(false);
    const [profileInfo, setProfileInfo] = useState({
        name: "",
        permissions: ""
    });

    const navigate = useNavigate();

    const navigateToLogin = () => {
        navigate("/");
    };

    const navigateToEvents = () => {
        navigate("/eventEditor");
    };
    const navigateToPOI = () => {
        navigate("/poiEditor");
    };
    const navigateToNotifcations = () => {
        navigate("/notificationEditor");
    };

    const handleLogout = async () => {
        if (!isSigningOut) {
            setIsSigningOut(true);
            try {
                await account.deleteSessions("current");

                navigateToLogin();

            } catch (error) {
                console.error(error);
            }
        }

    };

    useEffect(() => {
        const getCurrentUser = async () => {
            const response = await account.get();
            setProfileInfo({ ...profileInfo, name: response.name });
        };
        getCurrentUser();
    }, []);

    return (
        <div className="container">
            <div className="content">
                <h1 className="dashTitle">Welcome {profileInfo.name}</h1>
                <div className="buttonContainer">
                    <button className="EditEventButton" onClick={navigateToEvents}> Events</button>
                    <button className="EditPOIButton" onClick={navigateToPOI}> Points of Interest </button>
                    <button className="EditNotificationButton" onClick={navigateToNotifcations}> Notifications </button>

                </div>
                <button className="SignOutButton" color="primary" onClick={handleLogout}> Sign Out</button>

            </div>
        </div>


    );
}
