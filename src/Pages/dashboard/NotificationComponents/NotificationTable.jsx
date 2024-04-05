import React, { useState } from "react";
import { Card, Table, TableBody, TableCell, TableHead, TableRow, TablePagination, TextField, Button, Box } from "@mui/material";
import { styled } from "@mui/system";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { Tooltip }  from "@mui/material";

const ScrollableTableCell = styled(TableCell)({
  minWidth: 127,
  maxWidth: 127,
  
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  backgroundColor: "#f5f5f5",
  textAlign: "center",
});


const NotificationTable = ({ allData, onEdit, onDelete, onCreate }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);

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
    item.Title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = (currentPage - 1) * pageSize;
  const currentPageData = filteredData.slice(startIndex, startIndex + pageSize);
  const emptyRows = pageSize - Math.min(pageSize, currentPageData.length);


  return (
    <Card sx={{ height: 580 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          minWidth: 800,
        }}
      >
        <TextField
          placeholder="Search by Name..."
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ flexGrow: 1, marginRight: "1rem", backgroundColor: "white" }}
        />
        <Tooltip title="Create Notification" placement="bottom">
          <Button
            onClick={() => onCreate()}
            startIcon={<AddIcon />}
            className="create-notification-button"
          ></Button>
        </Tooltip>
      </Box>
      <Table sx={{ minHeight: 400 }}>
        <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
          <TableRow>
            <ScrollableTableCell>Title</ScrollableTableCell>
            <ScrollableTableCell>Details</ScrollableTableCell>
            <ScrollableTableCell>AlertType</ScrollableTableCell>
            <ScrollableTableCell>NotificationType</ScrollableTableCell>
            <ScrollableTableCell>Edit</ScrollableTableCell>
            <ScrollableTableCell>Delete</ScrollableTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPageData.map((item) => (
            <TableRow key={item.$id}>
              <ScrollableTableCell>{item.Title}</ScrollableTableCell>
              <ScrollableTableCell>{item.Details}</ScrollableTableCell>
              <ScrollableTableCell>{item.AlertType}</ScrollableTableCell>
              <ScrollableTableCell>{item.NotificationType}</ScrollableTableCell>
              <ScrollableTableCell>
                <Button
                  sx={{ ml: 2 }}
                  onClick={() => onEdit(item)}
                  startIcon={<EditIcon />}
                ></Button>
              </ScrollableTableCell>
              <ScrollableTableCell>
                <Button
                  sx={{ ml: 2 }}
                  onClick={() => handleDeleteClick(item.$id)}
                  startIcon={<DeleteIcon />}
                ></Button>
              </ScrollableTableCell>
            </TableRow>
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 65 * emptyRows }}>
              <TableCell colSpan={6} />
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

export default NotificationTable;
