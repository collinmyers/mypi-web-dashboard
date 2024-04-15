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
  const [status, setStatus] = useState("");
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
        New Point of Interest
      </Typography>

      <Box component="form" noValidate sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}>

        <TextField
          fullWidth
          label="Name"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ m: "4%", mt: 0 }}
        />

        <TextField
          fullWidth
          label="Latitude"
          variant="outlined"
          value={latitude}
          onChange={(e) => {
            const value = e.target.value;
            if (/^-?\d*\.?\d*$/.test(value)) {
              setLatitude(value);
            }
          }}
          sx={{ m: "1%", mb: "4%" }}
        />

        <TextField
          fullWidth
          label="Longitude"
          variant="outlined"
          value={longitude}
          onChange={(e) => {
            const value = e.target.value;
            if (/^-?\d*\.?\d*$/.test(value)) {
              setLongitude(value);
            }
          }}
          sx={{ m: "1%", mb: "4%" }}
        />

        <FormControl fullWidth>
          <InputLabel id="type-label" >Type</InputLabel>
          <Select
            labelId="type-label"
            id="type"
            value={type}
            label="Type"
            onChange={(e) => setType(e.target.value)}
            sx={{ mb: "4%" }}
          >
            <MenuItem value="Amenities">Amenities</MenuItem>
            <MenuItem value="Attraction">Attraction</MenuItem>
            <MenuItem value="Beach">Beaches</MenuItem>
            <MenuItem value="FoodTruck">Food Truck</MenuItem>
            <MenuItem value="Information">Information</MenuItem>
            <MenuItem value="Parking">Parking</MenuItem>
            <MenuItem value="Restroom">Restrooms</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="status-label">Status</InputLabel>
          <Select
            labelId="status-label"
            id="status"
            value={status}
            label="Status"
            onChange={(e) => setStatus(e.target.value)}
            sx={{ mb: "4%" }}
          >
            <MenuItem value="Open">Open</MenuItem>
            <MenuItem value="Closed">Closed</MenuItem>
          </Select>
        </FormControl>


        <Box sx={{ mt: 2, display: "flex", justifyContent: "center", gap: 2 }}>
          <Button onClick={handleSubmit} variant="contained" >
            Create Point
          </Button>

          <Button variant="outlined" onClick={() => navigate("/points-of-interest")}>
            Back to Points
          </Button>
        </Box>
      </Box>


    </Container>
  );
}
