import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { account } from "../../utils/AppwriteConfig";
import myPIIcon from "/src/assets/myPI-Icon.png";

import "../../styling/AuthStyling/AuthStyle.css";

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
                <img src={myPIIcon} alt="myPI Icon" className="myPIIcon" />
                <div className="sign-in-container">
                    <h2 className="AuthTitle">Sign In</h2>
                    <input
                        className="EmailTextfield"
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        className="PasswordTextField"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="SignInButton" onClick={handleLogin}>Sign In</button>
                    
                    <Link className="ForgotPassLink" to="/forgotPassword">
                        Forgot Password
                    </Link>
                </div>
            </div>
        </div>
    );
}
