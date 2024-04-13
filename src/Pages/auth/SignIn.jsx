import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  CssBaseline,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { account } from "../../utils/AppwriteConfig";
import myPIIcon from "/src/assets/myPI-Icon.png";
import { useAuth } from "../../components/AuthContext";

export default function LoginScreen() {
  const navigate = useNavigate();
  const { setIsSignedIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const notify = (isSuccess, message) => {
    toast[isSuccess ? "success" : "error"](message, {
      position: toast.POSITION.TOP_CENTER,
    });
  };

  const handleLogin = async () => {
    try {
      await account.createEmailSession(email, password);
      const response = await account.get();

      if (response.labels.includes("PrivilegedUser")) {
        notify(true, "Successfully Signed in!");
        setIsSignedIn(true);
        navigate("/");
      } else {
        await account.deleteSessions();
        notify(false, "Invalid Username or Password");
        setIsSignedIn(false);
      }
    } catch (error) {
      console.error(error);
      notify(false, "Invalid Username or Password");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  // Create a theme instance.
  const theme = createTheme({
    palette: {
      background: {
        default: "#005588", // This sets the BG color! - Q
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />{" "}
      {/* This resets the margin and background for the entire document. 
      Without it, the BG color does not get applied. */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          width: "100vw", // Ensures the box takes the full viewport width
        }}
      >
        <ToastContainer />
        <Card
          sx={{
            minWidth: 275,
            maxWidth: 400,
            padding: 4,
            boxShadow: 3,
            backgroundColor: "#FFFFFF",
          }}
        >
          <Box
            component="img"
            src={myPIIcon}
            alt="Park Icon"
            sx={{ height: 120, mb: 2, display: "block", mx: "auto" }}
          />
          <Typography
            variant="h5"
            component="h2"
            sx={{
              mb: 2,
              textAlign: "center",
              color: "#0078AA",
              fontWeight: "bold",
            }}
          >
            Admin Login
          </Typography>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button
            onClick={handleLogin}
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2, fontWeight: "bold" }}
          >
            Sign In
          </Button>
        </Card>
      </Box>
    </ThemeProvider>
  );
}
