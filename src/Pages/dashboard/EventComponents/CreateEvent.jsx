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
import { TextField, Button, Modal } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import zIndex from "@mui/material/styles/zIndex";

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
    toast.success("User has been Updated", {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 2000, // Auto close after 2000 ms
    });
    setTimeout(() => {
      navigate("/events"); // Navigate after 2000 ms
    }, 1000); // Delay to match the toast autoClose
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
  const newFileInputRef = useRef(null);

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

  const handleNewFileClick = () => {
    newFileInputRef.current.click();
  };
  const handleExtraUrlChange = (index, event) => {
    const newUrls = [...extraURL];
    newUrls[index] = event.target.value;
    setExtraURL(newUrls);
  };
  const removeInput = (indexToRemove) => {
    setExtraTitle(extraTitle.filter((_, index) => index !== indexToRemove));
    setExtraURL(extraURL.filter((_, index) => index !== indexToRemove));
  };
  return (
    <div>
      <ToastContainer />
      <h1 className="new-event-title">New Event</h1>
      <div className="newEventContainer">
        <div
          className="slider-and-uploader"
          style={{ height: "300px", width: "25%" }}
        >
          <div className="image-slider">
            {Object.keys(files).length > 1 ? (
              <Slider {...settings}>
                {Object.keys(files).map((key, index) => (
                  <div key={index} onClick={() => handleImageSelect(key)}>
                    <img
                      width={"300px"}
                      height={"225px"}
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
              <Typography style={{ marginTop: "27%" }}>
                No images selected
              </Typography>
            ) : (
              <div>
                {Object.keys(files).map((key, index) => (
                  <div key={index}>
                    <img
                      width={"300x"}
                      height={"225px"}
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
          </div>

          <input
            className="event-uploader"
            type="file"
            key={uploaderKey}
            id="newImageUploader"
            style={{ display: "none" }}
            ref={newFileInputRef}
            onChange={handleNewFile}
            multiple
          />
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={(e) => handleImageReplace(e, selectedImageId)}
          />
          <Button onClick={handleNewFileClick}> + New Image</Button>

          <Modal
            style={{ zIndex: "3000" }}
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                zIndex: 3000,
                borderRadius: "5%",
                transform: "translate(-50%, -50%)",
                bgcolor: "background.paper",
                boxShadow: 100,
                p: 4,
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Typography variant="h6">Edit Image</Typography>
              <Button onClick={deleteImage} color="error">
                Delete
              </Button>
              <Button onClick={openFileExplorer} color="primary">
                Replace
              </Button>
              <Button onClick={() => setIsModalOpen(false)}>Close</Button>
            </Box>
          </Modal>
        </div>

        <div className="input-fields" style={{ width: "25%", height: "300px" }}>
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
            <div style={{ gap: "7%", zIndex: "2000" }} className="date-picker">
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
            <div className="date-field" style={{ zIndex: "2000" }}>
              <DatePicker
                selected={startDate}
                onChange={(date) => {
                  setStartDate(date);
                  setEndDate(date); // Set end date to the same date for single date selection
                }}
                placeholderText="Select Date"
              />
            </div>
          )}

          <div className="time-container">
            <TextField
              label="Start"
              className="time-picker"
              InputLabelProps={{ shrink: true }}
              type="time"
              onChange={(e) => setStartTime(e.target.value)}
            />
            <TextField
              type="time"
              className="time-picker"
              onChange={(e) => setEndTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
              label="End"
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              gap: "5%",
            }}
          >
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
          </div>
        </div>
        <div
          className="input-fields2"
          style={{ width: "25%", height: "300px" }}
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

          {extraTitle.map((title, index) => (
            <div className="extra-info" key={index}>
              <TextField
                type="text"
                label={`Extra Info Title ${index + 1}`}
                value={title}
                onChange={(event) => handleExtraTitleChange(index, event)}
              />
              <TextField
                type="text"
                label={`Extra Info Link ${index + 1}`}
                value={extraURL[index]}
                onChange={(event) => handleExtraUrlChange(index, event)}
              />
              <Button onClick={() => removeInput(index)}>Remove</Button>
            </div>
          ))}

          <Button onClick={addInputs}>Add More</Button>
        </div>
      </div>
      <Box
        className="buttons"
        sx={{ mt: 15, display: "flex", justifyContent: "center", gap: 2 }}
      >
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
