import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import "../../../styling/POIEditStyle.css";
import { Query } from "appwrite";
import CustomTable from "../POIComponents/POITable";
import { database } from "../../../utils/AppwriteConfig";
import { MAP_COLLECTION_ID } from "../../../utils/AppwriteConfig";
import { DATABASE_ID } from "../../../utils/AppwriteConfig";
import { toast,ToastContainer } from "react-toastify";


export default function POIEdit() {
  const [data, setData] = useState([]);
  const [allData,setAllData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(8); // Number of items per page

  const navigate = useNavigate();

  const SuccessfullDeletion = () => {
    toast.success("Event Deleted", {
      position: toast.POSITION.TOP_CENTER,
    });
  };

  const DeletionFailed = () => {
    toast.error("Failed to Delete Event", {
      position: toast.POSITION.TOP_CENTER,
    });
  };

  useEffect(() => {
    getPOI();
  }, []); // Fetch all data initially

  const navigateToDash = () => {
    navigate("/dash");
  };

  const getPOI = async () => {
    try {
      const response = await database.listDocuments(
        DATABASE_ID,
        MAP_COLLECTION_ID,
        [
          Query.limit(1000), // Fetch all documents
          Query.offset(0)
        ]
      );
      setData(response.documents);
      setAllData(response.documents);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  const editEvent = (id) => {
    navigate("/editPOI", {
      state: {
        poiID: id,
      }
    });
  };

  const createPOI = () => {
    navigate("/createPOI");
  };

  const deleteEvent = async (id) => {
    try {
      await database.deleteDocument(DATABASE_ID, MAP_COLLECTION_ID, id);
      getPOI();
      SuccessfullDeletion();
    } catch (error) {
      console.error("Error deleting document:", error);
      DeletionFailed();
    }
  };

  const totalPages = Math.ceil(data.length / pageSize);

  // Get the current page of data based on pageSize and currentPage
  const currentPageData = data.slice((page - 1) * pageSize, page * pageSize);

  const fetchPreviousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1)); // Decrement page number, but not below 1
  };

  const fetchNextPage = () => {
    const totalPages = Math.ceil(data.length / pageSize);
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1); // Increment page number
    }
  };
  

  return (
    <div>
      <div className="DashButton">
        <Button variant="contained" color="primary" onClick={navigateToDash}>
          Back to Dashboard
        </Button>
      </div>
      <div className="poiEdit">
        <CustomTable
          data={currentPageData}
          onDelete={deleteEvent}
          onEdit={editEvent}
          fetchPreviousPage={fetchPreviousPage}
          fetchNextPage={fetchNextPage}
          currentPage={page}
          totalPages={totalPages}
          onCreate={createPOI}
        />
      </div>
    </div>
  );
}
