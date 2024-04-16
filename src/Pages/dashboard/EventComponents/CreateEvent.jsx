import React, { useState, useEffect, useRef } from "react";
import { ID } from "appwrite";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

import { useNavigate } from "react-router-dom";
import "../../../styling/EventsStyling/CreateEventStyle.css";
import { toast, ToastContainer } from "react-toastify";
import { account } from "../../../utils/AppwriteConfig";
import { database } from "../../../utils/AppwriteConfig";
import { storage } from "../../../utils/AppwriteConfig";
import { BUCKET_ID } from "../../../utils/AppwriteConfig";
import { EVENTS_COLLECTION_ID } from "../../../utils/AppwriteConfig";
import { DATABASE_ID } from "../../../utils/AppwriteConfig";
import { Box, Typography } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BorderAllRounded } from "@mui/icons-material";
import { TextField, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function CreateEvent() {
  // const[fileID,setFileID] = useState("");
  const [files, setFiles] = useState({});
  // const [fileCount,setFileCount] = useState(0);
  const [name, setName] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [uploaderKey, setUploaderKey] = useState(false);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dateMode, setDateMode] = useState("range"); // 'range' or 'single'

  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const formatDate = (date) => format(date, "MMMM d, yyyy"); //format the dates
  const [selectedImageId, setSelectedImageId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [extraTitle, setExtraTitle] = useState([]);
  const [extraURL, setExtraURL] = useState([]);

  const toggleMode = () => {
    setDateMode(dateMode === "range" ? "single" : "range");
    setStartDate(null);
    setEndDate(null);
  };

  let dateRangeString = "";
  if (startDate && endDate) {
    if (startDate.getTime() === endDate.getTime()) {
      // single date
      dateRangeString = formatDate(startDate);
    } else {
      // date range
      dateRangeString = `${formatDate(startDate)} - ${formatDate(endDate)}`;
    }
  }

  let timeRangeString = "";
  if (startTime) {
    const start = new Date(`2022-01-01T${startTime}`);
    const formattedStartTime = start.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });

    if (endTime) {
      const end = new Date(`2022-01-01T${endTime}`);
      const formattedEndTime = end.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      });
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

  useEffect(() => {}, []);

  const handleLogout = async () => {
    try {
      await account.deleteSessions("current");
      navigateToLogin();
    } catch (error) {
      console.error(error);
    }
  };

  const handleButtonClick = async () => {
    console.log(files);
    const allFieldsFilled =
      name &&
      shortDescription &&
      longDescription &&
      latitude &&
      longitude &&
      dateRangeString;
    if (!allFieldsFilled || Object.keys(files).length === 0) {
      console.log("Please fill in all fields and select at least one file");
      creationFailed();
      return;
    }

    uploadFiles();
  };

  let uploadedFileIDs = [];

  const uploadFiles = async () => {
    try {
      for (const key of Object.keys(files)) {
        const response = await storage.createFile(
          BUCKET_ID,
          ID.unique(),
          files[key].File
        );
        console.log(response);
        uploadedFileIDs.push(response.$id);
        // setFileCount(fileCount + 1);
      }
      const cleanExtraTitle = extraTitle.filter(
        (title, index) => title.trim() !== "" && extraURL[index].trim() !== ""
      );
      const cleanExtraURL = extraURL.filter(
        (url, index) => extraTitle[index].trim() !== "" && url.trim() !== ""
      );

      const data = {
        Name: name,
        Date: dateRangeString,
        EventListDescription: shortDescription,
        EventDetailsDescription: longDescription,
        Latitude: latitude,
        Longitude: longitude,
        Time: timeRangeString || null,
        FileID: uploadedFileIDs,
        ExtraInfoTitle: cleanExtraTitle,
        ExtraInfoURL: cleanExtraURL,
      };

      createdDoc(data);
    } catch (error) {
      console.error(error);
      creationFailed();
    }
  };

  const createdDoc = async (data) => {
    try {
      const response = await database.createDocument(
        DATABASE_ID,
        EVENTS_COLLECTION_ID,
        ID.unique(),
        data
      );
      // setResponseData(response);
      SuccessfulCreation();
      clearInput();
    } catch (error) {
      console.log(error);
      creationFailed();
    }
  };

  const clearInput = () => {
    setFiles({});
    setName("");
    setShortDescription("");
    setLongDescription("");
    setStartDate("");
    setEndDate("");
    setLatitude("");
    setLongitude("");
    setUploaderKey((prevValue) => !prevValue);
  };

  const fileInputRef = useRef(null);

  const handleNewFile = (e) => {
    const newFiles = e.target.files;
    console.log("Adding:", newFiles);

    const keys = Object.keys(files).map(Number);
    const highestKey = Math.max(...keys, 0);

    // Iterate over each file
    for (let i = 0; i < newFiles.length; i++) {
      const file = newFiles[i];
      const url = URL.createObjectURL(file);

      console.log(file);
      console.log(url);
      const newKey = highestKey + i + 1;
      files[newKey] = { href: url, File: file };
    }
    setFiles({ ...files });
    e.target.value = "";
  };

  const handleImageReplace = async (e, index) => {
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);

    const updatedFiles = { ...files, [index]: { href: url, File: file } };

    setFiles(updatedFiles);
  };

  const settings = {
    //slider settings
    dots: true,
    infinite: true,
    speed: 500,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    cssEase: "linear",
    BorderAllRounded: true,
  };
  const handleImageSelect = (imageId) => {
    setSelectedImageId(imageId);
    setIsModalOpen(true);
  };
  const openFileExplorer = () => {
    setIsModalOpen(false);
    fileInputRef.current.click();
  };
  const deleteImage = async () => {
    setIsModalOpen(false);

    const imageUrlKey = selectedImageId;
    const updatedImageUrls = { ...files };
    delete updatedImageUrls[imageUrlKey];

    let newIndex = 0;
    const reindexedImageUrls = {};
    Object.keys(updatedImageUrls).forEach((key) => {
      reindexedImageUrls[newIndex++] = updatedImageUrls[key];
    });

    setFiles(updatedImageUrls);
  };

  const handleExtraTitleChange = (index, event) => {
    const temp = [...extraTitle];
    temp[index] = event.target.value;
    setExtraTitle(temp);
  };

  const handleExtraURLChange = (index, event) => {
    const temp = [...extraURL];
    temp[index] = event.target.value;
    setExtraURL(temp);
  };

  const addInputs = () => {
    if (extraTitle.length === extraURL.length) {
      setExtraTitle([...extraTitle, ""]);
      setExtraURL([...extraURL, ""]);
    } else {
      console.error("Arrays are out of sync");
    }
  };
  return (
    <div>
      <ToastContainer />
      <h1 className="title">New Event</h1>
      <div className="newEventContainer">
        <div
          className="slider-and-uploader"
          style={{ height: "300px", width: "300px" }}
        >
          <div className="image-slider" style={{ width: "250px" }}>
            {Object.keys(files).length > 1 ? (
              <Slider {...settings}>
                {Object.keys(files).map((key, index) => (
                  <div key={index} onClick={() => handleImageSelect(key)}>
                    <img
                      width={"250px"}
                      height={"200px"}
                      src={files[key].href}
                      alt={`Image ${index + 1}`}
                      className={
                        selectedImageId === key ? "selected-image" : ""
                      }
                    />
                  </div>
                ))}
              </Slider>
            ) : Object.keys(files).length === 0 ? (
              <Typography style={{ marginTop: "35%" }}>
                No images selected
              </Typography>
            ) : (
              <div>
                {Object.keys(files).map((key, index) => (
                  <div key={index}>
                    <img
                      width={"250px"}
                      height={"200px"}
                      src={files[key].href}
                      alt="Event Image"
                      onClick={() => handleImageSelect(key)}
                      className={
                        selectedImageId === key ? "selected-image" : ""
                      }
                    />
                  </div>
                ))}
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={(e) => handleImageReplace(e, selectedImageId)}
            />

            <input
              className="uploader"
              type="file"
              key={uploaderKey}
              id="uploader"
              onChange={handleNewFile}
              multiple
            />

            <div>
              {isModalOpen && (
                <div className="modal">
                  <div className="modal-content">
                    <button onClick={() => openFileExplorer()}>Replace</button>
                    <button onClick={() => deleteImage()}>Delete</button>
                    <button onClick={() => setIsModalOpen(false)}>Close</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div
          className="input-fields"
          style={{ width: "300px", height: "300px" }}
        >
          <TextField
            fullWidth
            rows={1}
            label="Name"
            variant="outlined"
            value={name}
            margin="normal"
            onChange={(e) => setName(e.target.value)}
          />

          <Button onClick={toggleMode}>
            {dateMode === "range" ? "Select Single Date" : "Select Date Range"}
          </Button>
          {dateMode === "range" ? (
            <div className="date-picker">
              <DatePicker
                className="input-field"
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                placeholderText="Start Date"
              />
              <DatePicker
                className="input-field"
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                placeholderText="End Date"
              />
            </div>
          ) : (
            <DatePicker
              className="input-field"
              selected={startDate}
              onChange={(date) => {
                setStartDate(date);
                setEndDate(date); // Set end date to the same date for single date selection
              }}
              placeholderText="Select Date"
            />
          )}

          <div className="time-picker">
            <TextField
              label="Start"
              InputLabelProps={{ shrink: true }}
              type="time"
              onChange={(e) => setStartTime(e.target.value)}
            />
            <TextField
              type="time"
              onChange={(e) => setEndTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
              label="End"
            />
          </div>
        </div>
        <div
          className="input-fields2"
          style={{ width: "300px", height: "300px" }}
        >
          <TextField
            type="text"
            rows={2}
            multiline
            label="Short Description"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
          />
          <TextField
            type="text"
            rows={3}
            multiline
            label="Long Description"
            value={longDescription}
            onChange={(e) => setLongDescription(e.target.value)}
          />
          <TextField
            type="text"
            label="Latitude"
            onChange={(e) => {
              const value = e.target.value;
              if (/^-?\d*\.?\d*$/.test(value)) {
                setLatitude(parseFloat(value));
              }
            }}
          />
          <TextField
            type="text"
            label="Longitude"
            onChange={(e) => {
              const value = e.target.value;
              if (/^-?\d*\.?\d*$/.test(value)) {
                setLongitude(parseFloat(value));
              }
            }}
          />
          <div className="extra-info">
            {extraTitle.map((title, index) => (
              <div key={index}>
                <TextField
                  type="text"
                  label={`Extra Info Title ${index + 1}`}
                  value={title}
                  onChange={(event) => handleExtraTitleChange(index, event)}
                />
                {extraURL[index] !== undefined && (
                  <TextField
                    type="text"
                    label={`Extra Info Link ${index + 1}`}
                    value={extraURL[index]}
                    onChange={(event) => handleExtraURLChange(index, event)}
                  />
                )}
              </div>
            ))}
          </div>

          <Button onClick={addInputs}>Add More</Button>
        </div>
      </div>
      <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 2 }}>
        <Button variant="contained" color="primary" onClick={handleButtonClick}>
          Create Event
        </Button>
        <Button
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          onClick={() => navigate("/events")}
        >
          Go Back
        </Button>
      </Box>
    </div>
  );
}
