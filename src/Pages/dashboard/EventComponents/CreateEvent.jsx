import React, { useState, useEffect} from "react";
import { ID} from "appwrite";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

import { useNavigate } from "react-router-dom";
import "../../../styling/EventsStyling/CreateEventStyle.css";
import { toast,ToastContainer } from "react-toastify";
import {account} from "../../../utils/AppwriteConfig";
import {database} from "../../../utils/AppwriteConfig";
import {storage} from "../../../utils/AppwriteConfig";
import {BUCKET_ID} from "../../../utils/AppwriteConfig";
import {EVENTS_COLLECTION_ID} from "../../../utils/AppwriteConfig";
import {DATABASE_ID} from "../../../utils/AppwriteConfig";





export default function CreateEvent(){
  const[fileID,setFileID] = useState("");
  const[file,setFile] = useState("");
  const [name, setName] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [latitude,setLatitude] = useState("");
  const [longitude,setLongitude] = useState("");
  const [uploaderKey, setUploaderKey] = useState(false);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dateMode, setDateMode] = useState("range"); // 'range' or 'single'

  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const formatDate = (date) => format(date, "MMMM d, yyyy"); //format the dates



  const toggleMode = () => {
    setDateMode(dateMode === "range" ? "single" : "range");
    setStartDate(null);
    setEndDate(null);
  };

  let dateRangeString = "";
  if (startDate && endDate) {
    if (startDate.getTime() === endDate.getTime()) { // single date
      dateRangeString = formatDate(startDate);
    } else { // date range
      dateRangeString = `${formatDate(startDate)} - ${formatDate(endDate)}`;
    }
  }

  
  let timeRangeString = "";
  if (startTime) {
    const start = new Date(`2022-01-01T${startTime}`);
    const formattedStartTime = start.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  
    if (endTime) {
      const end = new Date(`2022-01-01T${endTime}`);
      const formattedEndTime = end.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
      timeRangeString = `${formattedStartTime} - ${formattedEndTime}`;
    } else {
      timeRangeString = formattedStartTime;
    }
  }
  
 

const navigate = useNavigate();
  
  const navigateToLogin = () => {
    navigate("/");
};

const SuccessfulCreation = () => {
  toast.success("New Event Created", {
    position: toast.POSITION.TOP_CENTER,
  });

};

const creationFailed = () => {
  toast.error("Failed to Create Event", {
    position: toast.POSITION.TOP_CENTER,
  });
};


useEffect(() => {


}, []);


  const handleLogout = async () => {
    try {

        await account.deleteSessions("current");
        navigateToLogin();

    } catch (error) {
        console.error(error);
    }
};


const handleButtonClick = async () => {
    const data = { // add lat and long 
      Name: name,
      Date: dateRangeString,
      EventListDescription: shortDescription,
      EventDetailsDescription: longDescription,
      Latitude: latitude,
      Longitude: longitude,
    };


    const allFieldsFilled = Object.values(data).every(value => value !== undefined && value !== null && value !== "");
    if (timeRangeString){
      data.Time = timeRangeString;
    }else{
      data.Time = null;
    }

    if (allFieldsFilled) {
      const promise = storage.createFile(BUCKET_ID, ID.unique(), file);
      promise.then(function (response) {
        console.log(response);
        data.FileID = response.$id;
        createdDoc(data);
    }, function (error) {
      console.log(error);
        creationFailed();
    });

    } else {
      console.log("not all fields filled");
      creationFailed();
    }
  };

  const createdDoc = async (data) =>{
try{
      const response = await database.createDocument(DATABASE_ID,EVENTS_COLLECTION_ID, ID.unique(), data);
      // setResponseData(response);
      SuccessfulCreation();
      clearInput();
      
  }catch(error){
    console.log(error);
    creationFailed();

  }
 
  };


  const clearInput = () =>{
    setFile("");
    setFileID("");
    setName("");
    setShortDescription("");
    setLongDescription("");
    setLatitude("");
    setLongitude("");
    setUploaderKey((prevValue) => !prevValue);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  
  return (
    <div>
    <ToastContainer/>
    <div className="newEventContainer">
    <h1 className="title">New Event</h1>
        <input className="uploader" type="file" key={uploaderKey} id="uploader" onChange={handleFileChange} />
        <input className="eventName" type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        
        <button onClick={toggleMode}>
        {dateMode === "range" ? "Select Single Date" : "Select Date Range"}
      </button>
      {dateMode === "range" ? (
        <div>
          <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} selectsStart startDate={startDate} endDate={endDate} placeholderText="Start Date"/>
          <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} selectsEnd startDate={startDate} endDate={endDate} minDate={startDate} placeholderText="End Date"/>
        </div>
      ) : (
        <DatePicker selected={startDate} onChange={(date) => {
            setStartDate(date);
            setEndDate(date); // Set end date to the same date for single date selection
          }}
          placeholderText="Select Date"
        />
      )}

      <label>
      Start Time:
      <input type="time" onChange={(e) => setStartTime(e.target.value)} />
    </label>
    <br />
    <label>
      End Time:
      <input type="time" onChange={(e) => setEndTime(e.target.value)} />
    </label>
    <br />

        <input type="text" placeholder="Short Description" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} />
        <input type="text" placeholder="Long Description" value={longDescription} onChange={(e) => setLongDescription(e.target.value)} />
        <input type="text" placeholder="Latitude" value={latitude}  onChange={(e) => {
          const value = e.target.value;
          if (/^-?\d*\.?\d*$/.test(value)) {
            setLatitude(value);
          }
        }}/>
        <input type="text" placeholder="Longitude" value={longitude} onChange={(e) => {const value = e.target.value;
          if (/^-?\d*\.?\d*$/.test(value)) {
            setLongitude(value);
          }
        }}/>
        <button onClick={handleButtonClick}>Submit</button>
        <button onClick={() => navigate(-1)}>go back</button>

        </div>
      </div>
  );
}

