import "../../../styling/EventsStyling/EditEventStyle.css";
import React, { useState, useEffect } from "react";
// import { Databases, Client,Storage } from "appwrite";
import { toast,ToastContainer } from "react-toastify";
import {account} from "../../../utils/AppwriteConfig";
import {database} from "../../../utils/AppwriteConfig";
import {storage} from "../../../utils/AppwriteConfig";
import {BUCKET_ID} from "../../../utils/AppwriteConfig";
import {EVENTS_COLLECTION_ID} from "../../../utils/AppwriteConfig";
import {DATABASE_ID} from "../../../utils/AppwriteConfig";



export default function EditEvent({onDataChange}){
  const[currentFile,setCurrentFile] = useState("");
  const[newFile,setNewFile] = useState("");
  const [successfullyUpdated,setSuccessfullyUpdated] = useState(false);

  const[imageUrl, setImageUrl] = useState("");

  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [latitude,setLatitude] = useState("");
  const [longitude,setLongitude] = useState("");
  const [uploaderKey,setUploaderKey] = useState(false);

  const [list, setList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);


  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const SuccessfullEdit = () => {
    toast.success("New Event Created", {
      position: toast.POSITION.TOP_CENTER,
    });
  
  };
  
  const EditFailed = () => {
    toast.error("Failed to Create Event", {
      position: toast.POSITION.TOP_CENTER,
    });
  };


  useEffect(() => {
     getEvents();
     console.log("mount");

  if (selectedItem) {
    getCurrentFile();
    setDate(selectedItem.DateTime);
    setLongDescription(selectedItem.EventDetailsDescription);
    setShortDescription(selectedItem.EventListDescription);
    setLatitude(selectedItem.Latitude);
    setLongitude(selectedItem.Longitude);
    setName(selectedItem.Name);
    getImage();
  }
  


  if(successfullyUpdated){
    
  onDataChange();    
  setSuccessfullyUpdated(false);
  }
  }, [selectedItem,onDataChange,successfullyUpdated]);



  const getEvents = async () => {


  // Initialize the Databases class


  database
    .listDocuments(DATABASE_ID, EVENTS_COLLECTION_ID)
    .then((response) => {
      setList(response.documents);
    })
    .catch((error) => {
      console.error("Error fetching documents:", error);
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
  
  
  const  handleSelectEvent = async () =>{
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
  
         
          setSuccessfullyUpdated(true);
          SuccessfullEdit();
          clearInput();
            
        } catch (error) {
          setSuccessfullyUpdated(false);
          EditFailed();
          console.error("Error updating document:", error);
        }
      }else{
    console.log();
      }
  }; 


  const clearInput = () =>{
    setSelectedItem(null);
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
  
  const renderList = ({ item }) => {
    return (
      <div key={item.$id} className="dropdown-item" >
      <p style={{ color: selectedItem === item ? "#8FA063" : "#134C77" }} onClick={() => {
        clearInput();
        setSelectedItem(item);
        setDropdownVisible(false);       
          }}>{item.Name}</p>
      </div>
      );
   };

  return (
    <div>
    <ToastContainer/>
    <div className="dropdown-container">
    <h1 className="editEventTitle">Edit Event</h1>
        <button className="dropdown-toggle" onClick={toggleDropdown}>
          {selectedItem ? selectedItem.Name : "Select Event"}
        </button>
        {dropdownVisible && (<div className="dropdown-wrapper">{list.map((item) => renderList({ item }))}</div>)}
        {imageUrl && (<img src={imageUrl} alt={"Event Image"} style={{ width: "200px", height: "150px" }}/>)}
        <input className="uploader" type="file" key={uploaderKey} id="uploader"  onChange={(e) => setNewFile(e.target.files[0])}/>
        <input className="eventName" type="text" placeholder={selectedItem ? selectedItem.Name: "Name"} id = "eventName" value={name} onChange={(e) => setName(e.target.value)} />
        <input className= "eventDate" type="text" placeholder={selectedItem ? selectedItem.DateTime: "Date"} value={date} onChange={(e) => setDate(e.target.value)} />
        <input type="text" placeholder={selectedItem ? selectedItem.EventListDescription: "Short Description"} value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} />
        <input type="text" placeholder={selectedItem ? selectedItem.EventDetailsDescription: "Long Description"} value={longDescription} onChange={(e) => setLongDescription(e.target.value)} />
        <input type="number" placeholder={selectedItem ? selectedItem.Latitude: "Latitude"} value={latitude} onChange={(e) => setLatitude(e.target.value)} />
        <input type="number" placeholder={selectedItem ? selectedItem.Longitude: "Longitude"} value={longitude} onChange={(e) => setLongitude(e.target.value)} />
        <button className="editEventSubmit" onClick={handleSelectEvent} >Edit Event</button>
      </div>
    </div>
  );
}

