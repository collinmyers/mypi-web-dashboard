import React, { useState } from "react";
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Button,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { Tooltip } from "@mui/material";
import PropTypes from "prop-types";
import "../../../styling/TableStyling.css";

const EventsTable = ({ data, deleteEvent, editEvent, createEvent }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(5);

  const handleSearchChange = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    setCurrentPage(0); // Reset to first page when searching
  };

  const handleDeleteClick = (item) => {
    const isConfirmed = window.confirm("Are you sure you want to delete?");
    if (isConfirmed) {
      deleteEvent(item);
    }
  };

  const filteredData = data.filter((item) =>
    item.Name.toLowerCase().includes(searchTerm)
  );

  const startIndex = currentPage * pageSize;
  const currentPageData = filteredData.slice(startIndex, startIndex + pageSize);
  const emptyRows = pageSize - Math.min(pageSize, currentPageData.length);

  return (
    <Card className="card">
      <Box className="search-box">
        <TextField
          placeholder="Search by Name..."
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-text-field"
        />
        <Tooltip title="Create New Event" placement="bottom">
          <Button
            className="add-icon-button"
            onClick={() => createEvent()}
            startIcon={<AddIcon />}
          />
        </Tooltip>
      </Box>
      <Table className="table">
        <TableHead>
          <TableRow className="row">
            {[
              "Name",
              "Latitude",
              "Longitude",
              "Date",
              "Time",
              "Description",
              "Long Description",
              "Edit",
              "Delete",
            ].map((header) => (
              <TableCell key={header}>{header}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPageData.map((item) => (
            <TableRow
              className="row"
              key={item.$id}
              sx={{ textAlign: "center", padding: ".7rem" }}
            >
              <TableCell
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "50px",
                  padding: ".7rem",
                }}
              >
                {item.Name}
              </TableCell>
              <TableCell
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "50px",
                  padding: ".7rem",
                }}
              >
                {item.Latitude}
              </TableCell>
              <TableCell
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "50px",
                  padding: ".7rem",
                }}
              >
                {item.Longitude}
              </TableCell>
              <TableCell
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "50px",
                  padding: ".7rem",
                }}
              >
                {item.Date}
              </TableCell>
              <TableCell
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "50px",
                  padding: ".7rem",
                }}
              >
                {item.Time}
              </TableCell>
              <TableCell
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "50px",
                  padding: ".7rem",
                }}
              >
                {item.EventListDescription}
              </TableCell>
              <TableCell
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "50px",
                  padding: ".7rem",
                }}
              >
                {item.EventDetailsDescription}
              </TableCell>
              <TableCell sx={{ padding: ".7rem" }}>
                <Button
                  className="edit-button"
                  onClick={() => editEvent(item)}
                  startIcon={<EditIcon />}
                />
              </TableCell>
              <TableCell sx={{ padding: ".7rem" }}>
                <Button
                  className="delete-button"
                  onClick={() => handleDeleteClick(item)}
                  startIcon={<DeleteIcon />}
                />
              </TableCell>
            </TableRow>
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 55 * emptyRows }}>
              <TableCell sx={{ padding: ".7rem" }} colSpan={9} />
            </TableRow>
          )}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={filteredData.length}
        onPageChange={(event, page) => setCurrentPage(page)}
        page={currentPage}
        rowsPerPage={pageSize}
        rowsPerPageOptions={[pageSize]}
        className="pagination"
      />
    </Card>
  );
};

EventsTable.propTypes = {
  data: PropTypes.array.isRequired,
  deleteEvent: PropTypes.func.isRequired,
  editEvent: PropTypes.func.isRequired,
  createEvent: PropTypes.func.isRequired,
};

export default EventsTable;
