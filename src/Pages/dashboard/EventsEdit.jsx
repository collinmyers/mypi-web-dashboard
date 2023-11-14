import React from "react";
import { Button } from "@mui/material";

import "../../styling/DashStyling.css";


export default function EventsEditor() {




    return (

        <div className="container">
            <div className="content">
                <h1 className="dashTitle">Events Editor</h1>
                <Button>Create Event</Button>
                <Button>Update Event</Button>

                <Button>Delete Event</Button>


            </div>
        </div>


    );
}
