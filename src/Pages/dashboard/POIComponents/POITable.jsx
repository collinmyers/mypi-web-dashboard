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

const POITable = ({ allData, onEdit, onDelete, onCreate }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0); // Zero-based indexing
  const [pageSize, setPageSize] = useState(6); // Allow dynamic changes if needed

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

  const emptyRows = pageSize - currentPageData.length;

  return (
    <Card sx={{ height: "100%", minHeight: "580px", overflow: "hidden" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem",
        }}
      >
        <TextField
          placeholder="Search by name..."
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ flexGrow: 1, marginRight: "1rem" }}
        />
        <Button onClick={onCreate} startIcon={<AddIcon />} />
      </Box>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            {[
              "Name",
              "Latitude",
              "Longitude",
              "Status",
              "Type",
              "Edit",
              "Delete",
            ].map((head) => (
              <TableCell
                key={head}
                sx={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  textAlign: "center",
                  backgroundColor: "#f5f5f5",
                }}
              >
                {head}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPageData.map((item) => (
            <TableRow key={item.$id}>
              <TableCell>{item.Name}</TableCell>
              <TableCell>{item.Latitude}</TableCell>
              <TableCell>{item.Longitude}</TableCell>
              <TableCell>{item.Status}</TableCell>
              <TableCell>{item.Type}</TableCell>
              <TableCell>
                <Button onClick={() => onEdit(item)} startIcon={<EditIcon />} />
              </TableCell>
              <TableCell>
                <Button
                  onClick={() => handleDeleteClick(item.$id)}
                  startIcon={<DeleteIcon />}
                />
              </TableCell>
            </TableRow>
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={7} />
            </TableRow>
          )}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={filteredData.length}
        onPageChange={(event, newPage) => setCurrentPage(newPage)}
        page={currentPage}
        rowsPerPage={pageSize}
        rowsPerPageOptions={[6, 12, 24]}
        onRowsPerPageChange={(event) => {
          setPageSize(parseInt(event.target.value, 10));
          setCurrentPage(0); // Reset to first page after page size change
        }}
        sx={{ ".MuiTablePagination-toolbar": { flexWrap: "wrap" } }}
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
