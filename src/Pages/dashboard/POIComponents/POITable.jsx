import React, { useState } from "react";
import PropTypes from "prop-types";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
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
import { styled } from "@mui/system";
import Tooltip from "@mui/material/Tooltip";
import "../../../styling/TableStyling.css";

const StyledTableCell = styled(TableCell)({
  minWidth: "50px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  textAlign: "center",
});

const POITable = ({ allData, onEdit, onDelete, onCreate }) => {
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
      <Box className="search-and-add-box">
        <TextField
          className="search-text-field"
          placeholder="Search by Name..."
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <Tooltip title="Create New POI" placement="bottom">
          <Button
            className="add-icon-button"
            onClick={onCreate}
            startIcon={<AddIcon />}
          />
        </Tooltip>
      </Box>
      <Table className="table">
        <TableHead>
          <TableRow className="row">
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell>Latitude</StyledTableCell>
            <StyledTableCell>Longitude</StyledTableCell>
            <StyledTableCell>Status</StyledTableCell>
            <StyledTableCell>Type</StyledTableCell>
            <StyledTableCell>Edit</StyledTableCell>
            <StyledTableCell>Delete</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPageData.map((item) => (
            <TableRow key={item.$id}>
              <StyledTableCell>{item.Name}</StyledTableCell>
              <StyledTableCell>{item.Latitude}</StyledTableCell>
              <StyledTableCell>{item.Longitude}</StyledTableCell>
              <StyledTableCell>{item.Status}</StyledTableCell>
              <StyledTableCell>{item.Type}</StyledTableCell>
              <StyledTableCell>
                <Button className="edit-button" onClick={() => onEdit(item)}>
                  <EditIcon />
                </Button>
              </StyledTableCell>
              <StyledTableCell>
                <Button
                  className="delete-button"
                  onClick={() => handleDeleteClick(item.$id)}
                >
                  <DeleteIcon />
                </Button>
              </StyledTableCell>
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
        onPageChange={(event, page) => setCurrentPage(page)}
        page={currentPage}
        rowsPerPage={pageSize}
        rowsPerPageOptions={[pageSize]}
        className="pagination"
      />
    </Card>
  );
};

POITable.propTypes = {
  allData: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
};

export default POITable;
