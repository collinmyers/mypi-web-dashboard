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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function EditNotification() {
  const location = useLocation();
  const notification = location?.state?.notification;

  const [title, setTitle] = useState(notification?.Title || "");
  const [details, setDetails] = useState(notification?.Details || "");
  const [alertType, setAlertType] = useState(notification?.AlertType || "");
  const [notificationType, setNotificationType] = useState(
    notification?.NotificationType || ""
  );

  const navigate = useNavigate();
  const SuccessfulCreation = () => {
    toast.success("User has been Updated", {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 2000, // Auto close after 2000 ms
    });
    setTimeout(() => {
      navigate("/notifications"); // Navigate after 2000 ms
    }, 1000); // Delay to match the toast autoClose
  };

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

      SuccessfulCreation();
    } catch (error) {
      toast.error("Failed to Update Notification");
      console.error(error);
    }
  };

 const SuccessfulEdit = () => {
   toast.success("User has been Updated", {
     position: toast.POSITION.TOP_CENTER,
     autoClose: 2000, // Auto close after 2000 ms
   });
   setTimeout(() => {
     navigate("/events"); // Navigate after 2000 ms
   }, 1000); // Delay to match the toast autoClose
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
      </FormControl>
      <FormControl fullWidth margin="normal" sx={{ mt: 2 }}>
        <InputLabel>Notification Type</InputLabel>
        <Select
          label="Notification Type"
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
          sx={{ mb: 2, width: "40%" }}
        >
          Edit Notification
        </Button>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          variant="outlined"
          sx={{ width: "40%" }}
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
