import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import { database } from "../../../utils/AppwriteConfig";
import {
  PARKINFO_COLLECTION_ID,
  DATABASE_ID,
} from "../../../utils/AppwriteConfig";
import { toast, ToastContainer } from "react-toastify";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function EditAbout() {
  const { state } = useLocation();
  const { About } = state; // Using destructuring for clarity
  const [title, setTitle] = useState(About.Title);
  const [description, setDescription] = useState(About.Description);
  const [aboutType, setAboutType] = useState(About.AboutType);

  const navigate = useNavigate();

  const notify = (message, type = "error") => {
    toast[type](message, { position: toast.POSITION.TOP_CENTER });
  };

  const navigateAfterEdit = () => {
    notify("About has been edited", "success");
    setTimeout(() => {
      navigate("/about"); // Navigate after a delay
    }, 2000);
  };

  const handleSubmit = async () => {
    if (!title || !description) {
      notify("All fields must be filled");
      return;
    }

    const data = {
      AboutType: aboutType,
      Title: title,
      Description: description,
    };

    try {
      await database.updateDocument(
        DATABASE_ID,
        PARKINFO_COLLECTION_ID,
        About.$id,
        data
      );
      navigateAfterEdit();
    } catch (error) {
      notify("Failed to edit About");
      console.error(error); // For debugging purposes
    }
  };

  return (
    <Container maxWidth="sm">
      <ToastContainer />
      <Typography
        variant="h4"
        sx={{
          color: "#005588",
          fontWeight: "bold",
          textAlign: "center",
          my: 2,
        }}
      >
        Edit About
      </Typography>
      <TextField
        value={title}
        fullWidth
        label="Title"
        variant="outlined"
        margin="normal"
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextField
        value={description}
        fullWidth
        rows={5}
        label="Description"
        variant="outlined"
        multiline
        margin="normal"
        onChange={(e) => setDescription(e.target.value)}
      />
      <Box sx={{ my: 2, width: "100%" }}>
        <FormControl fullWidth>
          <InputLabel>About Type</InputLabel>
          <Select
            label="About Type"
            value={aboutType}
            onChange={(e) => setAboutType(e.target.value)}
          >
            <MenuItem value="park">About the Park</MenuItem>
            <MenuItem value="partnership">About the Partnership</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ mt: 2, display: "flex", justifyContent: "center", gap: 2 }}>
        <Button variant="contained" onClick={handleSubmit}>
          Save Changes
        </Button>
        <Button
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          onClick={() => navigate("/about")}
        >
          Go Back
        </Button>
      </Box>
    </Container>
  );
}
