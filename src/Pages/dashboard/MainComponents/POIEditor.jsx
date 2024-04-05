import React, { useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import "../../../styling/POIStyling/POIEditStyle.css";
import { Query } from "appwrite";
import CustomTable from "../POIComponents/POITable";
import { database } from "../../../utils/AppwriteConfig";
import { MAP_COLLECTION_ID } from "../../../utils/AppwriteConfig";
import { DATABASE_ID } from "../../../utils/AppwriteConfig";
import { toast,ToastContainer } from "react-toastify";
import Layout from "./Layout";

export default function POIEdit() {
  const [allData,setAllData] = useState([]);

  const navigate = useNavigate();

  const SuccessfulDeletion = () => {
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
      setAllData(response.documents);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  const editPOI = (item) => {
    navigate("/editPOI", {
      state: {
        poi: item,
      }
    });
  };

  const createPOI = () => {
    navigate("/createPOI");
  };

  const deletePOI = async (id) => {
    try {
      await database.deleteDocument(DATABASE_ID, MAP_COLLECTION_ID, id);
      SuccessfulDeletion();
      getPOI();
    } catch (error) {
      console.error("Error deleting document:", error);
      DeletionFailed();
    }
  };



  return (
    <Layout>
    <div>
    <ToastContainer/>
      <div className="poiEdit">
        <CustomTable allData={allData} onDelete={deletePOI} onEdit={editPOI} onCreate={createPOI}/>
      </div>
    </div>
    </Layout>
  );
}
