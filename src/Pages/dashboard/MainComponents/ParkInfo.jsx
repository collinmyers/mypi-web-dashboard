import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import { database } from "/src/utils/AppwriteConfig"; // Import your Appwrite database configuration
// import { API_ENDPOINT } from "../../../utils/AppwriteConfig";
const ParkInfo = () => {
  const [parkInfo, setParkInfo] = useState([]);
  const [currentPark, setCurrentPark] = useState({
    name: "",
    location: "",
    description: "",
  });
  const [editing, setEditing] = useState(false);

  // Function to fetch park information from Appwrite
  const fetchParkInfo = () => {
    database.listDocuments("YOUR_PARK_INFO_COLLECTION_ID").then(
      (response) => {
        console.log(response);
        setParkInfo(response.documents);
      },
      (error) => {
        console.error(error);
      }
    );
  };

  useEffect(() => {
    fetchParkInfo();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentPark({ ...currentPark, [name]: value });
  };

  const submitParkInfo = (e) => {
    e.preventDefault();
    if (currentPark.$id) {
      // Edit operation
      database
        .updateDocument(
          "YOUR_PARK_INFO_COLLECTION_ID",
          currentPark.$id,
          currentPark
        )
        .then(
          () => {
            fetchParkInfo();
            setCurrentPark({ name: "", location: "", description: "" });
            setEditing(false);
          },
          (error) => {
            console.error(error);
          }
        );
    } else {
      // Create operation
      database
        .createDocument(
          "YOUR_PARK_INFO_COLLECTION_ID",
          "unique()",
          currentPark,
          []
        )
        .then(
          () => {
            fetchParkInfo();
            setCurrentPark({ name: "", location: "", description: "" });
          },
          (error) => {
            console.error(error);
          }
        );
    }
  };

  const editParkInfo = (info) => {
    setEditing(true);
    setCurrentPark(info);
  };

  const deleteParkInfo = (id) => {
    database.deleteDocument("YOUR_PARK_INFO_COLLECTION_ID", id).then(
      () => {
        fetchParkInfo();
      },
      (error) => {
        console.error(error);
      }
    );
  };

  return (
    <Layout>
      <div>
        <h2>{editing ? "Edit Park" : "Edit Park Info"}</h2>
        <form onSubmit={submitParkInfo}>
          <input
            type="text"
            name="name"
            placeholder="Park name"
            value={currentPark.name}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={currentPark.location}
            onChange={handleInputChange}
          />
          <textarea
            name="description"
            placeholder="Description"
            value={currentPark.description}
            onChange={handleInputChange}
          />
          <button type="submit">Submit</button>
        </form>
        <div>
          {parkInfo.map((info) => (
            <div key={info.$id}>
              <h3>{info.name}</h3>
              <p>{info.location}</p>
              <p>{info.description}</p>
              <button onClick={() => editParkInfo(info)}>Edit</button>
              <button onClick={() => deleteParkInfo(info.$id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ParkInfo;
