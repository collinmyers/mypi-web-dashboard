import CreatePOI from "../dashboard/POIComponents/CreatePOI";
import DeletePOI from "../dashboard/POIComponents/DeletePOI";
import EditPOI from "../dashboard/POIComponents/EditPOI";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import "../../styling/POIEditStyle.css";


export default function POIEdit (){
    const navigate = useNavigate();


    const navigateToDash = () => {
        navigate("/dash");
      };

    return(
        <div>
            <div className="DashButton">
             <Button variant="contained" color="primary" onClick={navigateToDash}>
                Back to Dashboard
             </Button>
      </div>
        <div className="poiEdit">
        <CreatePOI/>
        <DeletePOI/>
        <EditPOI/>
        </div>
        </div>
    );
}