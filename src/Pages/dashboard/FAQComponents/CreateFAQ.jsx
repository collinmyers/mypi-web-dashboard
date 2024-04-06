import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {Container,TextField,Button,Typography,Box,} from "@mui/material";
import { ID } from "appwrite";
import { database } from "../../../utils/AppwriteConfig";
import {FAQ_COLLECTION_ID,DATABASE_ID,} from "../../../utils/AppwriteConfig";
import { toast, ToastContainer } from "react-toastify";
import "../../../styling/NotificationStyling/CreateNotificationStyle.css"; // Obsolete styling file

export default function CreateFAQ() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const navigate = useNavigate();
  const timeout = () =>{
    setTimeout(() => {
        navigate("/faq");
    }, 2000);
  };

  const SuccessfulCreation = () => {
    toast.success("New FAQ Created", {
      position: toast.POSITION.TOP_CENTER,
    });
    timeout();
  };

  const creationFailed = () => {
    toast.error("Failed to Create FAQ", {
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
      Question: question,
      Answer: answer,
    };
    if (!data.Question || !data.Answer) {
        UnfilledFields();
        return;

    }



    try {
      await database.createDocument(
        DATABASE_ID,
        FAQ_COLLECTION_ID,
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
    setQuestion("");
    setAnswer("");
  };

  return (
    <Container maxWidth="sm">
      <ToastContainer />
      <Typography
        variant="h4"
        sx={{ color: "#005588", fontWeight: "bold", textAlign: "center", my: 2 }}
      >
        New FAQ
      </Typography>
      <TextField
        fullWidth
        label="Question"
        variant="outlined"
        margin="normal"
        onChange={(e) => setQuestion(e.target.value)}
      />
      <TextField
        fullWidth
        label="Answer"
        variant="outlined"
        multiline
        margin="normal"
        onChange={(e) => setAnswer(e.target.value)}
      />
     
      <Box sx={{ mt: 2, display: "flex", justifyContent: "center", gap: 2 }}>
        <Button variant="contained" onClick={handleSubmit}>
          Create FAQ
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate("/faq")}
        >
          Back
        </Button>
      </Box>
    </Container>
  );
}
