
import React, { useState } from "react";
import { Card, TextField, Button, nativeSelectClasses} from "@mui/material";
import { validateEmail } from "../../utils/Validators";
import { Account, Client } from "appwrite";
import { useNavigate } from "react-router-dom";
import "../../styling/AuthStyling/ForgotPassword.css";

export default function ForgotPassword(){
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    const navigateToSignIn = () => {
      navigate("/");
    };

    const handlePasswordReset = async () => {
        try {
            setIsSubmitted(true);
            if (!email) {
                return;
            }

            const client = new Client()
                .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
                .setProject(import.meta.env.VITE_APPWRITE_PROJECT);

            const account = new Account(client);
            await account.createRecovery(`${email}`, import.meta.env.VITE_PUBLIC_DDNS);

            setEmail("");
            navigateToSignIn();

        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitted(false);
        }    
    };

    return (
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
        <Button className="customButton" onClick={handlePasswordReset}>
          <h2>Send Email</h2>
        </Button>
      </div>
    );
}
