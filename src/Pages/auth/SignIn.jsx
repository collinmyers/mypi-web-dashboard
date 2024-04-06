import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { account } from "../../utils/AppwriteConfig";
import myPIIcon from "/src/assets/myPI-Icon.png";
import "../../styling/AuthStyling/AuthStyle.css";
import { useAuth } from "../../components/AuthContext";

export default function LoginScreen() {
    const navigate = useNavigate();
    const { setIsSignedIn } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

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



    const handleLogin = async () => {
        try {
            await account.createEmailSession(email, password);
            await account.get().then((response) => {
                
                if (response.labels.includes("PrivilegedUser")) {
                    ValidCreds();
                    setIsSignedIn(true);
                    navigate("/");
                } else {
                    account.deleteSessions();
                    InvalidCreds();
                    setIsSignedIn(false);
                }

            }).catch((error) => { console.error(error); });

        } catch (error) {
            InvalidCreds();
            setIsSignedIn(false);
            console.error(error);
        }
    };

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


                </div>
            </div>
        </div>
    );
}
