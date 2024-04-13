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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);

  const handleSearchChange = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleDeleteClick = (item) => {
    const isConfirmed = window.confirm("Are you sure you want to delete?");
    if (isConfirmed) {
      deleteEvent(item);
    }
  };

  EventsTable.propTypes = {
    data: PropTypes.array.isRequired,
    deleteEvent: PropTypes.func.isRequired,
    editEvent: PropTypes.func.isRequired,
    createEvent: PropTypes.func.isRequired,
  };

  const filteredData = data.filter((item) =>
    item.Name.toLowerCase().includes(searchTerm)
  );

  const startIndex = (currentPage - 1) * pageSize;
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
              sx={{ textAlign: "center" }}
            >
              {[
                item.Name,
                item.Latitude,
                item.Longitude,
                item.Date,
                item.Time,
                item.Description,
                item.LongDescription,
              ].map((value, index) => (
                <TableCell key={index}>{value}</TableCell>
              ))}

              <TableCell>
                <Button
                  className="edit-button"
                  onClick={() => editEvent(item)}
                  startIcon={<EditIcon />}
                />
              </TableCell>

              <TableCell>
                <Button
                  className="delete-button"
                  onClick={() => handleDeleteClick(item.$id)}
                  startIcon={<DeleteIcon />}
                />
              </TableCell>
            </TableRow>
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 65 * emptyRows }}>
              <TableCell colSpan={7} />
            </TableRow>
          )}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={filteredData.length}
        onPageChange={(event, page) => setCurrentPage(page + 1)}
        page={currentPage}
        rowsPerPage={pageSize}
        rowsPerPageOptions={[pageSize]}
        className="pagination"
      />
    </Card>
  );
};

export default EventsTable;

// Needs Fixed. Description and LD are not showing up in the table.
// Consistent Styling Implemented.
// I went line by line for this shit, omg.
// But the code from VendorPOI helped a lot, so thanks.
