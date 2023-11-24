import React from "react";
import CreatEvent from "./EventComponents/CreateEvent";
import DeleteEvent from "./EventComponents/DeleteEvent";
import EditEvent from "./EventComponents/EditEvent";
import "../../styling/EventsEditStyle.css";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function EventEdit(){
  const navigate = useNavigate();

  const navigateToDash = () => {
    navigate("/dash");
};


  return (
    <div>
      <div className="DashButton">
        <Button variant="contained" color="primary" onClick={navigateToDash}>Back to Dashboard</Button>
      </div>
      <div className="eventsEdit">
        <CreatEvent/>
        <DeleteEvent/>
        <EditEvent/>
      </div>
    </div>
  );
}

