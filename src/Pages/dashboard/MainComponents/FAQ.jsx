import React, { useState, useEffect} from "react";
import { Query } from "appwrite";
import { useNavigate } from "react-router-dom";
import FAQTable from "../FAQComponents/FAQTable";
import { database } from "../../../utils/AppwriteConfig";
import { FAQ_COLLECTION_ID } from "../../../utils/AppwriteConfig";
import { DATABASE_ID } from "../../../utils/AppwriteConfig";

import Layout from "./Layout"; 

export default function FAQ(){
  const [data,setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getFAQs();
    
  },[]);

  const getFAQs = async () =>{
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

  const navigateToDash = () => {
    navigate("/dash");
  };

  return (
    <Layout> {/* Wrap your content inside the Layout component */}
      <div>             
          <FAQTable data={data}/>
      </div>
    </Layout>
  );
}
