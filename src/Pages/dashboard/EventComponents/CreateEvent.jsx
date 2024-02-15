import React, { useState, useEffect } from "react";
import { ID} from "appwrite";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "../../../styling/EventsStyling/CreateEventStyle.css";
import { toast,ToastContainer } from "react-toastify";
import {account} from "../../../utils/AppwriteConfig";
import {database} from "../../../utils/AppwriteConfig";
import {storage} from "../../../utils/AppwriteConfig";
import {BUCKET_ID} from "../../../utils/AppwriteConfig";
import {EVENTS_COLLECTION_ID} from "../../../utils/AppwriteConfig";
import {DATABASE_ID} from "../../../utils/AppwriteConfig";





export default function CreateEvent(){
  const [responseData, setResponseData] = useState(null);
  const[fileID,setFileID] = useState("");
  const[file,setFile] = useState("");
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [latitude,setLatitude] = useState("");
  const [longitude,setLongitude] = useState("");
  const [uploaderKey, setUploaderKey] = useState(false);
  // const client = new Client()
  //     .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  //     .setProject(import.meta.env.VITE_APPWRITE_PROJECT);

const navigate = useNavigate();
  
  const navigateToLogin = () => {
    navigate("/");
};

const SuccessfullCreation = () => {
  toast.success("New Event Created", {
    position: toast.POSITION.TOP_CENTER,
  });

};

const creationFailed = () => {
  toast.error("Failed to Create Event", {
    position: toast.POSITION.TOP_CENTER,
  });
};


useEffect(() => {

if (responseData) {
  // console.log("Response received:", responseData);
    setResponseData(null); // Call onDataChange when responseData changes
 }

}, [responseData]);


  const handleLogout = async () => {
    try {

        await account.deleteSessions("current");
        navigateToLogin();

    } catch (error) {
        console.error(error);
    }
};


const handleButtonClick = async () => {
    const data = { // add lat and long 
      FileID: fileID,
      Name: name,
      DateTime: date,
      EventListDescription: shortDescription,
      EventDetailsDescription: longDescription,
      Latitude: latitude,
      Longitude: longitude,
    };
      const promise = storage.createFile(BUCKET_ID,fileID,file);

      promise.then(function (response) {
        createdDoc(data);
    }, function (error) {
      creationFailed();
        console.log(error); // Failure
    });
  };

  const createdDoc = async (data) =>{
try{

     

      const response = await database.createDocument(DATABASE_ID,EVENTS_COLLECTION_ID, ID.unique(), data);
      setResponseData(response);
      SuccessfullCreation();
      clearInput();
      
  }catch(error){
    creationFailed();
  }
 
  };

  const clearInput = () =>{
    setFile("");
    setFileID("");
    setName("");
    setDate("");
    setShortDescription("");
    setLongDescription("");
    setLatitude("");
    setLongitude("");
    setUploaderKey((prevValue) => !prevValue);
  };

  const handleFileChange = (e) => {
    
    setFile(e.target.files[0]);
    setFileID(e.target.files[0].name);
  };
  
  return (
    <div>
    <ToastContainer/>
    <div className="newEventContainer">
    <h1 className="title">New Event</h1>
        <input className="uploader" type="file" key={uploaderKey} id="uploader" onChange={handleFileChange} />
        <input className="eventName" type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className= "eventDate" type="text" placeholder="Date" value={date} onChange={(e) => setDate(e.target.value)} />
        <input type="text" placeholder="Short Description" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} />
        <input type="text" placeholder="Long Description" value={longDescription} onChange={(e) => setLongDescription(e.target.value)} />
        <input type="number" placeholder="Latitude" value={latitude} onChange={(e) => setLatitude(e.target.value)} />
        <input type="number" placeholder="Longitude" value={longitude} onChange={(e) => setLongitude(e.target.value)} />
        <button onClick={handleButtonClick}>Submit</button>
        <button onClick={() => navigate(-1)}>go back</button>

        </div>
      </div>
  );
}

