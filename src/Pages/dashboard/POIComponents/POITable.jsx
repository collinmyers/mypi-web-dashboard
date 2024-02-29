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
  minWidth: 105,
  maxWidth: 100,
  width: 230,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  backgroundColor: "#f5f5f5",
  textAlign: "center",
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

  const emptyRows = pageSize - Math.min(pageSize, currentPageData.length);

  return (
    <Card sx ={{height: 580 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", minWidth: 800 }}>
        <TextField
          placeholder="Search"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ mb: 2, ml:1,width: 350, height: 1, mt:1}}
        />
        <Button className="NewPOI" onClick={onCreate} startIcon={<AddIcon/>} sx={{ mb: 2, mr:3, textAlign: "center"}}>
          New
        </Button>
      </Box>
      <Table sx={{ minHeight: 400 }}>
        <TableHead textAlign= "center"  sx = {{backgroundColor: "#f5f5f5"}}>
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
              <ScrollableTableCell>
                <Button onClick={() => onEdit(item)} startIcon={<EditIcon/>} sx={{ display: "flex", justifyContent: "center" }} />
              </ScrollableTableCell>
              <ScrollableTableCell>
                <Button onClick={() => handleDeleteClick(item.$id)} startIcon={<DeleteIcon/>} sx={{ display: "flex", justifyContent: "center" }} />
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
        sx={{ position: "absolute", bottom: 0, left: 0, right: 35}}
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
