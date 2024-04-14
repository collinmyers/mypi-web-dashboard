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
import "../../../styling/TableStyling.css";

const AboutTable = ({ allData, onDelete, onEdit, onCreate }) => {
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
    item.Title.toLowerCase().includes(searchTerm)
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
        <Button onClick={() => onCreate()} startIcon={<AddIcon />} />
      </Box>
      <Table className="table">
        <TableHead>
          <TableRow className="row">
            {["Title", "Description", "Edit", "Delete"].map((header) => (
              <TableCell key={header}>{header}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPageData.map((item) => (
            <TableRow
              className="row"
              key={item.$id}
              sx={{ textAlign: "center", overflow: "hidden" }}
            >
              <TableCell
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "200px",
                }}
              >
                {item.Title}
              </TableCell>
              <TableCell
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "200px",
                }}
              >
                {item.Description}
              </TableCell>
              <TableCell>
                <Button
                  className="edit-button"
                  onClick={() => onEdit(item)}
                  startIcon={<EditIcon />}
                />
              </TableCell>
              <TableCell>
                <Button
                  className="delete-button"
                  onClick={() => handleDeleteClick(item)}
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
        onPageChange={(event, page) => setCurrentPage(page)}
        page={currentPage}
        rowsPerPage={pageSize}
        rowsPerPageOptions={[pageSize]}
        className="pagination"
      />
    </Card>
  );
};

AboutTable.propTypes = {
  allData: PropTypes.array.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
};

export default AboutTable;
