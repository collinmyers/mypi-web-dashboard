import React, { useState } from "react";
import PropTypes from "prop-types";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { styled } from "@mui/system";

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
  const STableCell = styled(TableCell)({
      padding: ".7rem", 
      whiteSpace: "nowrap", 
      overflow: "hidden", 
      textOverflow: "ellipsis"
  });
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
              <STableCell key={header}>{header}</STableCell>
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
              <STableCell>
                {item.Title}
              </STableCell>
              <STableCell>
                {item.Description}
              </STableCell>
              <STableCell>
                <Button
                  className="edit-button"
                  onClick={() => onEdit(item)}
                  startIcon={<EditIcon />}
                />
              </STableCell>
              <STableCell>
                <Button
                  className="delete-button"
                  onClick={() => handleDeleteClick(item)}
                  startIcon={<DeleteIcon />}
                />
              </STableCell>
            </TableRow>
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 55 * emptyRows }}>
              <STableCell colSpan={4} />
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
