import "../../../styling/EventsStyling/EditEventStyle.css";
import React, { useState, useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import { database } from "../../../utils/AppwriteConfig";
import { storage } from "../../../utils/AppwriteConfig";
import { BUCKET_ID } from "../../../utils/AppwriteConfig";
import { EVENTS_COLLECTION_ID } from "../../../utils/AppwriteConfig";
import { DATABASE_ID } from "../../../utils/AppwriteConfig";
import { useLocation, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { ID } from "appwrite";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { TextField, Button, Modal, Typography, Box } from "@mui/material";
import { BorderAllOutlined } from "@mui/icons-material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function EditEvent() {

  const navigate = useNavigate();

  const location = useLocation();

  let selectedItem = location.state.Event;

  const [imageUrls, setImageUrls] = useState({}); // key value pair imageId: href

  const [name, setName] = useState(selectedItem.Name);
  const [shortDescription, setShortDescription] = useState(
    selectedItem.EventListDescription
  );
  const [longDescription, setLongDescription] = useState(
    selectedItem.EventDetailsDescription
  );
  const [latitude, setLatitude] = useState(selectedItem.Latitude);
  const [longitude, setLongitude] = useState(selectedItem.Longitude);
  const [extraTitle, setExtraTitle] = useState(selectedItem.ExtraInfoTitle);
  const [extraURL, setExtraURL] = useState(selectedItem.ExtraInfoURL);
  const [uploaderKey, setUploaderKey] = useState(false);
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

  const formatTime = (time) => {
    const [hours, minutes, period] = time.split(/:|\s/);
    let formattedHours = parseInt(hours, 10);
    if (period.toLowerCase() === "pm" && formattedHours < 12) {
      formattedHours += 12;
    }
    formattedHours = formattedHours.toString().padStart(2, "0");
    return `${formattedHours}:${minutes.padStart(2, "0")}`;
  };

  const cleanExtraTitle = extraTitle.filter(
    (title, index) => title.trim() !== "" && extraURL[index].trim() !== ""
  );
  const cleanExtraURL = extraURL.filter(
    (url, index) => extraTitle[index].trim() !== "" && url.trim() !== ""
  );

  const data = {
    Name: name,
    Date: dateRangeString,
    Time: timeRangeString,
    EventListDescription: shortDescription,
    EventDetailsDescription: longDescription,
    Latitude: latitude,
    Longitude: longitude,
    ExtraInfoTitle: cleanExtraTitle,
    ExtraInfoURL: cleanExtraURL,
  };

  const getAllImages = async () => {
    const urls = {};
    selectedItem.FileID.forEach((imageId, index) => {
      const href = storage.getFileView(BUCKET_ID, imageId).href;
      urls[index] = { imageId, href, File: {} };
    });
    console.log(urls);
    setImageUrls(urls);
    console.log(imageUrls);
  };

  useEffect(() => {
    getAllImages();

    if (selectedItem) {
      const dateParts = selectedItem.Date.split(" - "); //split date range
      const startDate = new Date(dateParts[0]);
      const endDate = dateParts[1] ? new Date(dateParts[1]) : startDate;
      const mode =
        startDate.getTime() === endDate.getTime() ? "single" : "range";
      setDateMode(mode);
      setStartDate(startDate);
      setEndDate(endDate);

      const timeParts = selectedItem.Time ? selectedItem.Time.split(" - ") : ""; //split time range if Time is not null/ set tp emptry string if null
      const startTime = timeParts[0] || null;
      const endTime = timeParts[1] || null;

      const formattedStartTime = startTime ? formatTime(startTime) : ""; //format time
      const formattedEndTime = endTime ? formatTime(endTime) : ""; //format time

      console.log(formattedStartTime);
      console.log(formattedEndTime);
      setStartTime(formattedStartTime);
      setEndTime(formattedEndTime);
    }
  }, [selectedItem]);

  const SuccessfulEdit = () => {
    toast.success("User has been Updated", {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 2000, // Auto close after 2000 ms
    });
    setTimeout(() => {
      navigate("/events"); // Navigate after 2000 ms
    }, 1000); // Delay to match the toast autoClose
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

  const handleSubmit = async () => {
    const allFieldsFilled =
      name &&
      shortDescription &&
      longDescription &&
      latitude &&
      longitude &&
      dateRangeString;
    if (!allFieldsFilled || Object.keys(imageUrls).length === 0) {
      console.log("Please fill in all fields and select at least one file");
      EditFailed();
      return;
    }

    const ids = [];
    for (const key of Object.keys(imageUrls)) {
      if (imageUrls[key].File instanceof File) {
        try {
          const response = await storage.createFile(
            BUCKET_ID,
            ID.unique(),
            imageUrls[key].File
          );
          console.log(response);
          ids.push(response.$id);
        } catch (error) {
          console.error("Error updating document:", error);
        }
        console.log();
      } else {
        ids.push(imageUrls[key].imageId);
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
      }
    }
  };

  const updateDoc = async () => {
    if (selectedItem) {
      try {
        await database.updateDocument(
          DATABASE_ID,
          EVENTS_COLLECTION_ID,
          selectedItem.$id,
          data
        );
        SuccessfulEdit();

        clearInput();
      } catch (error) {
        EditFailed();
        console.error("Error updating document:", error);
      }
    } else {
      console.log();
    }
  };

  const clearInput = () => {
    setName("");
    setShortDescription("");
    setLongDescription("");
    setLatitude("");
    setLongitude("");
    setStartDate("");
    setEndDate("");
    setImageUrls({});
    setExtraTitle([]);
    setExtraURL([]);
    setUploaderKey((prevValue) => !prevValue);
  };

  const [selectedImageId, setSelectedImageId] = useState("");

  // Function to handle selecting an image
  const fileInputRef = useRef(null);
  const newFileInputRef = useRef(null);

  const handleImageSelect = (imageId) => {
    console.log(imageId);
    setSelectedImageId(imageId);
    setIsModalOpen(true);
  };

  const openFileExplorer = () => {
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
    borderRadius: "20px",
  };

  // Set the selected image ID

  const handleImageReplace = async (e, index) => {
    console.log("replacing: ", index);
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);

    imagesToDelete.push(imageUrls[index].imageId);
    const updatedImageUrls = {
      ...imageUrls,
      [index]: { imageId: file.name, href: url, File: file },
    };
    setImageUrls(updatedImageUrls);
  };

  const handleNewImage = async (e) => {
    const files = e.target.files;
    console.log("ADDING:", files);
    // Find the highest existing key
    const keys = Object.keys(imageUrls).map(Number); // Convert keys to numbers
    const highestKey = Math.max(...keys, 0); // Get the highest key or 0 if no keys exist

    // Iterate over each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const url = URL.createObjectURL(file);

      // Create a new element with the next available key
      const newKey = highestKey + i + 1; // Increment by i to avoid key collisions
      imageUrls[newKey] = { imageId: file.name, href: url, File: file };
    }

    // Update state with the new imageUrls object
    setImageUrls({ ...imageUrls });
    const uploader = document.getElementById("uploader");
    uploader.value = "";
  };

  const deleteImage = async () => {
    setIsModalOpen(false);

    const imageUrlKey = selectedImageId;
    const updatedImageUrls = { ...imageUrls };
    delete updatedImageUrls[imageUrlKey];

    // Reindex the keys
    let newIndex = 0;
    const reindexedImageUrls = {};
    Object.keys(updatedImageUrls).forEach((key) => {
      reindexedImageUrls[newIndex++] = updatedImageUrls[key];
    });

    imagesToDelete.push(selectedImageId);
    setImageUrls(reindexedImageUrls);
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
  const handleNewFileClick = () => {
    newFileInputRef.current.click();
  };
  const addInputs = () => {
    if (extraTitle.length === extraURL.length) {
      setExtraTitle([...extraTitle, ""]);
      setExtraURL([...extraURL, ""]);
    } else {
      console.error("Arrays are out of sync");
    }
  };
  const removeInput = (indexToRemove) => {
    setExtraTitle(extraTitle.filter((_, index) => index !== indexToRemove));
    setExtraURL(extraURL.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div>
      <ToastContainer />
      <h1 className="editEventTitle">Edit Event</h1>
      <div className="edit-event-container">
        <div
          className="slider-and-uploader"
          style={{ width: "25%", height: "300px" }}
        >
          <div className="image-slider">
            {Object.keys(imageUrls).length > 1 ? (
              <Slider {...settings}>
                {Object.keys(imageUrls).map((key, index) => (
                  <div key={index} onClick={() => handleImageSelect(key)}>
                    <img
                      width={"300px"}
                      height={"225px"}
                      src={imageUrls[key].href}
                      alt="Event Image"
                      className={
                        selectedImageId === key ? "selected-image" : ""
                      }
                    />
                  </div>
                ))}
              </Slider>
            ) : Object.keys(imageUrls).length === 0 ? (
              <Typography style={{ marginTop: "27%" }}>No images</Typography>
            ) : (
              <div>
                {Object.keys(imageUrls).map((key, index) => (
                  <img
                    key={index}
                    width={"300px"}
                    height={"225px"}
                    src={imageUrls[key].href}
                    alt="Event Image"
                    onClick={() => handleImageSelect(key)}
                    className={selectedImageId === key ? "selected-image" : ""}
                  />
                ))}
              </div>
            )}
          </div>

          <input
            className="event-uploader"
            type="file"
            id="newImageuploader"
            style={{ display: "none" }}
            ref={newFileInputRef}
            onChange={handleNewImage}
            multiple
          />

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={(e) => handleImageReplace(e, selectedImageId)}
          />

          <Button sx={{ fontWeight: "bold" }} onClick={handleNewFileClick}>
            {" "}
            + New Image
          </Button>

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

        <div className="input-fields" style={{ height: "300px", width: "25%" }}>
          <TextField
            className="eventName"
            type="text"
            label={"Name"}
            id="eventName"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Button onClick={toggleMode}>
            {dateMode === "range" ? "Toggle Single Date" : "Toggle Date Range"}
          </Button>
          {dateMode === "range" ? (
            <div style={{ gap: "7%", zIndex: "2000" }} className="date-picker">
              <DatePicker
                placeholderText="Start Date"
                className="input-field"
                selected={startDate}
                onChange={(date) => setStartDate(date)}
              />
              <DatePicker
                placeholderText="End Date"
                className="input-field"
                selected={endDate}
                onChange={(date) => setEndDate(date)}
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
              className="time-picker"
              type="time"
              label={"Start"}
              value={startTime || ""}
              InputLabelProps={{ shrink: true }}
              onChange={(e) => setStartTime(e.target.value)}
            />

            <TextField
              className="time-picker"
              type="time"
              InputLabelProps={{ shrink: true }}
              label={"End"}
              value={endTime || ""}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              gap: "4%",
            }}
          >
            <TextField
              type="number"
              label="Latitude"
              value={latitude}
              onChange={(e) => {
                const value = e.target.value;
                setLatitude(parseFloat(value));
              }}
            />
            <TextField
              type="number"
              value={longitude}
              label="Longitude"
              onBlur={(e) => {
                const value = e.target.value;
                setLongitude(parseFloat(value));
              }}
            />
          </div>
        </div>

        <div
          className="input-fields2"
          style={{ height: "300px", width: "25%" }}
        >
          <TextField
            type="text"
            rows={2}
            multiline
            label={"Short Description"}
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
          />

          <TextField
            type="text"
            rows={4}
            multiline
            label={"Long Description"}
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
        sx={{
          mt: 15,
          display: "flex",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <Button
          className="editEventSubmit"
          sx={{
            width: "20%",
            display: "flex",
            variant: "contained",
            color: "#FFF",
            backgroundColor: "#005588",
            "&:hover": {
              // Define hover state styles
              backgroundColor: "#003355", // Darken button on hover
              opacity: 0.9, // Slightly transparent on hover
            },
          }}
          onClick={handleSubmit}
        >
          Edit Event
        </Button>
        <Button
          startIcon={<ArrowBackIcon />}
          sx={{
            width: "20%",
            color: "#005588",
            backgroundColor: "#FFF",
            border: "1px solid #005588",
          }}
          onClick={() => navigate("/events")}
        >
          Go Back
        </Button>
      </Box>
    </div>
  );
}
