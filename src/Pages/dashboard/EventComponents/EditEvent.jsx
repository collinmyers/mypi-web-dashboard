import "../../../styling/EventsStyling/EditEventStyle.css";
import React, { useState, useEffect } from "react";
import { toast,ToastContainer } from "react-toastify";
import {database} from "../../../utils/AppwriteConfig";
import {storage} from "../../../utils/AppwriteConfig";
import {BUCKET_ID} from "../../../utils/AppwriteConfig";
import {EVENTS_COLLECTION_ID} from "../../../utils/AppwriteConfig";
import {DATABASE_ID} from "../../../utils/AppwriteConfig";
import { useLocation, useNavigate } from "react-router-dom";


export default function EditEvent(){
  const[currentFile,setCurrentFile] = useState("");
  const[newFile,setNewFile] = useState("");
  const navigate = useNavigate();
  
    const location = useLocation();
    // get userId
   
    let selectedItem = location.state.Event;

  const[imageUrl, setImageUrl] = useState("");

  const [name, setName] = useState(selectedItem.Name);
  const [date, setDate] = useState(selectedItem.DateTime);
  const [shortDescription, setShortDescription] = useState(selectedItem.EventListDescription);
  const [longDescription, setLongDescription] = useState(selectedItem.EventDetailsDescription);
  const [latitude,setLatitude] = useState(selectedItem.Latitude);
  const [longitude,setLongitude] = useState(selectedItem.Longitude);
  const [uploaderKey,setUploaderKey] = useState(false);

useEffect(() =>{
getImage();
getCurrentFile();
},[]);



  const SuccessfullEdit = () => {
    toast.success("Event Edited", {
      position: toast.POSITION.TOP_CENTER,
    });
  
  };
  
  const EditFailed = () => {
    toast.error("Failed to Edit Event", {
      position: toast.POSITION.TOP_CENTER,
    });
  };





  const createImage = async () =>{

    const promise = storage.createFile(BUCKET_ID,newFile.name,newFile);

    promise.then(function (response) {
      console.log(response); // Success
  }, function (error) {
      console.log(error); // Failure
  });
  };

  const deleteImage = async () => {
   
    console.log(currentFile.name);
    const promise = storage.deleteFile(BUCKET_ID,currentFile.name);

    promise.then(function (response) {
      console.log(response); // Success
  }, function (error) {
      console.log(error); // Failure
  }); 
  };
  
  const getImage = async () => {
    try {
     
  
      const response = await storage.getFileView(BUCKET_ID, selectedItem.FileID);
  
      setImageUrl((prevImageUrl) => {
        if (response.href) {
          return response.href;
        }
        return prevImageUrl;
      });
      console.log(response); // Success
    } catch (error) {
      console.error("Error fetching image URL", error); // Failure
    }
  };
  
  const getCurrentFile = async()=>{
    try {
      const response = await storage.getFile(BUCKET_ID, selectedItem.FileID);
  
     setCurrentFile(response);
      console.log(response); // Success
    } catch (error) {
      console.error("Error fetching image URL", error); // Failure
    }
  };
  
  
  const  handleSubmit = async () =>{
    //call create and delete file if a new one has been uploaded.
   if(newFile){
    deleteImage();
    createImage();
   }

    if (selectedItem) {
 

      const data = { // add lat and long 
        FileID: newFile ? newFile.name : currentFile.name,
        Name: name,
        DateTime: date,
        EventListDescription: shortDescription,
        EventDetailsDescription: longDescription,
        Latitude:  latitude,
        Longitude: longitude,
      };

        try {
       

          await database.updateDocument(DATABASE_ID,EVENTS_COLLECTION_ID,selectedItem.$id,data);
  
         
          SuccessfullEdit();
          clearInput();
            
        } catch (error) {
          EditFailed();
          console.error("Error updating document:", error);
        }
      }else{
    console.log();
      }
  }; 


  const clearInput = () =>{
    setName("");
    setDate("");
    setShortDescription("");
    setLongDescription("");
    setLatitude("");
    setLongitude("");
    setNewFile(null);
    setImageUrl("");
    setUploaderKey((prevValue) => !prevValue);
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
        setNewFile(file);
        setImageUrl(URL.createObjectURL(file));
        setUploaderKey((prevKey) => prevKey + 1);
    }
};
  


  return (
    <div>
    <ToastContainer/>
    <div className="dropdown-container">
    <h1 className="editEventTitle">Edit Event</h1>
    
        {imageUrl && (<img src={imageUrl} alt={"Event Image"} style={{ width: "200px", height: "150px" }}/>)}
        <input className="uploader" type="file" key={uploaderKey} id="uploader"  onChange={handleUpload}/>
        <input className="eventName" type="text" placeholder={"Name"} id = "eventName" value={name} onChange={(e) => setName(e.target.value)} />
        <input className= "eventDate" type="text" placeholder={"Date"} value={date} onChange={(e) => setDate(e.target.value)} />
        <input type="text" placeholder={"Short Description"} value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} />
        <input type="text" placeholder={ "Long Description"} value={longDescription} onChange={(e) => setLongDescription(e.target.value)} />
        <input type="number" placeholder={"Latitude"} value={latitude} onChange={(e) => setLatitude(e.target.value)} />
        <input type="number" placeholder={ "Longitude"} value={longitude} onChange={(e) => setLongitude(e.target.value)} />
        <button className="editEventSubmit" onClick={handleSubmit} >Edit Event</button>
        <button onClick={() => navigate(-1)}>go back</button>

      </div>
    </div>
  );
}

