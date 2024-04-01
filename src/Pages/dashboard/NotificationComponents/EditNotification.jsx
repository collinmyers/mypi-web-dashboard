import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styling/NotificationStyling/EditNotificationStyle.css";
// import {ID} from "appwrite";
import {database} from "../../../utils/AppwriteConfig";

import {ALERTS_COLLECTION_ID} from "../../../utils/AppwriteConfig";
import {DATABASE_ID} from "../../../utils/AppwriteConfig";
import { toast, ToastContainer} from "react-toastify";
import { useLocation } from "react-router-dom";
import {
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Container,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";



export default function EditNotification(){
  const location = useLocation();
  let notification = location.state.notification;

  const [title, setTitle] = useState(notification.Title);
  const [details, setDetails] = useState(notification.Details);
  const [alertType, setAlertType] = useState(notification.AlertType);
  const [notificationType] = useState(
    notification.NotificationType
  );

  const navigate = useNavigate();

  const Successful = () => {
    toast.success("Notification Update", {
      position: toast.POSITION.TOP_CENTER,
    });
  };

  const Failed = () => {
    toast.error("Failed to Update Notification", {
      position: toast.POSITION.TOP_CENTER,
    });
  };

  useEffect(() => {});

  const handleSubmit = async () => {
    console.log(alertType);

    const data = {
      Title: title,
      Details: details,
      AlertType: alertType,
      NotificationType: notificationType,
    };

    try {
      await database.updateDocument(
        DATABASE_ID,
        ALERTS_COLLECTION_ID,
        notification.$id,
        data
      );
      Successful();
    } catch (error) {
      Failed();
      console.log(error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom className="editNotifTitle">
        Edit Notification
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          variant="outlined"
        />

        <TextField
          margin="normal"
          required
          fullWidth
          label="Details"
          multiline
          rows={4}
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          variant="outlined"
        />

        <FormControl fullWidth margin="normal" className="formControl">
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

        {/* Similar for Notification Type */}

<div className="buttonWrapper">

        <Button type="submit" variant="contained" className="actionButton">
          Edit Notification
        </Button>

        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/notificationEditor")}
          variant="outlined"
          className="actionButton"
        >
          Go Back
        </Button>
        </div>
      </Box>
    </Container>
  );
}