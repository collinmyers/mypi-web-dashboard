import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
} from "@mui/material";
import { ID } from "appwrite";
import { database } from "../../../utils/AppwriteConfig";
import {
  ALERTS_COLLECTION_ID,
  DATABASE_ID,
} from "../../../utils/AppwriteConfig";
import { toast, ToastContainer } from "react-toastify";
import "../../../styling/NotificationStyling/CreateNotificationStyle.css"; // Obsolete styling file

export default function CreateNotification() {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [alertType, setAlertType] = useState("both");
  const [notificationType, setNotificationType] = useState("alerts");
  const navigate = useNavigate();

  const SuccessfulCreation = () => {
    toast.success("New Notification Created", {
      position: toast.POSITION.TOP_CENTER,
    });
  };

  const creationFailed = () => {
    toast.error("Failed to Create Notification", {
      position: toast.POSITION.TOP_CENTER,
    });
  };

  const handleSubmit = async () => {
    const data = {
      Title: title,
      Details: details,
      AlertType: alertType,
      NotificationType: notificationType,
    };

    try {
      await database.createDocument(
        DATABASE_ID,
        ALERTS_COLLECTION_ID,
        ID.unique(),
        data
      );
      clearInput();
      SuccessfulCreation();
    } catch (response) {
      creationFailed();
      console.log(response);
    }
  };

  const clearInput = () => {
    setDetails("");
    setTitle("");
  };

  return (
    <Container maxWidth="sm">
      <ToastContainer />
      <Typography
        variant="h4"
        sx={{ color: "#005588", fontWeight: "bold", textAlign: "center", my: 2 }}
      >
        New Notification
      </Typography>
      <TextField
        fullWidth
        label="Title"
        variant="outlined"
        margin="normal"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextField
        fullWidth
        label="Details"
        variant="outlined"
        multiline
        margin="normal"
        value={details}
        onChange={(e) => setDetails(e.target.value)}
      />
      <Box sx={{ my: 2, width: "100%" }}>
        <FormControl fullWidth>
          <InputLabel>Alert Type</InputLabel>
          <Select
            value={alertType}
            label="Alert Type"
            onChange={(e) => setAlertType(e.target.value)}
          >
            <MenuItem value="in-app">In-App</MenuItem>
            <MenuItem value="push">Push</MenuItem>
            <MenuItem value="both">Both</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Notification Type</InputLabel>
          <Select
            value={notificationType}
            label="Notification Type"
            onChange={(e) => setNotificationType(e.target.value)}
          >
            <MenuItem value="alerts">Alerts</MenuItem>
            <MenuItem value="events">Events</MenuItem>
            <MenuItem value="promos">Promos</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ mt: 2, display: "flex", justifyContent: "center", gap: 2 }}>
        <Button variant="contained" onClick={handleSubmit}>
          Create Notification
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate("/notifications")}
        >
          Back to Notification Menu
        </Button>
      </Box>
    </Container>
  );
}
