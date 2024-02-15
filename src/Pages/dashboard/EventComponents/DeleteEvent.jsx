import React, { useState, useEffect } from "react";
import "../../../styling/EventsStyling/DeleteEventStyle.css";
import { toast,ToastContainer } from "react-toastify";
import {account} from "../../../utils/AppwriteConfig";
import {database} from "../../../utils/AppwriteConfig";
import {storage} from "../../../utils/AppwriteConfig";
import {BUCKET_ID} from "../../../utils/AppwriteConfig";
import {EVENTS_COLLECTION_ID} from "../../../utils/AppwriteConfig";
import {DATABASE_ID} from "../../../utils/AppwriteConfig";


export default function DeleteEvent({onDataChange}) {
  const [list, setList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [successfullDeletion, setSuccessfullDeletion] = useState(false);
  
  const [dropdownVisible, setDropdownVisible] = useState(false);
  
 
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

  database
    .listDocuments(DATABASE_ID, EVENTS_COLLECTION_ID,100)
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
        
          
          await database.deleteDocument(DATABASE_ID, EVENTS_COLLECTION_ID, selectedItem.$id);

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
    const promise = storage.deleteFile(BUCKET_ID,selectedItem.FileID);

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
