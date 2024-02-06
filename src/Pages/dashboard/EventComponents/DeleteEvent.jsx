import React, { useState, useEffect } from "react";
import "../../../styling/DeleteEventStyle.css";
import { Databases, Client, Storage } from "appwrite";
import { toast,ToastContainer } from "react-toastify";


export default function DeleteEvent({onDataChange}) {
  const [list, setList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [successfullDeletion, setSuccessfullDeletion] = useState(false);
  
  const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT);
 
  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };


  
  const SuccessfullDeletion = () => {
    toast.success("Event Deleted", {
      position: toast.POSITION.TOP_CENTER,
    });
  
  };
  
  const DeletionFailed = () => {
    toast.error("Failed to Delete Event", {
      position: toast.POSITION.TOP_CENTER,
    });
  };
  

  useEffect(() => {
    console.log("mount");
  if(successfullDeletion){
    onDataChange();
    setSuccessfullDeletion(false);
  }
  
  getEvents();

  
  }, [onDataChange,successfullDeletion]);

  const getEvents = async () => {


  // Initialize the Databases class
  const database = new Databases(client);
  const databaseID = "653ae4b2740b9f0a5139";
  const collectionId = "655280f07e30eb37c8e8";

  database
    .listDocuments(databaseID, collectionId)
    .then((response) => {
      console.log("Documents:", response.documents);
      setList(response.documents);
    })
    .catch((error) => {
      console.error("Error fetching documents:", error);
    });
  };

  const  handleSelectEvent = async () =>{
    if (selectedItem) {
        try {
        
          const database = new Databases(client);
          const databaseID = "653ae4b2740b9f0a5139";
          const collectionId = "655280f07e30eb37c8e8";
          // const storage = new Storage(client);


          await database.deleteDocument(databaseID, collectionId, selectedItem.$id);

          // Optional: You can update the list to reflect the changes after deletion
          // Clear the selected item
          setSelectedItem(null);
          setSuccessfullDeletion(true);
          deleteImage();
          SuccessfullDeletion(); //success pop up
          
        } catch (error) {
          setSuccessfullDeletion(false);
          DeletionFailed();
          console.error("Error deleting document:", error);
        }
      }else{
        DeletionFailed();

      }
  }; 

  const deleteImage = async () =>{
    const storage = new Storage(client);
    const promise = storage.deleteFile("653ae4d2b3fcc68c10bf",selectedItem.FileID);

    promise.then(function (response) {
      console.log(response); // Success
  }, function (error) {
      console.log(error); // Failure
  }); 
  };

  

  const renderList = ({ item }) => {
    return (
      <div key={item.$id} className="dropdown-item" >
        <p style={{ color: selectedItem === item ? "#8FA063" : "#134C77" }} onClick={() => {
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
    <h1 className="deleteTitle">Delete Event</h1>
        <button className="dropdown-toggle" onClick={toggleDropdown}>
          {selectedItem ? selectedItem.Name : "Select Event"}
        </button>
        {dropdownVisible && ( <div className="dropdown-wrapper">{list.map((item) => renderList({ item }))} </div>)}
        <button className="submit" onClick={handleSelectEvent}>Delete Event</button>
      </div>
      
    </div>
  );
}
