
import React, { useState} from "react";
import { useLocation } from "react-router-dom";
import {TextField, Button} from "@mui/material";
import { validatePassword } from "../../utils/Validators";
import {account} from "../../utils/AppwriteConfig";
import "../../styling/AuthStyling/ForgotPassword.css";
import { toast,ToastContainer } from "react-toastify";

export default function ForgotPassword(){  // page to allow users to update their password from link sent via email
    const [password, setPassword] = useState("");
    const [confirmPassword,setConfirmPassword] = useState("");
    const [errors,setErrors] = useState([]);

    const location = useLocation();

    // Extract user id and secret key to update users password
    const searchParams = new URLSearchParams(location.search);
    const userId = searchParams.get("userId");
    const secret = searchParams.get("secret");

    const failedReset = (error) => {
      toast.error(error, {
        position: toast.POSITION.TOP_CENTER,
      });
    };

    const successfulReset = () => {
      toast.success("Password has been reset", {
        position: toast.POSITION.TOP_CENTER,
      });
    };
  

    const handlePasswordReset = async () => {
      const validationErrors = validatePassword(password, confirmPassword);
      setErrors(validationErrors);

      if (validationErrors.length === 0) {
        setErrors("");
        sendReset();
      }

    };
    
    const sendReset = async () => {
      try {
        const result = await account.updateRecovery(
          userId, // userId
          secret, // secret
          password,
          password // password
        );
          successfulReset();
          setPassword("");
          setConfirmPassword("");
        
      } catch (error) {
        failedReset(error.message);
      }
    };

    return (
      <div className="ForgotPassword">
        <ToastContainer/>

        <h2>Password Reset</h2>

        <TextField
          placeholder="New Password"
          variant="outlined"
          type="password"
          fullWidth
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          sx= {{mb:1}}
        />
        <TextField
          type="password"
          placeholder="Confirm Password"
          variant="outlined"
          fullWidth
          onChange={(e) => setConfirmPassword(e.target.value)}
          value={confirmPassword}
        />
        
        <Button className="resetButton" onClick={handlePasswordReset}>
          <h2>Reset</h2>
        </Button>
      
        {errors.length > 0 && (
          <div>
            {errors.map((error, index) => (
              <p key={index} style={{ color: "red" }}>{error}</p>
            ))}
          </div>
        )}
        
        
      </div>
    );
}
