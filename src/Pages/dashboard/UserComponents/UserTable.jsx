import React, { useState, useMemo, useCallback } from "react";
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
  styled,
} from "@mui/material";
import "../../../styling/TableStyling.css";

const STableCell = styled(TableCell)({
  padding: ".7rem",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
});

const UserTable = ({ allData, passwordReset, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(
    parseInt(sessionStorage.getItem("currentPage") || 0)
  );
  const [pageSize] = useState(6);

  const handleSearchChange = useCallback((event) => {
    setSearchTerm(event.target.value.toLowerCase());
    setCurrentPage(0); // Reset to first page when searching
    sessionStorage.setItem("currentPage", "0"); // Reset page in session storage
  }, []);

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
    sessionStorage.setItem("currentPage", newPage.toString()); // Save the current page to sessionStorage
  };

  const handleDeleteClick = useCallback(
    ($id) => {
      const isConfirmed = window.confirm("Are you sure you want to delete?");
      if (isConfirmed) {
        onDelete($id);
      }
    },
    [onDelete]
  );

  const handleReset = useCallback(
    (email) => {
      const isConfirmed = window.confirm(
        "Are you sure you want to send password reset to your email?"
      );
      if (isConfirmed) {
        passwordReset(email);
      }
    },
    [passwordReset]
  );

  const filteredData = useMemo(
    () =>
      allData.filter((item) => item.name.toLowerCase().includes(searchTerm)),
    [allData, searchTerm]
  );

  const currentPageData = useMemo(() => {
    const startIndex = currentPage * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const emptyRows = useMemo(
    () => pageSize - Math.min(pageSize, currentPageData.length),
    [pageSize, currentPageData.length]
  );

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
                <STableCell key={header}>{header}</STableCell>
              )
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPageData.map((item) => (
            <TableRow className="row" key={item.$id}>
              {[item.name, item.email].map((value, index) => (
                <STableCell key={index}>{value}</STableCell>
              ))}
              <TableCell sx={{ padding: "0.7rem" }}>
                <Button
                  onClick={() => handleReset(item.email)}
                  startIcon={<PasswordIcon />}
                />
              </TableCell>
              <TableCell sx={{ padding: "0.7rem" }}>
                <Button onClick={() => onEdit(item)} startIcon={<EditIcon />} />
              </TableCell>
              <TableCell sx={{ padding: "0.7rem" }}>
                <Button
                  onClick={() => handleDeleteClick(item.$id)}
                  startIcon={<DeleteIcon />}
                />
              </TableCell>
            </TableRow>
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 55 * emptyRows }}>
              <TableCell colSpan={7} />
            </TableRow>
          )}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={filteredData.length}
        onPageChange={handlePageChange}
        page={currentPage}
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
