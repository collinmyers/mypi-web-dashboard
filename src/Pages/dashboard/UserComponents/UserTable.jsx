import React, { useState } from "react";
import PropTypes from "prop-types";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import PasswordIcon from "@mui/icons-material/Password";
import { Box, Card, Table, TableBody, TableCell, TableHead, TableRow, TablePagination, TextField, Button, } from "@mui/material";
import { styled } from "@mui/system";

const ScrollableTableCell = styled(TableCell)({
  minWidth: 160,
  maxWidth: 160,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  backgroundColor: "#f5f5f5",
  textAlign: "center",
});


const UserTable = ({ allData, passwordReset, onEdit }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(6);

  const handleSearchChange = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // const handleDeleteClick = ($id) => {
  //   const isConfirmed = window.confirm("Are you sure you want to delete?");
  //   if (isConfirmed) {
  //     onDelete($id);
  //   }
  // };
  const handleReset = (email) => {
    const isConfirmed = window.confirm("Are you sure you want to send password recovery email?");
    if (isConfirmed) {
      passwordReset(email);
    }
  };

  UserTable.propTypes = {
    allData: PropTypes.array.isRequired,
    passwordReset: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired
  };

  const filteredData = allData.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = (currentPage - 1) * pageSize;
  const currentPageData = filteredData.slice(startIndex, startIndex + pageSize);

  const emptyRows = pageSize - Math.min(pageSize, currentPageData.length);

  return (
    <Card sx={{ height: 580 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", minWidth: 800 }}>
        <TextField
          placeholder="Search by Name..."
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ mb: 2, ml: 1, width: 350, height: 1, mt: 1 }}
        />

      </Box>
      <Table sx={{ minHeight: 400 }}>
        <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
          <TableRow>
            <ScrollableTableCell>Name</ScrollableTableCell>
            <ScrollableTableCell>Email</ScrollableTableCell>
            <ScrollableTableCell>Password Reset</ScrollableTableCell>
            <ScrollableTableCell>Edit</ScrollableTableCell>
            <ScrollableTableCell>Delete</ScrollableTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPageData.map((item) => (
            <TableRow key={item.$id}>
              <ScrollableTableCell>{item.name}</ScrollableTableCell>
              <ScrollableTableCell>{item.email}</ScrollableTableCell>
              <ScrollableTableCell>
                <Button startIcon={<PasswordIcon />} onClick={() => handleReset(item.email)} sx={{ ml: 2 }} />
              </ScrollableTableCell>
              <ScrollableTableCell>
                <Button startIcon={<EditIcon />} onClick={() => onEdit(item)} sx={{ ml: 2 }} />
              </ScrollableTableCell>

              <ScrollableTableCell>
                <Button startIcon={<DeleteIcon />} sx={{ ml: 2 }} />
              </ScrollableTableCell>
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
        page={currentPage - 1}
        rowsPerPage={pageSize}
        rowsPerPageOptions={[pageSize]}
        sx={{ position: "absolute", bottom: 0, left: 0, right: 35 }}
      />
    </Card>
  );
};



export default UserTable;
