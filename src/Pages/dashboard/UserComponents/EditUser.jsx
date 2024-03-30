import React, { useEffect, useState } from "react";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { database } from "../../../utils/AppwriteConfig";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";


export default function EditUser(){

    const location = useLocation();
    let user = location.state.user;


    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [label, setLabel] = useState(user.label);
    const [alias, setAlias] = useState(user.alias);

    const navigate = useNavigate();

    useEffect(() => {});



    return(
        <Container>
            <Typography variant="h4" gutterBottom className="editUserTitle">
                Edit User
            </Typography>

            <Box component="form" noValidate sx={{ mt: 1 }}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    variant="outlined"
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    variant="outlined"
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Label"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    variant="outlined"
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Alias"
                    value={alias}
                    onChange={(e) => setAlias(e.target.value)}
                    variant="outlined"
                />
                <div className="buttonWrapper">
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate(-1)}
                        variant="outlined"
                        className="actionButton"
                    >
                    Go Back
                    </Button>
                </div>
            </Box>
        </Container>
    );
}