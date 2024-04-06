import React, { useState, useEffect} from "react";
import { Query } from "appwrite";
import { useNavigate } from "react-router-dom";
import ParkInfoTable from "../ParkInfoComponents/ParkInfoTable";
import { database } from "../../../utils/AppwriteConfig";
import { PARKINFO_COLLECTION_ID} from "../../../utils/AppwriteConfig";
import { DATABASE_ID } from "../../../utils/AppwriteConfig";
import { toast,ToastContainer } from "react-toastify";

import Layout from "./Layout"; 

export default function ParkInfo(){
  const [data,setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getParkInfo();
    
  },[]);


  const SuccessfulDeletion = () => {
    toast.success("Park Info deleted", {
      position: toast.POSITION.TOP_CENTER,
    });
  };

  const FailedDeletion = () => {
    toast.error("Failed to delete Park Info", {
      position: toast.POSITION.TOP_CENTER,
    });
  };

  

  const getParkInfo = async () =>{
    try {
      const response = await database.listDocuments(
        DATABASE_ID,
        PARKINFO_COLLECTION_ID,
        [
          Query.limit(1000), // Fetch all documents
          Query.offset(0)
        ]
      );
      console.log(response.documents);
      setData(response.documents);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }

  };

  const deletParkInfo = async (info) =>{
    try{
      console.log(info.$id);
      await database.deleteDocument(DATABASE_ID,PARKINFO_COLLECTION_ID,info.$id);
      //success toast
      getParkInfo();
      SuccessfulDeletion();

    } catch(error){
      console.log(error);
      FailedDeletion();
      //failtoast

    } 
  
  };

  const editParkInfo = (info) => {
    navigate("/edit-park-info", {
      state: {
          ParkInfo: info,
      }
    });
  };

  const createParkInfo = (info) =>{
    navigate("/create-park-info",{
      state:{
        ParkInfo: info,
      }

    });


  };



  const navigateToDash = () => {
    navigate("/dash");
  };

  return (
    <Layout> {/* Wrap your content inside the Layout component */}
      <ToastContainer/>
      <div>             
          <ParkInfoTable data={data} onDelete = {deletParkInfo} onEdit = {editParkInfo} onCreate ={createParkInfo}/>
      </div>
    </Layout>
  );
}
