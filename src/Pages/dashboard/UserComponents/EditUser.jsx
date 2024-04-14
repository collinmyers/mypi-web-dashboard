import React, { useEffect, useState } from "react";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { DATABASE_ID, EDITUSER_FUNCTION_ID, USER_ALIAS_TABLE_ID, database, functions } from "../../../utils/AppwriteConfig";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ID, Query } from "appwrite";
import { ToastContainer, toast } from "react-toastify";

export default function EditUser() {

    const location = useLocation();
    let user = location.state.user;


    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [labels, setLabel] = useState(user.labels);
    const [alias, setAlias] = useState("");
    const [prevAlias, setPrevAlias] = useState("");
    const [userID, setUserID] = useState(user.$id);
    const [userAliasDocID, setUserAliasDocID] = useState("");
    const [checkedItems, setCheckedItems] = useState({
        PrivilegedUser: false,
        ManageUsers: false,
        ManagePoints: false,
        ManageEvents: false,
        ManageNotifications: false,
        ManagePermissions: false,
        ManageParkInfo: false,
        ManageFaq: false,
        FoodTruck: false
    });

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
                    setPrevAlias(response.documents.at(0).UserName);
                    setAlias(response.documents.at(0).UserName);
                    setUserAliasDocID(response.documents.at(0).$id);
                }

            } catch (error) {
                console.error(error);
            }
        };

        const checkUserLabels = async () => {

            const updatedCheckedItems = { ...checkedItems };
            labels.forEach(permission => {
                if (Object.prototype.hasOwnProperty.call(updatedCheckedItems, permission)) {
                    updatedCheckedItems[permission] = true;
                }
            });
            setCheckedItems(updatedCheckedItems);
        };

        checkUserLabels();
        getUserAlias();
    }, []);

    const timeout = () => {
        setTimeout(() => {
            navigate("/users");
        }, 2000);
    };

    const Successful = () => {
        toast.success("User has been Updated", {
            position: toast.POSITION.TOP_CENTER,
        });
        timeout();
    };

    const Failed = () => {
        toast.error("Failed to Update User", {
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
                JSON.stringify(data),
                false,
                "/",
                "PATCH",
                data
            );
            if (alias != ""  && prevAlias == "") {

                await database.createDocument(
                    DATABASE_ID,
                    USER_ALIAS_TABLE_ID,
                    ID.unique(),
                    { UserID: userID, UserName: alias}
                );
            }

            else if(alias != ""){
                await database.updateDocument(
                    DATABASE_ID,
                    USER_ALIAS_TABLE_ID,
                    userAliasDocID,
                    { UserID: userID, UserName: alias }
                );
            }

            else if(alias == ""){
                await database.deleteDocument(
                    DATABASE_ID,
                    USER_ALIAS_TABLE_ID,
                    userAliasDocID
                );
            }


            Successful();
        } catch (error) {
            console.log(error);
            Failed();
        }

    };

    function handleChange(event) {
        const { name, checked } = event.target;
        setCheckedItems({
            ...checkedItems,
            [name]: checked,
        });

        let updatedLabels = [];

        for (const key in checkedItems) {
            if (Object.prototype.hasOwnProperty.call(checkedItems, key) && checkedItems[key]) {
                updatedLabels.push(key);
            }
        }

        if (checked) {
            setLabel([...updatedLabels, name]);
        } else {
            setLabel(updatedLabels.filter((label) => label !== name));
        }
    }


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

                <label>
                    <input
                        type="checkbox"
                        name="PrivilegedUser"
                        checked={checkedItems.PrivilegedUser}
                        onChange={handleChange}
                    />
                    PrivilegedUser
                </label>
                <br></br>
                <label>
                    <input
                        type="checkbox"
                        name="ManageUsers"
                        checked={checkedItems.ManageUsers}
                        onChange={handleChange}
                    />
                    ManageUsers
                </label>
                <br></br>

                <label>
                    <input
                        type="checkbox"
                        name="ManagePoints"
                        checked={checkedItems.ManagePoints}
                        onChange={handleChange}
                    />
                    ManagePoints
                </label>
                <br></br>

                <label>
                    <input
                        type="checkbox"
                        name="ManageEvents"
                        checked={checkedItems.ManageEvents}
                        onChange={handleChange}
                    />
                    ManageEvents
                </label>
                <br></br>

                <label>
                    <input
                        type="checkbox"
                        name="ManageNotifications"
                        checked={checkedItems.ManageNotifications}
                        onChange={handleChange}
                    />
                    ManageNotifications
                </label>
                <br></br>

                <label>
                    <input
                        type="checkbox"
                        name="ManagePermissions"
                        checked={checkedItems.ManagePermissions}
                        onChange={handleChange}
                    />
                    ManagePermissions
                </label>
                <br></br>

                <label>
                    <input
                        type="checkbox"
                        name="ManageParkInfo"
                        checked={checkedItems.ManageParkInfo}
                        onChange={handleChange}
                    />
                    ManageParkInfo
                </label>
                <br></br>

                <label>
                    <input
                        type="checkbox"
                        name="ManageFaq"
                        checked={checkedItems.ManageFaq}
                        onChange={handleChange}
                    />
                    ManageFaq
                </label>
                <br></br>

                <label>
                    <input
                        type="checkbox"
                        name="FoodTruck"
                        checked={checkedItems.FoodTruck}
                        onChange={handleChange}
                    />
                    FoodTruck
                </label>

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
                        onClick={() => navigate("/users")}
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