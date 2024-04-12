import React, { useState } from "react";
import PropTypes from "prop-types";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { Box, Card, Table, TableBody, TableCell, TableHead, TableRow, TablePagination, TextField, Button } from "@mui/material";
import { styled } from "@mui/system";
import "../../../styling/FAQStyling/FAQTableStyle.css";

const StyledTableCell = styled(TableCell)({
  maxWidth: "250px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  textAlign: "center",
//   backgroundColor: "white",
});

const ParkInfoTable = ({ data, onDelete, onEdit, onCreate }) => {
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
    item.Title.toLowerCase().includes(searchTerm)
  );

  const startIndex = currentPage * pageSize;
  const currentPageData = filteredData.slice(startIndex, startIndex + pageSize);
  const emptyRows = pageSize - Math.min(pageSize, currentPageData.length);

  return (
    <Card className="FAQ-card">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem",
          backgroundColor: "#f5f5f5",
        }}
      >
        <TextField
          placeholder="Search by Name..."
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ flexGrow: 1, marginRight: "1rem", backgroundColor: "white" }}
        />
        <Button onClick={() => onCreate()} startIcon={<AddIcon />}/>
      </Box>
      <Table className="FAQ-table">
        <TableHead >
          <TableRow className="FAQ-row">
          <StyledTableCell>Title</StyledTableCell>
          <StyledTableCell>Description</StyledTableCell>
          <StyledTableCell>Edit</StyledTableCell>
          <StyledTableCell>Delete</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPageData.map((item) => (
            <TableRow key={item.$id}>
              <StyledTableCell>{item.Title}</StyledTableCell>
              <StyledTableCell>{item.Description}</StyledTableCell>
              <TableCell className="FAQ-cell">
                <Button sx={{ml:2}}  startIcon={<EditIcon />} />
              </TableCell>
              <TableCell className="FAQ-cell">
                <Button sx ={{ml:2}}  startIcon={<DeleteIcon />}/>
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
        sx={{ position: "sticky", bottom: 0, left: 0, right: 100 }}
      />
    </Card>
  );
};

ParkInfoTable.propTypes = {
  data: PropTypes.array.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired
};

export default ParkInfoTable;
