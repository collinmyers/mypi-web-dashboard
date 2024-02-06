import React, { useState, useEffect } from "react";
import { Databases, Client,ID, Account, Storage} from "appwrite";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "../../../styling/CreateEventStyle.css";
import { toast,ToastContainer } from "react-toastify";




export default function CreateEvent({onDataChange}){
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
  const client = new Client()
      .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
      .setProject(import.meta.env.VITE_APPWRITE_PROJECT);

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
console.log("mount");
if (responseData) {
  // console.log("Response received:", responseData);
 
    onDataChange();
    setResponseData(null); // Call onDataChange when responseData changes
 }

}, [responseData,onDataChange]);


  const handleLogout = async () => {
    try {

        const account = new Account(client);

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


      const storage = new Storage(client);
      const promise = storage.createFile(
        "653ae4d2b3fcc68c10bf",
        fileID,
        file
        );

      promise.then(function (response) {
        createdDoc(data);
    }, function (error) {
      creationFailed();
        console.log(error); // Failure
    });
  };

  const createdDoc = async (data) =>{
try{
      const database = new Databases(client);

      const collectionId = "655280f07e30eb37c8e8";
      const databaseID = "653ae4b2740b9f0a5139";

      const response = await database.createDocument(databaseID,collectionId, ID.unique(), data);
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
        <Button className="SignOutButton" variant="contained" color="primary" onClick={handleLogout}> Sign Out</Button>
        </div>
      </div>
  );
}

