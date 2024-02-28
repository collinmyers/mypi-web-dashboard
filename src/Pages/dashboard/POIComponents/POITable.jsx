import React, { useState } from "react";
import "../../../styling/POIStyling/POITable.css";
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

const ScrollableTableCell = styled(TableCell)({
  minWidth: 0,
  maxWidth: 200,
  width: 200,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxHeight: 100
});

const POITable = ({ allData, onEdit, onDelete, onCreate }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(6);

  const handleSearchChange = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleDeleteClick = ($id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete?");
    if (isConfirmed) {
      onDelete($id);
    }
  };

  const filteredData = allData.filter((item) =>
    item.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = (currentPage - 1) * pageSize;
  const currentPageData = filteredData.slice(startIndex, startIndex + pageSize);

  return (
    <Card>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", minWidth: 800 }}>
        <TextField
          label="Search by name..."
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ mb: 2 }}
        />
        <Button className="NewPOI" onClick={onCreate} startIcon={<AddIcon/>} sx={{ mb: 2, mr:3 }}>
          New
        </Button>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Latitude</TableCell>
            <TableCell>Longitude</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Edit</TableCell>
            <TableCell>Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPageData.map((item) => (
            <TableRow key={item.$id}>
              <ScrollableTableCell>{item.Name}</ScrollableTableCell>
              <ScrollableTableCell>{item.Latitude}</ScrollableTableCell>
              <ScrollableTableCell>{item.Longitude}</ScrollableTableCell>
              <ScrollableTableCell>{item.Status}</ScrollableTableCell>
              <ScrollableTableCell>{item.Type}</ScrollableTableCell>
              <TableCell>
                <Button onClick={() => onEdit(item)} startIcon={<EditIcon/>} >
               
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  onClick={() => handleDeleteClick(item.$id)}
                  startIcon= {<DeleteIcon/>}
                >
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <TablePagination
        component="div"
        count={filteredData.length}
        onPageChange={(event, page) => setCurrentPage(page + 1)}
        page={currentPage - 1}
        rowsPerPage={pageSize}
        rowsPerPageOptions={[pageSize]}
      />
    </Card>
  );
};

POITable.propTypes = {
  allData: PropTypes.array,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onCreate: PropTypes.func,
};

export default POITable;
