import React, { useState } from "react";
import { Card, Table, TableBody, TableCell, TableHead, TableRow, TablePagination, TextField, Button, Box } from "@mui/material";
import { styled } from "@mui/system";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { Tooltip } from "@mui/material";
import PropTypes from "prop-types";

const ScrollableTableCell = styled(TableCell)({
  minWidth: 74,
  maxWidth: 74,
  width: 230,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  backgroundColor: "#f5f5f5",
  textAlign: "center",
});

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

  // ...

  // ...

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
    <Card sx={{ height: 580 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          minWidth: 800,
        }}
      >
        <TextField
          placeholder="Search by Name..."
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ flexGrow: 1, marginRight: "1rem", backgroundColor: "white" }}
        />
        <Tooltip title="Create New Event" placement="bottom">
        <Button
          onClick={() => createEvent()}
          startIcon={<AddIcon />}
          className="create-event-button"
        ></Button>
        </Tooltip>
      </Box>
      <Table sx={{ minHeight: 400 }}>
        <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
          <TableRow>
            <ScrollableTableCell>Name</ScrollableTableCell>
            <ScrollableTableCell>Latitude</ScrollableTableCell>
            <ScrollableTableCell>Longitude</ScrollableTableCell>
            <ScrollableTableCell>Date</ScrollableTableCell>
            <ScrollableTableCell>Time</ScrollableTableCell>
            <ScrollableTableCell>Description</ScrollableTableCell>
            <ScrollableTableCell>Long Description</ScrollableTableCell>
            <ScrollableTableCell>Edit</ScrollableTableCell>
            <ScrollableTableCell>Delete</ScrollableTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPageData.map((item) => (
            <TableRow key={item.$id}>
              <ScrollableTableCell>{item.Name}</ScrollableTableCell>
              <ScrollableTableCell>{item.Latitude}</ScrollableTableCell>
              <ScrollableTableCell>{item.Longitude}</ScrollableTableCell>
              <ScrollableTableCell>{item.Date}</ScrollableTableCell>
              <ScrollableTableCell>{item.Time}</ScrollableTableCell>
              <ScrollableTableCell>
                <Tooltip
                  title={item.EventDetailsDescription}
                  placement="bottom-start"
                >
                  {item.EventListDescription}
                </Tooltip>
              </ScrollableTableCell>
              <ScrollableTableCell>
                {item.EventDetailsDescription}
              </ScrollableTableCell>
              <ScrollableTableCell>
                <Button
                  sx={{ ml: 2 }}
                  onClick={() => editEvent(item)}
                  startIcon={<EditIcon />}
                  className="edit-button"
                />
              </ScrollableTableCell>
              <ScrollableTableCell>
                <Button
                  sx={{ ml: 2 }}
                  onClick={() => handleDeleteClick(item)}
                  startIcon={<DeleteIcon />}
                  className="delete-button"
                />
              </ScrollableTableCell>
            </TableRow>
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 65 * emptyRows }}>
              <TableCell colSpan={9} />
            </TableRow>
          )}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={filteredData.length}
        onPageChange={(event, page) => setCurrentPage(page + 1)}
        page={currentPage - 1}
        rowsPerPage={pageSize}
        rowsPerPageOptions={[pageSize]}
        sx={{ position: "absolute", bottom: 0, left: 0, right: 35 }}
      />
    </Card>
  );
};

export default EventsTable;
