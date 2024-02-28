import React, { useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { Query } from "appwrite";
import CustomTable from "../NotificationComponents/NotificationTable";
import { database } from "../../../utils/AppwriteConfig";
import { ALERTS_COLLECTION_ID } from "../../../utils/AppwriteConfig";
import { DATABASE_ID } from "../../../utils/AppwriteConfig";
import { toast,ToastContainer } from "react-toastify";
import Layout from "./Layout";


export default function NotificationEdit() {
  const [allData,setAllData] = useState([]);

  const navigate = useNavigate();

  const SuccessfullDeletion = () => {
    toast.success("Notification Deleted", {
      position: toast.POSITION.TOP_CENTER,
    });
  };

  const DeletionFailed = () => {
    toast.error("Failed to Delete Notification", {
      position: toast.POSITION.TOP_CENTER,
    });
  };

  useEffect(() => {
    getNotifications();
  }, []); // Fetch all data initially

  const navigateToDash = () => {
    navigate("/dash");
  };

  const getNotifications = async () => {
    try {
      const response = await database.listDocuments(
        DATABASE_ID,
       ALERTS_COLLECTION_ID,
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

  const editNotification = (item) => {
    navigate("/editNotification", {
      state: {
        notification: item,
      }
    });
  };

  const createNotification = () => {
    navigate("/createNotification");
  };

  const deleteNotification = async (id) => {
    try {
      await database.deleteDocument(DATABASE_ID, ALERTS_COLLECTION_ID, id);
      SuccessfullDeletion();
      getNotifications();
    } catch (error) {
      console.error("Error deleting document:", error);
      DeletionFailed();
    }
  };



  return (
    <Layout>
    <div>
    <ToastContainer/>
        <button className="DashButton" onClick={navigateToDash}>
          Back to Dashboard
        </button>
      <div className="notificationEdit">
        <CustomTable allData={allData} onDelete={deleteNotification} onEdit={editNotification} onCreate={createNotification}/>
      </div>
    </div>
    </Layout>
  );
}
