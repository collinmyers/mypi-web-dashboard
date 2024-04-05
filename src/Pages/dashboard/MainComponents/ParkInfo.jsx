import React, { useState, useEffect} from "react";
import { Query } from "appwrite";
import { useNavigate } from "react-router-dom";
import FAQTable from "../FAQComponents/FAQTable";
import { database } from "../../../utils/AppwriteConfig";
import { FAQ_COLLECTION_ID } from "../../../utils/AppwriteConfig";
import { DATABASE_ID } from "../../../utils/AppwriteConfig";
import { toast,ToastContainer } from "react-toastify";

import Layout from "./Layout"; 

export default function ParkInfo(){
  const [data,setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getFAQs();
    
  },[]);


  const SuccessfulDeletion = () => {
    toast.success("FAQ deleted", {
      position: toast.POSITION.TOP_CENTER,
    });
  };

  const FailedDeletion = () => {
    toast.error("Failed to delete FAQ", {
      position: toast.POSITION.TOP_CENTER,
    });
  };

  

  const getParkInfo = async () =>{
    try {
      const response = await database.listDocuments(
        DATABASE_ID,
        FAQ_COLLECTION_ID,
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

  const deletFAQ = async (faq) =>{
    try{
      console.log(faq.$id);
      await database.deleteDocument(DATABASE_ID,FAQ_COLLECTION_ID,faq.$id);
      //success toast
      getFAQs();
      SuccessfulDeletion();

    } catch(error){
      console.log(error);
      FailedDeletion();
      //failtoast

    } 
  
  };

  const editFAQ = (faq) => {
    navigate("/editFAQ", {
      state: {
        FAQ: faq,
      }
    });
  };

  const createFAQ = (faq) =>{
    navigate("/createFAQ",{
      state:{
        FAQ: faq,
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
          <FAQTable data={data} onDelete = {deletFAQ} onEdit = {editFAQ} onCreate ={createFAQ}/>
      </div>
    </Layout>
  );
}
