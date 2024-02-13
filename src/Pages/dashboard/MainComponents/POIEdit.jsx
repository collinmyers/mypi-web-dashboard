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
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 8; // Number of items per page

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
  }, [page]); // Fetch data when page changes

  const navigateToDash = () => {
    navigate("/dash");
  };

 

  const getPOI = async () => {
    const offset = (page - 1) * pageSize;
    try {
      const response = await database.listDocuments(
        DATABASE_ID,
        MAP_COLLECTION_ID,
        [
          Query.limit(pageSize),
          Query.offset(offset)
        ]
      );
      setData(response.documents);
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

  const fetchPreviousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1)); // Decrement page number, but not below 1
  };

  const fetchNextPage = () => {
    if (data.length === 0 || data.length % pageSize !== 0) {
      // No more data, or last page reached, do nothing
      return;
    }
    setPage((prevPage) => prevPage + 1); // Increment page number
  };
  

  const totalPages = Math.ceil(totalDocuments / pageSize);

  return (
    <div>
      <div className="DashButton">
        <Button variant="contained" color="primary" onClick={navigateToDash}>
          Back to Dashboard
        </Button>
      </div>
      <div className="poiEdit">
        <CustomTable
          data={data}
          onDelete={deleteEvent}
          onEdit={editEvent}
          fetchPreviousPage={fetchPreviousPage}
          fetchNextPage={fetchNextPage}
          currentPage={page}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}
