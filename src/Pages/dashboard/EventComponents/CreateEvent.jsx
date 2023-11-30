import React, { useState } from "react";
import { Databases, Client,ID, Account, Storage} from "appwrite";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "../../../styling/CreateEventStyle.css";
import { toast,ToastContainer } from "react-toastify";




export default function CreateEvent(){
  const[fileID, setFileID] = useState("");
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [latitude,setLatitude] = useState("");
  const [longitude,setLongitude] = useState("");


const navigate = useNavigate();
  
  const navigateToLogin = () => {
    navigate("/");
};
function pause(milliseconds) {
  return new Promise(resolve => {
    setTimeout(resolve, milliseconds);
  });
}

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


  const handleLogout = async () => {
    try {
        const client = new Client()
            .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
            .setProject(import.meta.env.VITE_APPWRITE_PROJECT);

        const account = new Account(client);

        await account.deleteSessions("current");

        navigateToLogin();

    } catch (error) {
        console.error(error);
    }
};


  const handleButtonClick = async () => {
    try {// Initialize the Appwrite client
    const client = new Client()
  
      .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT) // Replace with your Appwrite endpoint
      .setProject(import.meta.env.VITE_APPWRITE_PROJECT); // Replace with your Appwrite project ID;

  //new storage session  
      const storage = new Storage(client);
//create file for uimage upload
      const promise = storage.createFile(
        "653ae4d2b3fcc68c10bf",
        fileID,
        document.getElementById("uploader").files[0]
        );

      promise.then(function (response) {
        console.log(response); // Success
    }, function (error) {
        console.log(error); // Failure
    });
        
    // Initialize the Appwrite database service
    const database = new Databases(client);

      // Replace with your collection ID
      const collectionId = "655280f07e30eb37c8e8";
      const databaseID = "653ae4b2740b9f0a5139";
    //   const documnetID ="";

      // Your data to be inserted into the collection
      const data = { // add lat and long 
        FileID: fileID,
        Name: name,
        DateTime: date,
        EventListDescription: shortDescription,
        EventDetailsDescription: longDescription,
        Latitude: latitude,
        Longitude: longitude,
      };

      // Call the Appwrite SDK method to create a document in the collection
      const response = await database.createDocument(databaseID,collectionId, ID.unique(), data);
      console.log(response);
      SuccessfullCreation();
      await pause(2000);
      window.location.reload();
      // Handle success or update UI as needed
      
    } catch (error) {
      creationFailed();
      console.error(error);
      // Handle error or show error message
    }
  };

  return (
    <div>
    <ToastContainer/>
    <div className="newEventContainer">
    <h1 className="title">New Event</h1>
        <input className="uploader" type="file" id="uploader" />
        <input className="fileID" type="text" placeholder="File ID" value={fileID} onChange={(e) => setFileID(e.target.value)} />
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

