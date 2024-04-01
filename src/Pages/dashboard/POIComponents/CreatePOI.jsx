import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styling/POIStyling/CreatePOIStyle.css";
import {ID} from "appwrite";
import {database} from "../../../utils/AppwriteConfig";

import {MAP_COLLECTION_ID} from "../../../utils/AppwriteConfig";
import {DATABASE_ID} from "../../../utils/AppwriteConfig";
import { toast ,ToastContainer} from "react-toastify";

export default function CreatePOI(){

const [name,setName] = useState("");
const [latitude,setLatitude] = useState("");
const [longitude,setLongitude] = useState("");
const [status, setStatus] = useState("Open");
const [type, setType] = useState("");
const navigate = useNavigate();

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
  

useEffect(()=>{

});

const handleSubmit = async () => {

    console.log(name);
    console.log(latitude);
    console.log(longitude);
    console.log(status);
    console.log(type);

   const data = {
    Name: name,
    Latitude: latitude,
    Longitude: longitude,
    Status: status,
    Type: type
   };

   try{
    const response = await database.createDocument(DATABASE_ID,MAP_COLLECTION_ID, ID.unique(), data);
    SuccessfulCreation();
   }catch(response){
    creationFailed();
    console.log(response);
   }

};

    return(
        <div>
        <ToastContainer/>
        <div className="createPOIContainer">
        <h1 className="createPOITitle">New POI</h1>
        <input className="poiName" type="text" placeholder="Name" onChange={(e) => setName(e.target.value)}  />
        <input type="text" placeholder="Latitude" value={latitude}  onChange={(e) => {
            const value = e.target.value;
            if (/^-?\d*\.?\d*$/.test(value)) {
              setLatitude(value);
            }
          }}/>
          <input type="text" placeholder="Longitude" value={longitude} onChange={(e) => {const value = e.target.value;
            if (/^-?\d*\.?\d*$/.test(value)) {
              setLongitude(value);
            }
          }}/>
        <label className="statusLabel">
        Status:      
        <select name="poiStatus" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Open">Open</option>
          <option value="Closed">Closed</option>
        </select>
        </label>
        <input className="poiType" type="text" placeholder="Type" onChange={(e) => setType(e.target.value)} />

        
        <button className="createPOIButton" onClick={handleSubmit}>Create POI</button>
        <button className="backPOIButton" onClick={() => navigate("/poiEditor")}>Back to POI Menu</button>

        </div>
        </div>
    );
}