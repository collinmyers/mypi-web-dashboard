import React, { useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";

import { toast,ToastContainer } from "react-toastify";
import Layout from "./Layout";


export default function POIEdit() {
  const [allData,setAllData] = useState([]);

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
    // getUsers();
  }, []); // Fetch all data initially

 

//   const getUsers = async () => {
//     const promise = users.list();

//     promise.then(function (response) {
//         console.log(response);
//     }, function (error) {
//         console.log(error);
//     });

//   };

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

//   const deletePOI = async (id) => {
//     try {
//       await database.deleteDocument(DATABASE_ID, MAP_COLLECTION_ID, id);
//       SuccessfullDeletion();
//       getPOI();
//     } catch (error) {
//       console.error("Error deleting document:", error);
//       DeletionFailed();
//     }
//   };



  return (
    <Layout>
    <div>
    <ToastContainer/>
      
      
      <div className="userEdit">
      </div>
    </div>
    </Layout>
  );
}
