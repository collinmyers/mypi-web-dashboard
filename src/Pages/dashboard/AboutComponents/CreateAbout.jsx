import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { ID } from "appwrite";
import { database } from "../../../utils/AppwriteConfig";
import {
  PARKINFO_COLLECTION_ID,
  DATABASE_ID,
} from "../../../utils/AppwriteConfig";
import { toast, ToastContainer } from "react-toastify";

export default function CreateAbout() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [aboutType, setAboutType] = useState("partnership");
  const navigate = useNavigate();

  const notify = (message, type = "error") => {
    toast[type](message, { position: toast.POSITION.TOP_CENTER });
  };

  const clearInput = () => {
    setTitle("");
    setDescription("");
  };

  const navigateToAbout = () => {
    setTimeout(() => {
      navigate("/about");
    }, 1000);
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
      await database.createDocument(
        DATABASE_ID,
        PARKINFO_COLLECTION_ID,
        ID.unique(),
        data
      );
      clearInput();
      notify("New About section created", "success");
      navigateToAbout();
    } catch (error) {
      console.error(error); // For debugging
      notify("Failed to create the About section");
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
        New About
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
        rows={5}
        label="Description"
        variant="outlined"
        multiline
        margin="normal"
        value={description}
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
          Create About
        </Button>
        <Button variant="outlined" onClick={() => navigate("/about")}>
          Back
        </Button>
      </Box>
    </Container>
  );
}
