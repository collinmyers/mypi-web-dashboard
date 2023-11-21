import React from "react";
import CreatEvent from "../dashboard/CreateEvent";
import DeleteEvent from "../dashboard/DeleteEvent";
import EditEvent from "../dashboard/EditEvent";
import "../../styling/EventsEditStyle.css";


export default function EventEdit(){
 

  return (
    <div>
      <div className="eventsEdit">
        <CreatEvent/>
        <DeleteEvent/>
        <EditEvent/>
      </div>
    </div>
  );
}

