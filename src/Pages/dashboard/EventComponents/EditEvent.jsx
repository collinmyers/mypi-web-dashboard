import "../../../styling/EventsStyling/EditEventStyle.css";
import React, { useState, useEffect, useRef} from "react";
import { toast,ToastContainer } from "react-toastify";
import {database} from "../../../utils/AppwriteConfig";
import {storage} from "../../../utils/AppwriteConfig";
import {BUCKET_ID} from "../../../utils/AppwriteConfig";
import {EVENTS_COLLECTION_ID} from "../../../utils/AppwriteConfig";
import {DATABASE_ID} from "../../../utils/AppwriteConfig";
import { useLocation, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import {ID} from "appwrite";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


export default function EditEvent(){
  const[currentFile,setCurrentFile] = useState("");
  const[newFile,setNewFile] = useState("");
  const navigate = useNavigate();
  
    const location = useLocation();

   
    let selectedItem = location.state.Event;

  const[imageUrl, setImageUrl] = useState("");

  const [name, setName] = useState(selectedItem.Name);
  // const [time, setTime] = useState(selectedItem.Time);
  const [shortDescription, setShortDescription] = useState(selectedItem.EventListDescription);
  const [longDescription, setLongDescription] = useState(selectedItem.EventDetailsDescription);
  const [latitude,setLatitude] = useState(selectedItem.Latitude);
  const [longitude,setLongitude] = useState(selectedItem.Longitude);
  const [uploaderKey,setUploaderKey] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dateMode, setDateMode] = useState("range"); // 'range' or 'single'

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

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
  

  
  const formatTime = (time) => {
    const [hours, minutes, period] = time.split(/:|\s/);
    let formattedHours = parseInt(hours, 10);
    if (period.toLowerCase() === "pm" && formattedHours < 12) {
      formattedHours += 12;
      }
      formattedHours = formattedHours.toString().padStart(2, "0");
      return `${formattedHours}:${minutes.padStart(2, "0")}`;
  };

  const data = { // add lat and long 
    Name: name,
    Date: dateRangeString,
    Time: timeRangeString,
    EventListDescription: shortDescription,
    EventDetailsDescription: longDescription,
    Latitude:  latitude,
    Longitude: longitude,
  };

  useEffect(() => {
    // getImage();
    // getCurrentFile();
    if (selectedItem) {
        const dateParts = selectedItem.Date.split(" - "); //split date range
        const startDate = new Date(dateParts[0]);
        const endDate = dateParts[1] ? new Date(dateParts[1]) : startDate;
        const mode = startDate.getTime() === endDate.getTime() ? "single" : "range";
        setDateMode(mode);
        setStartDate(startDate);
        setEndDate(endDate);
      
        const timeParts = selectedItem.Time ? selectedItem.Time.split(" - ") : ""; //split time range if Time is not null/ set tp emptry string if null
        const startTime = timeParts[0] || null;   
        const endTime = timeParts[1] || null; 


        const formattedStartTime = startTime ? formatTime(startTime) : "";//format time
        const formattedEndTime = endTime ? formatTime(endTime) : ""; //format time

        setStartTime(formattedStartTime);
        setEndTime(formattedEndTime);
    }
}, [selectedItem]);


  




  const SuccessfulEdit = () => {
    toast.success("Event Edited", {
      position: toast.POSITION.TOP_CENTER,
    });
  
  };
  
  const EditFailed = () => {
    toast.error("Failed to Edit Event", {
      position: toast.POSITION.TOP_CENTER,
    });
  };





  
  const deleteImage = async (imageid) => {
    // console.log(currentFile);
    const promise = storage.deleteFile(BUCKET_ID,imageid); //delete current image file
    
    promise.then(function (response) {
      // console.log(response); // Success
  }, function (error) {
      console.log(error); // Failure
    }); 
  };
  

  const getImage = async () => {
    try {
      
      const response = storage.getFileView(BUCKET_ID, selectedItem.FileID);//get image view from document attribute FileID
      
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
      console.log("Current FileID",selectedItem.FileID);
      const response = await storage.getFile(BUCKET_ID, selectedItem.FileID); //get current image file from document attribute
      
      setCurrentFile(response); // set image file
    } catch (error) {
      console.error("Error fetching image URL", error); // Failure
    }
  };
  
  
  const  handleSubmit = async () =>{
    //call create and delete file if a new one has been uploaded.
    console.log(data.timeRangeString);
    
    // await deleteImage();
    // await createImage();
   
    updateDoc(data);
    
    
  }; 
  
  const updateDoc = async(data) =>{
    data.FileID = selectedItem.FileID; // set FileID to current File ID

    if (selectedItem) {
      try {
        
        await database.updateDocument(DATABASE_ID,EVENTS_COLLECTION_ID,selectedItem.$id,data);
        SuccessfulEdit();
        clearInput();
        
      } catch (error) {
        EditFailed();
        console.error("Error updating document:", error);
      }
    }else{
      console.log();
    }
  };

  const updateDocImages = async(data) =>{
    data.FileID = selectedItem.FileID; // set FileID to current File ID

    if (selectedItem) {
      try {
        
        await database.updateDocument(DATABASE_ID,EVENTS_COLLECTION_ID,selectedItem.$id,data);
        
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
    setShortDescription("");
    setLongDescription("");
    setLatitude("");
    setLongitude("");
    setNewFile(null);
    setImageUrl("");
    setUploaderKey((prevValue) => !prevValue);
  };

  // const handleUpload = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setNewFile(file);
  //       setImageUrl(URL.createObjectURL(file));
  //       setUploaderKey((prevKey) => prevKey + 1);
  //     }

    
  //   };
    
    const createImage = async (file) => {
      try {
        const response = await storage.createFile(BUCKET_ID, ID.unique(), file);
        // Optionally, do something with the response
        return response; // Resolve the promise with the response
      } catch (error) {
        console.log(error); // Log the error
        throw error; // Throw the error to propagate it
      }
    };
    
    
    
  const [selectedImageId, setSelectedImageId] = useState("");
  
  // Function to handle selecting an image
  const fileInputRef = useRef(null);

const handleImageSelect = (imageId) => {
  // Set the selected image ID
  setSelectedImageId(imageId);

  // Open file input dialog
  fileInputRef.current.click();
  console.log("Current FileID",selectedItem.FileID);

};

const handleFileChange = (e) => { //adjust to also DELETE the old image
  const file = e.target.files[0];
  if (!file) return;

  createImage(file).then((newImageId) => {
    // Update the selectedItem with the new file ID
    selectedItem.FileID = selectedItem.FileID.map((imageId) => //replace old image with new in list of fileIDs
      imageId === selectedImageId ? newImageId.$id : imageId
    );
    deleteImage(selectedImageId); // delete old image
    updateDocImages(data); //update doc with changes

    // Update the selectedImageId state to force re-render
    setSelectedImageId(newImageId); 
  });
};
    

    const settings = {    
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 6000,
      cssEase: "linear",
    
    };
  


  return (
    <div>
    <ToastContainer/>
    <div className="dropdown-container">
    <h1 className="editEventTitle">Edit Event</h1>
    <div className="image-slider">
    <Slider {...settings}>
    {selectedItem.FileID.map((imageId) => (
      <div key={imageId}>
        <img width={"250px"} height={"200px"} 
          src={storage.getFileView(BUCKET_ID, imageId).href}
          alt="Event Image"
          onClick={() => handleImageSelect(imageId)}
          className={selectedImageId === imageId ? "selected-image" : ""}
        />
      </div>
    ))}
  </Slider>
    <input
      type="file"
      style={{ display: "none" }}
      ref={fileInputRef}
      onChange={handleFileChange}
    />
  



  </div>
        <input className="eventName" type="text" placeholder={"Name"} id = "eventName" value={name} onChange={(e) => setName(e.target.value)} />


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
      <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
    </label>
    <br />
    <label>
      End Time:
      <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
    </label>
    <br />




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

