import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {Container,TextField,Button,Typography} from "@mui/material";
import { ID } from "appwrite";
import { database } from "../../../utils/AppwriteConfig";
import {PARKINFO_COLLECTION_ID,DATABASE_ID,} from "../../../utils/AppwriteConfig";
import { toast, ToastContainer } from "react-toastify";
// import "../../../styling/NotificationStyling/CreateNotificationStyle.css"; // Obsolete styling file
import {FormControl,InputLabel,Select,MenuItem,Box} from "@mui/material";

export default function CreateAbout() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [aboutType,setAboutType] = useState("partnership");

  const navigate = useNavigate();
  const timeout = () =>{
    setTimeout(() => {
        navigate("/about");
    }, 1000);
  };

  const SuccessfulCreation = () => {
    toast.success("New About section Created", {
      position: toast.POSITION.TOP_CENTER,
    });
    timeout();
  };

  const creationFailed = () => {
    toast.error("Failed to Create", {
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
      await database.createDocument(
        DATABASE_ID,
        PARKINFO_COLLECTION_ID,
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
    setTitle("");
    setDescription("");
  };

  return (
    <Container maxWidth="sm">
      <ToastContainer />
      <Typography
        variant="h4"
        sx={{ color: "#005588", fontWeight: "bold", textAlign: "center", my: 2 }}
      >
        New About
      </Typography>
      <TextField
        fullWidth
        label="Title"
        variant="outlined"
        margin="normal"
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextField
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
          variant="outlined"
          onClick={() => navigate("/about")}
        >
          Back
        </Button>
      </Box>
    </Container>
  );
}
