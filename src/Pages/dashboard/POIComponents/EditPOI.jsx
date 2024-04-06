import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styling/POIStyling/EditPOIStyle.css";
import { toast,ToastContainer } from "react-toastify";
import {database} from "../../../utils/AppwriteConfig";
import {MAP_COLLECTION_ID} from "../../../utils/AppwriteConfig";
import {DATABASE_ID} from "../../../utils/AppwriteConfig";
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


export default function EditPOI(){
  const location = useLocation();
  // get userId

  let poi = location.state.poi;

  const [name] = useState(poi.Name);
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
      <ToastContainer/>
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
        Edit POI
      </Typography>
      <Box component="form"  noValidate sx={{ mt: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Latitude"
              variant="outlined"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Longitude"
              variant="outlined"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Type"
              variant="outlined"
              value={type}
              onChange={(e) => setType(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                id="status"
                value={status}
                label="Status"
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value="Open">Open</MenuItem>
                <MenuItem value="Closed">Closed</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item container spacing={2} justifyContent="center" xs={12}>
            <Grid item>
              <Button onClick={handleSubmit} variant="contained">
                Edit POI
              </Button>
            </Grid>
            <Grid item>
              <Button variant="outlined" onClick={() => navigate("/poiEditor")}>
                Back to POI Menu
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}