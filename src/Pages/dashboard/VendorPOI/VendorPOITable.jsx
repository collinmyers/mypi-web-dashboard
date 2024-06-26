import React, { useState } from "react";
import PropTypes from "prop-types";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Button,
} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import "../../../styling/TableStyling.css";

const VendorPOITable = ({ allData, onDelete, onCreate }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0); // Zero-based indexing
  const [pageSize] = useState(6);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
    setCurrentPage(0); // Reset to the first page when searching
  };

  const handleDeleteClick = ($id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete?");
    if (isConfirmed) {
      onDelete($id);
    }
  };

  const filteredData = allData.filter((item) =>
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
        <Tooltip title="Create New POI" placement="top">
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
            {["Name", "Latitude", "Longitude", "Status", "Type", "Delete"].map(
              (header) => (
                <TableCell sx={{ padding: "0.7rem" }} key={header}>
                  {header}
                </TableCell>
              )
            )}
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
                item.Status,
                item.Type,
              ].map((value, index) => (
                <TableCell sx={{ padding: "0.7rem" }} key={index}>
                  {value}
                </TableCell>
              ))}

              <TableCell sx={{ padding: ".7rem" }}>
                <Button
                  className="delete-button"
                  onClick={() => handleDeleteClick(item.$id)}
                  startIcon={<DeleteIcon />}
                />
              </TableCell>
            </TableRow>
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 55 * emptyRows }}>
              <TableCell sx={{ padding: ".7rem" }} colSpan={7} />
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

VendorPOITable.propTypes = {
  allData: PropTypes.array.isRequired,
  onDelete: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
};

export default VendorPOITable;
