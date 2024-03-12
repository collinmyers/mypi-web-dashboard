import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styling/NotificationStyling/EditNotificationStyle.css";
// import {ID} from "appwrite";
import {database} from "../../../utils/AppwriteConfig";

import {ALERTS_COLLECTION_ID} from "../../../utils/AppwriteConfig";
import {DATABASE_ID} from "../../../utils/AppwriteConfig";
import { toast ,ToastContainer} from "react-toastify";
import { useLocation } from "react-router-dom";



export default function EditNotification(){
    const location = useLocation();
    let notification = location.state.notification;

const [title,setTitle] = useState(notification.Title);
const [details,setDetails] = useState(notification.Details);
const [alertType,setAlertType] = useState(notification.AlertType);
const [notificationType,setNotificationType] = useState(notification.NotificationType);

const navigate = useNavigate();

const Successful = () => {
    toast.success("Notification Update", {
      position: toast.POSITION.TOP_CENTER,
    });
  
  };
  
  const Failed = () => {
    toast.error("Failed to Update Notification", {
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

try {
    await database.updateDocument(DATABASE_ID, ALERTS_COLLECTION_ID, notification.$id, data);
    Successful();
} catch (error) {
    Failed();
    console.log(error);
}

};

    return(
        <div>
        <ToastContainer/>
            <div className="editNotificationContainer">
                <h1 className="title">Edit Notification</h1>
                    <input type="text" placeholder="Title" value= {title} onChange={(e) => setTitle(e.target.value)}  />
                    <input type="text" value={details} onChange={(e) => setDetails(e.target.value)} />

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
        
        <button onClick={handleSubmit}>Edit Notification</button>
        <button onClick={() => navigate(-1)}>go back</button>

        </div>
        </div>
    );
}