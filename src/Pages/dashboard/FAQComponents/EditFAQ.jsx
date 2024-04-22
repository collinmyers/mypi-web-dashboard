import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styling/NotificationStyling/EditNotificationStyle.css";
// import {ID} from "appwrite";
import {database} from "../../../utils/AppwriteConfig";

import {FAQ_COLLECTION_ID} from "../../../utils/AppwriteConfig";
import {DATABASE_ID} from "../../../utils/AppwriteConfig";
import { toast, ToastContainer} from "react-toastify";
import { useLocation } from "react-router-dom";
import {
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Container,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";



export default function EditFAQ(){
  const location = useLocation();
  let faq = location.state.FAQ;

  const [question, setQuestion] = useState(faq.Question);
  const [answer, setAnswer] = useState(faq.Answer);
  
  
  const navigate = useNavigate();
  const timeout = () =>{
    setTimeout(() => {
        navigate("/faq");
    }, 1000);
  };

  const Successful = () => {
    toast.success("FAQ Updated", {
      position: toast.POSITION.TOP_CENTER,
    });
    timeout();
  };

  const Failed = () => {
    toast.error("Failed to Update FAQ", {
      position: toast.POSITION.TOP_CENTER,
    });
  };

  useEffect(() => {});

  const handleSubmit = async () => {
   

    const data = {
      Question: question,
      Answer: answer,
    };

    try {
      await database.updateDocument(
        DATABASE_ID,
        FAQ_COLLECTION_ID,
        faq.$id,
        data
      );
      Successful();
    } catch (error) {
      Failed();
      console.log(error);
    }
  };

  return (
    <Container>
      <ToastContainer/>
      <Typography variant="h4" gutterBottom className="editFAQTitle">
        Edit FAQ
      </Typography>

      <Box component="form"  noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          label="Question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          variant="outlined"
        />

        <TextField
          margin="normal"
          required
          fullWidth
          label="Details"
          multiline
          rows={4}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          variant="outlined"
        />


<div className="buttonWrapper">

        <Button onClick={handleSubmit} variant="contained" className="actionButton">
          Edit FAQ
        </Button>

        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/faq")}
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