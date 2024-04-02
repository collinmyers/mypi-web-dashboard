import React, { useEffect, useState } from "react";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { DATABASE_ID, EDITUSER_FUNCTION_ID, USER_ALIAS_TABLE_ID, database, functions } from "../../../utils/AppwriteConfig";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Query } from "appwrite";
import { ToastContainer, toast } from "react-toastify";


export default function EditUser() {

    const location = useLocation();
    let user = location.state.user;


    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [labels, setLabel] = useState(user.labels);
    const [alias, setAlias] = useState("");
    const [userID, setUserID] = useState(user.$id);
    const [userAliasDocID, setUserAliasDocID] = useState("");

    const navigate = useNavigate();

    useEffect(() => {

        const getUserAlias = async () => {
            try {
                const response = await database.listDocuments(
                    DATABASE_ID,
                    USER_ALIAS_TABLE_ID,
                    [
                        Query.equal("UserID", [userID])
                    ]
                );
                if (response.documents.length > 0) {
                    setAlias(response.documents.at(0).UserName);
                    setUserAliasDocID(response.documents.at(0).$id);
                }

            } catch (error) {
                console.error(error);
            }
        };

        getUserAlias();
    }, []);

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
            name: name,
            email: email,
            labels: labels,
            targetUserID: userID
        };
        try {
            await functions.createExecution(
                EDITUSER_FUNCTION_ID,
                "",
                false,
                "/",
                "PATCH",
                data
            );
            await database.updateDocument(
                DATABASE_ID,
                USER_ALIAS_TABLE_ID,
                userAliasDocID,
                { UserID: userID, UserName: alias }
            );
            Successful();
        } catch (error) {
            console.log(error);
            Failed();
        }

    };



    return (
        <Container>
            <ToastContainer />
            <Typography variant="h4" gutterBottom className="editUserTitle">
                Edit User
            </Typography>

            <Typography>
                User ID = {userID}
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
                    label="Labels"
                    value={labels}
                    onChange={(e) => setLabel(e.target.value)}
                    variant="outlined"
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label="Alias"
                    value={alias}
                    onChange={(e) => setAlias(e.target.value)}
                    variant="outlined"
                />
                <div className="buttonWrapper">
                    <Button onClick={handleSubmit} variant="contained" className="actionButton">
                        Update User Info
                    </Button>

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