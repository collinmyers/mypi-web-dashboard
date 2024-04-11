import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Container,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    Box,
} from "@mui/material";
import { ID, Query } from "appwrite";
import { MAP_COLLECTION_ID, VENDOR_POI_COLLECTION_ID, database } from "../../../utils/AppwriteConfig";
import { DATABASE_ID } from "../../../utils/AppwriteConfig";
import { toast, ToastContainer } from "react-toastify";

export default function CreateVendorPOI() {

    const [name, setName] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [status, setStatus] = useState("Open");
    const [type, setType] = useState("");
    const [POIs, setPOIs] = useState([]);
    const navigate = useNavigate();
    const [selectedPOI, setSelectedPOI] = useState("");

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
                VENDOR_POI_COLLECTION_ID,
                ID.unique(),
                data
            );
            SuccessfulCreation();
        } catch (response) {
            creationFailed();
            console.log(response);
        }
    };




    const renderPOIsDropdown = () => {

        return POIs.map((POI, index) => {

            const POIName = POI.Name;

            return (
                <MenuItem key={index} value={POIName}>
                    {POIName}
                </MenuItem>
            );
        });
    };

    useEffect(() => {
        const getPOIs = async () => {
            try {
                const response = await database.listDocuments(
                    DATABASE_ID,
                    MAP_COLLECTION_ID,
                    [
                        Query.limit(1000), // Fetch all documents
                        Query.offset(0)
                    ]
                );
                setPOIs(response.documents);
            }
            catch (error) {
                console.error("Error fetching documents:", error);
            }
        };
        getPOIs();

    }, [selectedPOI, name, latitude, longitude, status, type]);

    const handleChange = (event) => {
        setSelectedPOI(event.target.value);
        const values = POIs.find(POIs => POIs.Name === event.target.value);

        setName(values.Name);
        setLatitude(values.Latitude);
        setLongitude(values.Longitude);
        setStatus(values.Status);
        setType(values.Type);

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
                Add Vendor POI
            </Typography>
            <FormControl fullWidth>
                <InputLabel>Vendor POI</InputLabel>
                <Select
                    value={selectedPOI}
                    onChange={handleChange}
                >
                    {
                        renderPOIsDropdown()
                    }
                </Select>
            </FormControl>


            <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 2 }}>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    Add Vendor POI
                </Button>
                <Button variant="outlined" onClick={() => navigate("/vendor-points-of-interest")}>
                    Back to Vendor POI Menu
                </Button>
            </Box>
        </Container>
    );
}
