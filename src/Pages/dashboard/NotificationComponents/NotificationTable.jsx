import React, { useState } from "react";

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

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentPageData = filteredData.slice(startIndex, startIndex + pageSize);

  const fetchPreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const fetchNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  return (
    <div>
      <div className="search-container">
        <input type="text" placeholder="Search by name..." value={searchTerm} onChange={handleSearchChange} />
      </div>
      <div className="table-container">
        <div className="create-notification-container">
          <button onClick={() => onCreate()} className="create-notification-button">Create POI</button>
        </div>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Details</th>
              <th>AlertType</th>
              <th>NotificationType</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {currentPageData.map((item) => (
              <tr key={item.$id} className="table-row">
                <td>{item.Title}</td>
                <td>{item.Details}</td>
                <td>{item.AlertType}</td>
                <td>{item.NotificationType}</td>
                <td>
                  <button onClick={() => onEdit(item)} className="edit-button">Edit</button>
                </td>
                <td>
                  <button onClick={() => handleDeleteClick(item.$id)} className="delete-button">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <button onClick={fetchPreviousPage} disabled={currentPage === 1}>Previous</button>
        <span className="page">{`Page ${currentPage}`}</span>
        <button onClick={fetchNextPage} disabled={currentPage === totalPages}>Next</button>
      </div>
    </div>
  );
};

export default NotificationTable;