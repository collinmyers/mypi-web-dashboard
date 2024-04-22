import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, TextField, Button, Typography } from "@mui/material";
import { ID } from "appwrite";
import { database } from "../../../utils/AppwriteConfig";
import {
  PARKINFO_COLLECTION_ID,
  DATABASE_ID,
} from "../../../utils/AppwriteConfig";
import { toast, ToastContainer } from "react-toastify";
import { FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";
import { Description } from "@mui/icons-material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
export default function EditAbout() {
  const location = useLocation();
  let about = location.state.About;
  const [title, setTitle] = useState(about.Title);
  const [description, setDescription] = useState(about.Description);
  const [aboutType, setAboutType] = useState(about.AboutType);

  const navigate = useNavigate();
  const timeout = () => {
    setTimeout(() => {
      navigate("/about");
    }, 2000);
  };

  const SuccessfulCreation = () => {
    toast.success("About has been edited", {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 2000, // Auto close after 2000 ms
    });
    setTimeout(() => {
      navigate("/notifications"); // Navigate after 2000 ms
    }, 1000);
  };

  const creationFailed = () => {
    toast.error("Failed to Edit About", {
      position: toast.POSITION.TOP_CENTER,
    });
  };
  const UnfilledFields = () => {
    toast.error("All fields must be filled", {
      position: toast.POSITION.TOP_CENTER,
    });
  };

  const handleSubmit = async () => {
    const data = {
      AboutType: aboutType,
      Title: title,
      Description: description,
    };
    if (!data.Title || !data.Description) {
      UnfilledFields();
      return;
    }

    try {
      await database.updateDocument(
        DATABASE_ID,
        PARKINFO_COLLECTION_ID,
        about.$id,
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
    setTitle("");
    setDescription("");
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
          Create About
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
