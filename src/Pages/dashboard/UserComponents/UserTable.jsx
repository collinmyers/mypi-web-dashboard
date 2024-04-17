import React, { useState } from "react";
import PropTypes from "prop-types";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PasswordIcon from "@mui/icons-material/Password";
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
import { styled } from "@mui/system";


const UserTable = ({ allData, passwordReset, onEdit, onDelete }) => {
  const STableCell = styled(TableCell)({
    padding: ".7rem", 
    whiteSpace: "nowrap", 
    overflow: "hidden", 
    textOverflow: "ellipsis"
  });




  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(6);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleDeleteClick = ($id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete?");
    if (isConfirmed) {
      onDelete($id);
    }
  };
  const handleReset = (email) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to send password reset to your email?"
    );
    if (isConfirmed) {
      passwordReset(email);
    }
  };

  const filteredData = allData.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
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
      </Box>
      <Table className="table">
        <TableHead>
          <TableRow className="row">
            {["Name", "Email", "Password Reset", "Edit", "Delete"].map(
              (header) => (
                <STableCell key={header}>
                  {header}
                </STableCell>
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
              {[item.name, item.email].map((value, index) => (
                <STableCell key={index}>
                  {value}
                </STableCell>
              ))}
              <TableCell style={{padding: "0.7rem"}} >
                <Button
                  className="password-button"
                  onClick={() => handleReset(item.email)}
                  startIcon={<PasswordIcon />}
                />
              </TableCell>
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
                  onClick={() => handleDeleteClick(item.$id)}
                  startIcon={<DeleteIcon />}
                />
              </TableCell>
            </TableRow>
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 55 * emptyRows }}>
              <TableCell sx={{ padding: "0.7rem" }} colSpan={7} />
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
        className="pagination"
      />
    </Card>
  );
};

UserTable.propTypes = {
  allData: PropTypes.array.isRequired,
  passwordReset: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default UserTable;


