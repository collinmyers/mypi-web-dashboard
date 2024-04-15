import React, { useState } from "react";
import {
  Container,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Box, // Import Box for additional layout control
} from "@mui/material";
import { database, functions } from "../../../utils/AppwriteConfig";
import {
  ALERTS_COLLECTION_ID,
  DATABASE_ID,
  PUSH_NOTIFICATION_ID,
} from "../../../utils/AppwriteConfig";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

export default function EditNotification() {
  const location = useLocation();
  const notification = location?.state?.notification;

  const [title, setTitle] = useState(notification?.Title || "");
  const [details, setDetails] = useState(notification?.Details || "");
  const [alertType, setAlertType] = useState(notification?.AlertType || "");
  const [notificationType, setNotificationType] = useState(
    notification?.notificationType || ""
  );

  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!notification) {
      toast.error("No notification data provided!");
      return;
    }

    const data = {
      Title: title,
      Details: details,
      AlertType: alertType.toLowerCase(),
      NotificationType: notificationType.toLowerCase(),
    };
    try {
      await database.updateDocument(
        DATABASE_ID,
        ALERTS_COLLECTION_ID,
        notification.$id,
        data
      );
      if (["both", "push"].includes(alertType)) {
        await schedulePushNotification(title, details);
      }
      toast.success("Notification Updated");
    } catch (error) {
      toast.error("Failed to Update Notification");
      console.error(error);
    }
  };

  const schedulePushNotification = async (notifTitle, notifBody) => {
    const params = { title: notifTitle, body: notifBody };
    try {
      await functions.createExecution(
        PUSH_NOTIFICATION_ID,
        JSON.stringify(params),
        false,
        "/",
        "POST",
        params
      );
    } catch (err) {
      console.error(err.message);
    }
  };

  if (!notification) {
    return <div>No notification data available.</div>;
  }

  return (
    <Container>
      <ToastContainer />
      <TextField
        margin="normal"
        required
        fullWidth
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        sx={{ mt: 2 }}
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
        sx={{ mt: 2 }}
      />
      <FormControl fullWidth margin="normal" sx={{ mt: 2 }}>
        <InputLabel>Alert Type</InputLabel>
        <Select
          value={alertType}
          onChange={(e) => setAlertType(e.target.value)}
        >
          <MenuItem value="in-app">In-App</MenuItem>
          <MenuItem value="push">Push</MenuItem>
          <MenuItem value="both">Both</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal" sx={{ mt: 2 }}>
        <InputLabel>Notification Type</InputLabel>
        <Select
          value={notificationType}
          onChange={(e) => setNotificationType(e.target.value)}
        >
          <MenuItem value="alerts">Alerts</MenuItem>
          <MenuItem value="events">Events</MenuItem>
          <MenuItem value="promos">Promos</MenuItem>
        </Select>
      </FormControl>
      <Box
        sx={{
          mt: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{ mb: 2, width: "80%" }}
        >
          Edit Notification
        </Button>
        <Button
          onClick={() => navigate(-1)}
          variant="outlined"
          sx={{ width: "80%" }}
        >
          Go Back
        </Button>
      </Box>
    </Container>
  );
}

EditNotification.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      notification: PropTypes.shape({
        Title: PropTypes.string,
        Details: PropTypes.string,
        AlertType: PropTypes.string,
        notificationType: PropTypes.string,
        $id: PropTypes.string,
      }),
    }),
  }),
};
