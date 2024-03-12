import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styling/POIStyling/EditPOIStyle.css";
import { toast,ToastContainer } from "react-toastify";
import {database} from "../../../utils/AppwriteConfig";
import {MAP_COLLECTION_ID} from "../../../utils/AppwriteConfig";
import {DATABASE_ID} from "../../../utils/AppwriteConfig";
import { useLocation } from "react-router-dom";

export default function EditPOI(){

    const location = useLocation();
    // get userId
   
    let poi = location.state.poi;

  const [name,setName] = useState(poi.Name);
  const [latitude,setLatitude] = useState(poi.Latitude);
  const [longitude,setLongitude] = useState(poi.Longitude);
  const [status, setStatus] = useState(poi.Status);
  const [type, setType] = useState(poi.Type);
  const navigate = useNavigate();


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
  Name: name,
  Latitude: latitude,
  Longitude: longitude,
  Status: status,
  Type: type
 };

 const promise = database.updateDocument(DATABASE_ID, MAP_COLLECTION_ID, poi.$id,data);

promise.then(function (response) {
  Successful();
    console.log(response); // Success
}, function (error) {
  Failed();
    console.log(error); // Failure
});
 

};


    return(
        <div>
        <ToastContainer/>
        <div className="editPOIContainer">
        <h1 className="title">Edit POI</h1>
        <input className="poiName" type="text" placeholder={poi.Name} onChange={(e) => setName(e.target.value)}  />
        <input type="number" placeholder={poi.Latitude} onChange={(e) => setLatitude(e.target.value)} />
        <input type="number" placeholder={poi.Longitude} onChange={(e) => setLongitude(e.target.value)}/>
        <label className="statusLabel">
        Status:      
        <select name="poiStatus" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Open">Open</option>
          <option value="Closed">Closed</option>
        </select>
        </label>
        <input className="poiType" type="text" placeholder={poi.Type} onChange={(e) => setType(e.target.value)} />

        
        <button onClick={handleSubmit}>Edit POI</button>
        <button onClick={() => navigate(-1)}>go back</button>

        </div>
    </div>

    );
}