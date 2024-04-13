import React, { useState, useEffect} from "react";
import { Query } from "appwrite";
import { useNavigate } from "react-router-dom";
import ParkInfoTable from "../AboutComponents/AboutTable";
import { database } from "../../../utils/AppwriteConfig";
import { PARKINFO_COLLECTION_ID} from "../../../utils/AppwriteConfig";
import { DATABASE_ID } from "../../../utils/AppwriteConfig";
import { toast,ToastContainer } from "react-toastify";
import Layout from "./Layout"; 

export default function About(){
  const [data,setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAbout();
    
  },[]);


  const SuccessfulDeletion = () => {
    toast.success("About deleted", {
      position: toast.POSITION.TOP_CENTER,
    });
  };

  const FailedDeletion = () => {
    toast.error("Failed to delete About", {
      position: toast.POSITION.TOP_CENTER,
    });
  };

  

  const getAbout = async () =>{
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

  const deleteAbout = async (info) =>{
    try{
      await database.deleteDocument(DATABASE_ID,PARKINFO_COLLECTION_ID,info.$id);
      //success toast
      getAbout();
      SuccessfulDeletion();

    } catch(error){
      console.log(error);
      FailedDeletion();
      //failtoast

    } 
  
  };

  const editAbout = (item) => {
    navigate("/edit-about", {
      state: {
          About: item,
      }
    });
  };

  const createAbout = (info) =>{
    navigate("/create-about",{
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
          <ParkInfoTable data={data} onDelete = {deleteAbout} onEdit = {editAbout} onCreate ={createAbout}/>
      </div>
    </Layout>
  );
}
