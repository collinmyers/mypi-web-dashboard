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
import { DATABASE_ID, MAP_COLLECTION_ID } from "../../../utils/AppwriteConfig";
import { toast, ToastContainer } from "react-toastify";

export default function CreatePOI() {
  const [name, setName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [status, setStatus] = useState("Open");
  const [type, setType] = useState("");
  const navigate = useNavigate();

  const SuccessfulCreation = () => {
    toast.success("New POI Created", {
      position: toast.POSITION.TOP_CENTER,
    });
  };

  const creationFailed = () => {
    toast.error("Failed to Create POI", {
      position: toast.POSITION.TOP_CENTER,
    });
  };

  const handleSubmit = async () => {
    const data = {
      Name: name,
      Latitude: parseFloat(latitude),
      Longitude: parseFloat(longitude),
      Status: status,
      Type: type,
    };

    try {
      await database.createDocument(
        DATABASE_ID,
        MAP_COLLECTION_ID,
        ID.unique(),
        data
      );
      SuccessfulCreation();
    } catch (response) {
      creationFailed();
      console.log(response);
    }
  };

  return (
    <Container maxWidth="sm">
      <ToastContainer />
      <Typography
        variant="h4"
        component="h1"
        align="center"
        sx={{ color: "#005588", fontWeight: "bold", marginY: 2 }}
      >
        New POI
      </Typography>
      <TextField
        fullWidth
        label="Name"
        variant="outlined"
        margin="normal"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <TextField
        fullWidth
        label="Latitude"
        variant="outlined"
        margin="normal"
        value={latitude}
        onChange={(e) => {
          const value = e.target.value;
          if (/^-?\d*\.?\d*$/.test(value)) {
            setLatitude(value);
          }
        }}
      />
      <TextField
        fullWidth
        label="Longitude"
        variant="outlined"
        margin="normal"
        value={longitude}
        onChange={(e) => {
          const value = e.target.value;
          if (/^-?\d*\.?\d*$/.test(value)) {
            setLongitude(value);
          }
        }}
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>Status</InputLabel>
        <Select
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <MenuItem value="Open">Open</MenuItem>
          <MenuItem value="Closed">Closed</MenuItem>
        </Select>
      </FormControl>
      <TextField
        fullWidth
        label="Type"
        variant="outlined"
        margin="normal"
        value={type}
        onChange={(e) => setType(e.target.value)}
      />
      <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 2 }}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Create POI
        </Button>
        <Button variant="outlined" onClick={() => navigate("/points-of-interest")}>
          Back to POI Menu
        </Button>
      </Box>
    </Container>
  );
}
