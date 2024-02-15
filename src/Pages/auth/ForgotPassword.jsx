
import { Card, TextField, Button, nativeSelectClasses} from "@mui/material";
import React, { useState } from "react";
import { validateEmail } from "../../utils/Validators";
import { Account, Client } from "appwrite";
import { useNavigate } from "react-router-dom";
import "../../styling/AuthStyling/ForgotPassword.css";


export default function ForgotPassword(){

    const navigate = useNavigate();

    const navigateToSignin = () => {
      navigate("/");
    };

    const [email, setEmail] = useState("");


    const handlePasswordReset = async () => {

        try {

            const client = new Client()
                .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
                .setProject(import.meta.env.VITE_APPWRITE_PROJECT);

            const account = new Account(client);
            await account.createRecovery(`${email}`, import.meta.env.VITE_PUBLIC_DDNS);

            setEmail("");
            navigateToSignin();

        } catch (error) {
            console.error(error);
        }
    };


    return(
        <div className="ForgotPassword">
        <h2> Forgot Password</h2>

        <TextField
            placeholder="Email"
            variant="outlined"
            fullWidth
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            onBlur={() => validateEmail(email, setEmail)}
        />
        <Button onClick={handlePasswordReset} >
            <h2 >Send Email</h2>
        </Button>
        </div>

    );
}
