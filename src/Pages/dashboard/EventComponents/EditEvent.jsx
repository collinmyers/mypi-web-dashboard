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
  // const[currentFile,setCurrentFile] = useState("");
  // const[newFile,setNewFile] = useState("");
  const navigate = useNavigate();
  
    const location = useLocation();

   
    let selectedItem = location.state.Event;

  const[imageUrls, setImageUrls] = useState({});// key value pair imageId: href

  const [name, setName] = useState(selectedItem.Name);
  // const [time, setTime] = useState(selectedItem.Time);
  const [shortDescription, setShortDescription] = useState(selectedItem.EventListDescription);
  const [longDescription, setLongDescription] = useState(selectedItem.EventDetailsDescription);
  const [latitude,setLatitude] = useState(selectedItem.Latitude);
  const [longitude,setLongitude] = useState(selectedItem.Longitude);
  const [extraTitle,setExtraTitle] = useState(selectedItem.ExtraInfoTitle);
  const [extraURL,setExtraURL] = useState(selectedItem.ExtraInfoURL);
  const [uploaderKey,setUploaderKey] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dateMode, setDateMode] = useState("range"); // 'range' or 'single'
  const [isModalOpen, setIsModalOpen] = useState(false);


  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [imagesToDelete, setImagesToDelete] = useState([]);
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


const cleanExtraTitle = extraTitle.filter((title, index) => title.trim() !== '' && extraURL[index].trim() !== '');
const cleanExtraURL = extraURL.filter((url, index) => extraTitle[index].trim() !== '' && url.trim() !== '');

  const data = { // add lat and long 
    Name: name,
    Date: dateRangeString,
    Time: timeRangeString,
    EventListDescription: shortDescription,
    EventDetailsDescription: longDescription,
    Latitude:  latitude,
    Longitude: longitude,
    ExtraInfoTitle: cleanExtraTitle,
    ExtraInfoURL: cleanExtraURL,
  };
  const getAllImages = async()=>{
    const urls = {};
    selectedItem.FileID.forEach((imageId) => {
      const href = storage.getFileView(BUCKET_ID, imageId).href;
      urls[imageId] = { href, File: {} };
      console.log(urls);
    });
    setImageUrls(urls);
    console.log(selectedItem.FileID[0]);
    console.log(Object.keys(imageUrls).length);
  };

  useEffect(() => {
    // getImage();
    // getCurrentFile();

    getAllImages();


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

  const ImageDeletionFailed = () => {
    toast.error("Failed to Delete Image", {
      position: toast.POSITION.TOP_CENTER,
    });
  };


  
  
  const  handleSubmit = async () =>{
  const ids =[];
    for (const key of Object.keys(imageUrls)){
      if(imageUrls[key].File instanceof File){
  
        try {
          const response = await storage.createFile(BUCKET_ID, ID.unique(),imageUrls[key].File);
            console.log(response);
            // uploadedFileIDs.push(response.$id);
            ids.push(response.$id);
            
          } catch (error) {
            // EditFailed();
            console.error("Error updating document:", error);
          }
  
        }else{
          ids.push(key);
        }
        
    }
   data.FileID = ids;
   await deleteImages();
   updateDoc(data);
  }; 

  const deleteImages = async () => {
    
    for (const imageId of imagesToDelete) {
      try {
        const response = await storage.deleteFile(BUCKET_ID, imageId);
        console.log(response); // Success
      } catch (error) {
        console.log(error); // Failure
        // ImageDeletionFailed();
      }
    }
  };
    
  
  
  const updateDoc = async() =>{
    

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
  
  
  const clearInput = () =>{
    setName("");
    setShortDescription("");
    setLongDescription("");
    setLatitude("");
    setLongitude("");
    setUploaderKey((prevValue) => !prevValue);
  };

const [selectedImageId, setSelectedImageId] = useState("");

// Function to handle selecting an image
const fileInputRef = useRef(null);

const handleImageSelect = (imageId) => {
  setSelectedImageId(imageId);
  setIsModalOpen(true);
  
  
};

const openFileExplorer = () =>{
  setIsModalOpen(false);
  fileInputRef.current.click();

};



const settings = {    
  dots: true,
  infinite: true,
  speed: 500,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 6000,
  cssEase: "linear",
  
};

// Set the selected image ID

const handleImageReplace = async (e, index) => {
  const file = e.target.files[0];
  const url = URL.createObjectURL(file);

  imagesToDelete.push(index);
  const updatedImageUrls = { ...imageUrls, [index]: { href: url, File: file } };
  setImageUrls(updatedImageUrls);
};


const handleNewImage = async (e) => {
  const files = e.target.files;

  // Iterate over each file
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const url = URL.createObjectURL(file);

    console.log(file);
    console.log(url);

    // Update imageUrls with the new image URL and File
    setImageUrls((prevImageUrls) => ({
      ...prevImageUrls,
      [file.name]: { href: url, File: file },
    }));
  }

};



const deleteImage = async () => {
  setIsModalOpen(false);
  
  const imageUrlKey = selectedImageId;
  const updatedImageUrls = { ...imageUrls };
  delete updatedImageUrls[imageUrlKey];
  
  imagesToDelete.push(selectedImageId);
  setImageUrls(updatedImageUrls); 
  
};


const handleExtraTitleChange = (index, event) => {
  const newTitles = [...extraTitle];
  newTitles[index] = event.target.value;
  setExtraTitle(newTitles);
};

const handleExtraUrlChange = (index, event) => {
  const newUrls = [...extraURL];
  newUrls[index] = event.target.value;
  setExtraURL(newUrls);
};
const addInputs = () => {
  if (extraTitle.length === extraURL.length) {
    setExtraTitle([...extraTitle, ""]);
    setExtraURL([...extraURL, ""]);
  } else {
    console.error('Arrays are out of sync');
  }
};


return (
    <div>
    <ToastContainer/>
    <div className="dropdown-container">
    <h1 className="editEventTitle">Edit Event</h1>
    <div className="image-slider">
   
    {Object.keys(imageUrls).length > 1 ? (
      <Slider {...settings}>
      {Object.keys(imageUrls).map((key, index) => (
        <div key={index} onClick={() => handleImageSelect(key)}>
          <img
            width={"250px"}
            height={"200px"}
            src={imageUrls[key].href} // Use the URL from imageUrls
            alt="Event Image"
            className={selectedImageId === key ? "selected-image" : ""}
          />
        </div>
      ))}
    </Slider>
    ) : (
      imageUrls[selectedItem.FileID[0]] && (
        <div>
          <img
            width={"250px"}
            height={"200px"}
            src={imageUrls[selectedItem.FileID[0]].href} // Use the URL from imageUrls[selectedItem.FileID[0]]
            alt="Event Image"
            onClick={() => handleImageSelect(selectedItem.FileID[0])}
            className={selectedImageId === selectedItem.FileID[0] ? "selected-image" : ""}
          />
        </div>
      )
    )}

    <input
    type="file"
    accept="image/*"
    ref={fileInputRef}
    style={{ display: "none" }}
    onChange={(e) => handleImageReplace(e, selectedImageId)}
  />
    </div>


    <div>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <button onClick={() => setIsModalOpen(false)}>Close</button>
            <button onClick={() => openFileExplorer()}>Replace</button>
            <button onClick={() => deleteImage()}>Delete</button>
          </div>
        </div>
      )}
      </div>

    <input
      className="event-uploader"
      type="file"
      key={uploaderKey}
      id="uploader"
      onChange={handleNewImage}
      multiple
  />



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
        <input
          type="number"
          placeholder="Latitude"
            value={latitude}
            onChange={(e) => {
            const value = e.target.value;
              setLatitude(parseFloat(value));
            
          }}
        />
        <input
          type="number"
          value={longitude}
          placeholder="Longitude"
          onBlur={(e) => {
            const value = e.target.value;

            setLongitude(parseFloat(value));
          }}
        />
        {extraTitle.map((title, index) => (
          <div key={index}>
            <input
              type="text"
              placeholder={`Extra Info Title ${index + 1}`}
              value={title}
              onChange={(event) => handleExtraTitleChange(index, event)}
            />
            <input
              type="text"
              placeholder={`Extra Info Link ${index + 1}`}
              value={extraURL[index]}
              onChange={(event) => handleExtraUrlChange(index, event)}
            />
          </div>
        ))}
        <button onClick={addInputs}>Add More</button>

        <button className="editEventSubmit" onClick={handleSubmit} >Edit Event</button>
        <button onClick={() => navigate("/events")}>go back</button>

      </div>
    </div>
  );
}

