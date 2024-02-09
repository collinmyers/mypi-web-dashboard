import React, { useState, useEffect } from "react";
import { Databases, Client,ID, Account, Storage} from "appwrite";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "../../../styling/EditPOIStyle.css";
import { toast,ToastContainer } from "react-toastify";


export default function EditPOI(){




    return(
        <div className="editPOIContainer">
        <h1 className="title">Edit POI</h1>
        <input className="uploader" type="file"  id="uploader" />
        <input className="eventName" type="text" placeholder="Name"  />
        <input className= "eventDate" type="text" placeholder="Date"  />
        <input type="text" placeholder="Short Description"  />
        <input type="text" placeholder="Long Description" />
        <input type="number" placeholder="Latitude"  />
        <input type="number" placeholder="Longitude"  />
        <button >Edit POI</button>
        </div>

    );
}