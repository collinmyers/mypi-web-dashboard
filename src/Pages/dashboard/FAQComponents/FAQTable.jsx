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
import "../../../styling/TableStyling.css";

const STableCell = styled(TableCell)({
  padding: ".7rem", 
  whiteSpace: "nowrap", 
  overflow: "hidden", 
  textOverflow: "ellipsis"
});

const FAQTable = ({ data, onDelete, onEdit, onCreate }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0); // Zero-based indexing
  const [pageSize, setPageSize] = useState(6);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
    setCurrentPage(0); // Reset to the first page when searching
  };

  const handleDeleteClick = (item) => {
    const isConfirmed = window.confirm("Are you sure you want to delete?");
    if (isConfirmed) {
      onDelete(item);
    }
  };

  const filteredData = data.filter((item) =>
    item.Question.toLowerCase().includes(searchTerm)
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
        <Button
          className="add-icon-button"
          onClick={() => onCreate()}
          startIcon={<AddIcon />}
        />
      </Box>
      <Table className="table">
        <TableHead>
          <TableRow className="row">
            <STableCell >Question</STableCell>
            <STableCell >Answer</STableCell>
            <STableCell >Edit</STableCell>
            <STableCell >Delete</STableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPageData.map((item) => (
            <TableRow className="row" key={item.$id}>
              <STableCell>
                {item.Question}
                </STableCell>
              <STableCell>
              {item.Answer}
                </STableCell>
              <STableCell>
                <Button
                  sx={{ ml: 2 }}
                  onClick={() => onEdit(item)}
                  startIcon={<EditIcon />}
                />
              </STableCell>
              <STableCell>
                <Button
                  sx={{ ml: 2 }}
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
        sx={{ position: "sticky", bottom: 0, left: 0, right: 100 }}
      />
    </Card>
  );
};

FAQTable.propTypes = {
  data: PropTypes.array.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
};

export default FAQTable;
