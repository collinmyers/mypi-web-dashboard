import React, { useState, useEffect} from "react";
import { Query } from "appwrite";

import "../../../styling/EventsStyling/EventEditorStyle.css";
import { useNavigate } from "react-router-dom";
import EventsTable from "../EventComponents/EventTable";
import { database } from "../../../utils/AppwriteConfig";
import { EVENTS_COLLECTION_ID } from "../../../utils/AppwriteConfig";
import { DATABASE_ID } from "../../../utils/AppwriteConfig";
import { storage } from "../../../utils/AppwriteConfig";
import { BUCKET_ID } from "../../../utils/AppwriteConfig";
import Layout from "./Layout"; 

export default function EventsEdit(){
  const [data,setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getEvents();
  },[]);

  const navigateToDash = () => {
    navigate("/dash");
  };

  const getEvents = async () => {
    try {
      const response = await database.listDocuments(
        DATABASE_ID,
        EVENTS_COLLECTION_ID,
        [
          Query.limit(1000), // Fetch all documents
          Query.offset(0)
        ]
      );
      setData(response.documents);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  const  deleteEvent = async (event) =>{
    try {
      await database.deleteDocument(DATABASE_ID, EVENTS_COLLECTION_ID, event.$id);
      deleteImage(event);
      getEvents();
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  }; 

  const deleteImage = async (event) =>{
    const promise = storage.deleteFile(BUCKET_ID,event.FileID);

    promise.then(function (response) {
      console.log(response); // Success
    }, function (error) {
      console.log(error); // Failure
    }); 
  };

  const editEvent = (event) => {
    navigate("/editEvent", {
      state: {
        Event: event,
      }
    });
  };
  const createEvent = () => {
    navigate("/createEvent");
  };

  return (
    <Layout> {/* Wrap your content inside the Layout component */}
      <div>        
     
        <div className="eventsEdit">
          <EventsTable 
            data={data}
            deleteEvent={deleteEvent}  
            editEvent={editEvent}
            createEvent={createEvent}
          />
        </div>
      </div>
    </Layout>
  );
}
