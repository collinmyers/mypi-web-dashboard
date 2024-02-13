import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "../../../styling/CreatePOIStyle.css";
import {ID} from "appwrite";
import {account} from "../../../utils/AppwriteConfig";
import {database} from "../../../utils/AppwriteConfig";
import {storage} from "../../../utils/AppwriteConfig";
import {BUCKET_ID} from "../../../utils/AppwriteConfig";
import {MAP_COLLECTION_ID} from "../../../utils/AppwriteConfig";
import {DATABASE_ID} from "../../../utils/AppwriteConfig";


export default function CreatePOI(){

const [name,setName] = useState("");
const [latitude,setLatitude] = useState("");
const [longitude,setLongitude] = useState("");
const [status, setStatus] = useState("Open");
const [type, setType] = useState("");

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
    
   }catch(response){
    console.log(response);
   }

};

    return(
        <div className="createPOIContainer">
        <h1 className="title">New POI</h1>
        <input className="poiName" type="text" placeholder="Name" onChange={(e) => setName(e.target.value)}  />
        <input type="number" placeholder="Latitude" onChange={(e) => setLatitude(e.target.value)} />
        <input type="number" placeholder="Longitude" onChange={(e) => setLongitude(e.target.value)}/>
        <label className="statusLabel">
        Status:      
        <select name="poiStatus" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Open">Open</option>
          <option value="Closed">Closed</option>
        </select>
        </label>
        <input className="poiType" type="text" placeholder="Type" onChange={(e) => setType(e.target.value)} />

        
        <button onClick={handleSubmit}>Create POI</button>
        </div>

    );
}