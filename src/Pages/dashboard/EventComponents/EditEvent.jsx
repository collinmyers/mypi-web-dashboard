import "../../../styling/EditEventStyle.css";
import React, { useState, useEffect } from "react";
import { Databases, Client,Storage } from "appwrite";
import { toast,ToastContainer } from "react-toastify";




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
  const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
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
  const database = new Databases(client);
  const databaseID = "653ae4b2740b9f0a5139";
  const collectionId = "655280f07e30eb37c8e8";

  database
    .listDocuments(databaseID, collectionId)
    .then((response) => {
      setList(response.documents);
    })
    .catch((error) => {
      console.error("Error fetching documents:", error);
    });
  };

  const createImage = async () =>{
 

    const storage = new Storage(client); 
    const promise = storage.createFile("653ae4d2b3fcc68c10bf",newFile.name,newFile);

    promise.then(function (response) {
      console.log(response); // Success
  }, function (error) {
      console.log(error); // Failure
  });
  };

  const deleteImage = async () => {
   
    const storage = new Storage(client);
    console.log(currentFile.name);
    const promise = storage.deleteFile("653ae4d2b3fcc68c10bf",currentFile.name);

    promise.then(function (response) {
      console.log(response); // Success
  }, function (error) {
      console.log(error); // Failure
  }); 
  };
  
  const getImage = async () => {
    try {
     
      const storage = new Storage(client);
  
      const response = await storage.getFileView("653ae4d2b3fcc68c10bf", selectedItem.FileID);
  
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
      const storage = new Storage(client);
      const response = await storage.getFile("653ae4d2b3fcc68c10bf", selectedItem.FileID);
  
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
        
          const database = new Databases(client);
          const databaseID = "653ae4b2740b9f0a5139";
          const collectionId = "655280f07e30eb37c8e8";

          await database.updateDocument(databaseID,collectionId,selectedItem.$id,data);
  
         
          setSuccessfullyUpdated(true);
          clearInput();
            
        } catch (error) {
          setSuccessfullyUpdated(false);
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
        {imageUrl && (
          <img
            src={imageUrl}
            alt={"Event Image"}
            style={{ width: "200px", height: "150px" }} // Set your desired width and height
          />
        )}
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

