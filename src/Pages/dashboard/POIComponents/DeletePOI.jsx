import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styling/POIStyling/DeletePOIStyle.css";
import { toast,ToastContainer } from "react-toastify";
import {database} from "../../../utils/AppwriteConfig";
import {MAP_COLLECTION_ID} from "../../../utils/AppwriteConfig";
import {DATABASE_ID} from "../../../utils/AppwriteConfig";

export default function DeletePOI(){
    const [list,setList] = useState([]);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [selectedPOI, setSelectedPOI] = useState("");
  
 
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

    useEffect(() =>{
        getPOI();
    },[]);

    const getPOI = async () => {

        database
          .listDocuments(DATABASE_ID, MAP_COLLECTION_ID)
          .then((response) => {
            console.log("Documents:", response.documents);
            setList(response.documents);
          })
          .catch((error) => {
            console.error("Error fetching documents:", error);
          });
        };

    const renderList = ({ item }) => {
        return (
            <div key={item.$id} className="dropdown-item" >
            <p style={{ color: selectedPOI === item ? "#8FA063" : "#134C77" }} onClick={() => {
                setSelectedPOI(item);
                setDropdownVisible(false);
                }}>{item.Name}</p>
            </div>
            );
    };
        
    const  handleSelectEvent = async () =>{
            if (selectedPOI) {
                try {
                
                  
                  await database.deleteDocument(DATABASE_ID, MAP_COLLECTION_ID, selectedPOI.$id);
                 setSelectedPOI(null);
                 SuccessfullDeletion();
                  
                } catch (error) {
                  
                  console.error("Error deleting document:", error);
                }
              }else{
                DeletionFailed();
        
              }
          };    

    



    return(
        <div className="deletePOIContainer">
        <h1 className="title">Delete POI</h1>
        <button className="dropdown-toggle" onClick={toggleDropdown}>
          {selectedPOI ? selectedPOI.Name : "Select Event"}
        </button>
        {dropdownVisible && ( <div className="dropdown-wrapper">{list.map((item) => renderList({ item }))} </div>)}

        <button onClick={handleSelectEvent}>Delete POI</button>
        </div>

    );
}