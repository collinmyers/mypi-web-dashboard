// EventEdit.jsx

import React, { useState } from "react";
import CreateEvent from "../EventComponents/CreateEvent";
import DeleteEvent from "../EventComponents/DeleteEvent";
import EditEvent from "../EventComponents/EditEvent";
import "../../../styling/EventsEditStyle.css";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function EventEdit() {
  const [remountCreateEvent, setRemountCreateEvent] = useState(false);
  const [remountDeleteEvent, setRemountDeleteEvent] = useState(false);
  const [remountEditEvent, setRemountEditEvent] = useState(false);

  const navigate = useNavigate();

  const navigateToDash = () => {
    navigate("/dash");
  };

  const handleCreateEventRemounts = () => {
    // setRemountCreateEvent((prevValue) => !prevValue);
    setRemountDeleteEvent((prevValue) => !prevValue);
    setRemountEditEvent((prevValue) => !prevValue);
  };

  const handleDeleteEventRemounts = () => {
    setRemountDeleteEvent((prevValue) => !prevValue);
    setRemountEditEvent((prevValue) => !prevValue);

  };

  const handleEditEventRemounts = () => {
    setRemountEditEvent((prevValue) => !prevValue);
    setRemountDeleteEvent((prevValue) => !prevValue);

  };

  return (
    <div>
      <div className="DashButton">
        <Button variant="contained" color="primary" onClick={navigateToDash}>
          Back to Dashboard
        </Button>
      </div>
      <div className="eventsEdit">
        <CreateEvent onDataChange={handleCreateEventRemounts} />
        <DeleteEvent onDataChange={handleDeleteEventRemounts} />
        <EditEvent onDataChange={handleEditEventRemounts} />
      </div>
    </div>
  );
}
