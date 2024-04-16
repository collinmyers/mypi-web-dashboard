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
import "../../../styling/TableStyling.css";
import PropTypes from "prop-types";

const NotificationTable = ({ allData, onEdit, onDelete, onCreate,size }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(6);

  const handleSearchChange = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleDeleteClick = ($id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete?");
    if (isConfirmed) {
      onDelete($id);
    }
  };

  const startIndex = (currentPage - 1) * pageSize;
  const currentPageData = allData.slice(startIndex, startIndex + pageSize);
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
        <Tooltip title="Create New Notification" placement="bottom">
          <Button
            className="add-icon-button"
            onClick={() => onCreate()}
            startIcon={<AddIcon />}
          />
        </Tooltip>
      </Box>
      <Table className="table">
        <TableHead>
          <TableRow className="row">
            {[
              "Title",
              "Details",
              "Alert Type",
              "Notification Type",
              "Edit",
              "Delete",
            ].map((header) => (
              <TableCell sx={{ padding: "0.7rem" }} key={header}>
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPageData.map((item) => (
            <TableRow
              className="row"
              sx={{
                overflow: "hidden",
              }}
              key={item.$id}
            >
              <TableCell
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {item.Title}
              </TableCell>
              <TableCell
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "200px", // Adjust the max width as needed
                }}
              >
                {item.Details}
              </TableCell>
              <TableCell>{item.AlertType}</TableCell>
              <TableCell>{item.NotificationType}</TableCell>
              <TableCell sx={{ padding: "0.7rem" }}>
                <Button
                  className="edit-button"
                  onClick={() => onEdit(item)}
                  startIcon={<EditIcon />}
                />
              </TableCell>
              <TableCell sx={{ padding: "0.7rem" }}>
                <Button
                  className="delete-button"
                  onClick={() => handleDeleteClick(item)}
                  startIcon={<DeleteIcon />}
                />
              </TableCell>
            </TableRow>
          ))}

          {emptyRows > 0 && (
            <TableRow style={{ height: size * emptyRows }}>
              <TableCell colSpan={7} />
            </TableRow>
          )}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={allData.length}
        onPageChange={(event, page) => setCurrentPage(page + 1)}
        page={currentPage - 1}
        rowsPerPage={pageSize}
        rowsPerPageOptions={[pageSize]}
        className="pagination"
      />
    </Card>
  );
};

NotificationTable.propTypes = {
  allData: PropTypes.arrayOf(PropTypes.object).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  size: PropTypes.number.isRequired,
};

export default NotificationTable;
