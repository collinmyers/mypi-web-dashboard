import React, { useState, useEffect } from "react";
import { Databases, Client,ID, Account, Storage} from "appwrite";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "../../../styling/EditPOIStyle.css";
import { toast,ToastContainer } from "react-toastify";

import { useLocation } from "react-router-dom";

import { useParams } from "react-router-dom";



export default function EditPOI(){

    const location = useLocation();
    const navigate = useNavigate();
    // get userId
    let ID = location.state.poiID;


    return(
        <div>
      <h1>Edit POI with ID: {ID}</h1>
      {/* Other edit form components */}
      <button onClick={() => navigate(-1)}>go back</button>

    </div>

    );
}