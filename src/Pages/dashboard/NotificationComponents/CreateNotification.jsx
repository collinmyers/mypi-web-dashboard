import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styling/NotificationStyling/CreateNotificationStyle.css";
import {ID} from "appwrite";
import {database} from "../../../utils/AppwriteConfig";

import {ALERTS_COLLECTION_ID} from "../../../utils/AppwriteConfig";
import {DATABASE_ID} from "../../../utils/AppwriteConfig";
import { toast ,ToastContainer} from "react-toastify";


export default function CreateNotification(){

const [title,setTitle] = useState("");
const [details,setDetails] = useState("");
const [alertType,setAlertType] = useState("both");
const [notificationType,setNotificationType] = useState("alerts");
const navigate = useNavigate();

const SuccessfullCreation = () => {
    toast.success("New Notification Created", {
      position: toast.POSITION.TOP_CENTER,
    });
  
  };
  
  const creationFailed = () => {
    toast.error("Failed to Create Notification", {
      position: toast.POSITION.TOP_CENTER,
    });
  };
  

useEffect(()=>{

});

const handleSubmit = async () => {

    console.log(alertType);

   const data = {
    Title: title,
    Details: details,
    AlertType: alertType,
    NotificationType: notificationType,
   };

   try{
    const response = await database.createDocument(DATABASE_ID,ALERTS_COLLECTION_ID, ID.unique(), data);
    clearInput();
    SuccessfullCreation();
   }catch(response){
    creationFailed();
    console.log(response);
   }

};

const clearInput = () =>{
    setAlertType("");
    setDetails("");
    setNotificationType("");
    setTitle("");

};

    return(
        <div>
        <ToastContainer/>
            <div className="createNotificationContainer">
                <h1 className="title">New Notification</h1>
                    <input type="text" placeholder="Title" onChange={(e) => setTitle(e.target.value)}  />
                    <input type="text" placeholder="Details" onChange={(e) => setDetails(e.target.value)} />

        <div className="dropdown-container">
            <label className="dropdown-label">
                Alert Type:      
                <select className="dropdown" value={alertType} onChange={(e) => setAlertType(e.target.value)}>
                <option value="in-app">In-App</option>
                <option value="push">Push</option>
                <option value="both">Both</option>
                </select>
            </label>        

            <label className="dropdown-label">
                Notification Type:      
                <select className="dropdown" value={notificationType} onChange={(e) => setNotificationType(e.target.value)}>
                <option value="alerts">Alerts</option>
                <option value="events">Events</option>
                <option value="promos">Promos</option>
                </select>
            </label>  
        </div>
        
        <button onClick={handleSubmit}>Create Notification</button>
        <button onClick={() => navigate(-1)}>go back</button>

        </div>
        </div>
    );
}