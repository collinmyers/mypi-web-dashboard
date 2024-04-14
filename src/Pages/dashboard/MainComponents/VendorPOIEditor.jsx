import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styling/POIStyling/POIEditStyle.css";
import { Query } from "appwrite";

import VendorPOITable from "../VendorPOI/VendorPOITable";
import { VENDOR_POI_COLLECTION_ID, database } from "../../../utils/AppwriteConfig";
import { DATABASE_ID } from "../../../utils/AppwriteConfig";
import { toast, ToastContainer } from "react-toastify";
import Layout from "./Layout";

export default function VendorPOIEdit() {
    const [allData, setAllData] = useState([]);

    const navigate = useNavigate();

    const SuccessfulDeletion = () => {
        toast.success("POI Deleted", {
            position: toast.POSITION.TOP_CENTER,
        });
    };

    const DeletionFailed = () => {
        toast.error("Failed to Delete POI", {
            position: toast.POSITION.TOP_CENTER,
        });
    };

    useEffect(() => {
        getPOI();
    }, []); // Fetch all data initially


    const getPOI = async () => {
        try {
            const response = await database.listDocuments(
                DATABASE_ID,
                VENDOR_POI_COLLECTION_ID,
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
        navigate("/edit-vendor-point-of-interest", {
            state: {
                poi: item,
            }
        });
    };

    const createPOI = () => {
        navigate("/create-vendor-point-of-interest");
    };

    const deletePOI = async (poi) => {
        try {
            await database.deleteDocument(DATABASE_ID, VENDOR_POI_COLLECTION_ID, poi.$id);
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
                <ToastContainer />
                <div className="poiEdit">
                    <VendorPOITable allData={allData} onDelete={deletePOI} onCreate={createPOI} />
                </div>
            </div>
        </Layout>
    );
}
