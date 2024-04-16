import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styling/POIStyling/EditPOIStyle.css";
import { toast, ToastContainer } from "react-toastify";
import { database } from "../../../utils/AppwriteConfig";
import { MAP_COLLECTION_ID } from "../../../utils/AppwriteConfig";
import { DATABASE_ID } from "../../../utils/AppwriteConfig";
import { useLocation } from "react-router-dom";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  Typography,
  Box,
  Container,
  Grid,
  FormControl,
  InputLabel,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function EditPOI() {
  const location = useLocation();
  // get userId

  let poi = location.state.poi;

  const [name, setName] = useState(poi.Name);
  const [latitude, setLatitude] = useState(poi.Latitude);
  const [longitude, setLongitude] = useState(poi.Longitude);
  const [status, setStatus] = useState(poi.Status);
  const [type, setType] = useState(poi.Type);
  const navigate = useNavigate();

  const Successful = () => {
    toast.success("POI has been Updated", {
      position: toast.POSITION.TOP_CENTER,
    });
  };

  const Failed = () => {
    toast.error("Failed to Update POI", {
      position: toast.POSITION.TOP_CENTER,
    });
  };

  const handleSubmit = async () => {
    const data = {
      Name: name,
      Latitude: latitude,
      Longitude: longitude,
      Status: status,
      Type: type,
    };

    const promise = database.updateDocument(
      DATABASE_ID,
      MAP_COLLECTION_ID,
      poi.$id,
      data
    );

    promise.then(
      function (response) {
        Successful();
        console.log(response); // Success
      },
      function (error) {
        Failed();
        console.log(error); // Failure
      }
    );
  };
  return (
    <Container>
      <ToastContainer />
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          color: "#005588",
          marginBottom: 4, // Adjust the bottom margin as needed
        }}
      >
        Edit Point of Interest
      </Typography>
      <Box
        component="form"
        noValidate
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
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
          onChange={(e) => setLatitude(e.target.value)}
          sx={{ m: "1%", mb: "4%" }}
        />

        <TextField
          fullWidth
          label="Longitude"
          variant="outlined"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
          sx={{ m: "1%", mb: "4%" }}
        />

        <FormControl fullWidth>
          <InputLabel id="type-label">Type</InputLabel>
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
          <Button onClick={handleSubmit} variant="contained">
            Edit PoI
          </Button>

          <Button
            startIcon={<ArrowBackIcon />}
            variant="outlined"
            onClick={() => navigate("/points-of-interest")}
          >
            Go Back
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
