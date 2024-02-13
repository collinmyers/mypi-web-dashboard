import React, { useState } from "react";
import "../../../styling/POITable.css";

const CustomTable = ({ data, onEdit, onDelete, fetchPreviousPage, fetchNextPage, currentPage, totalPages }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDeleteClick = ($id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete?");
    if (isConfirmed) {
      onDelete($id);
    }
  };

  const filteredData = data.filter((item) =>
    item.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Latitude</th>
              <th>Longitude</th>
              <th>Status</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.$id} className="table-row">
                <td>{item.Name}</td>
                <td>{item.Latitude}</td>
                <td>{item.Longitude}</td>
                <td>{item.Status}</td>
                <td>{item.Type}</td>
                <td>
                  <button onClick={() => onEdit(item.$id)} className="edit-button">Edit</button>
                  <button onClick={() => handleDeleteClick(item.$id)} className="delete-button">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <button onClick={fetchPreviousPage} disabled={currentPage === 1}>Previous</button>
        <span>{`Page ${currentPage} of ${totalPages}`}</span>
        <button onClick={fetchNextPage} disabled={currentPage === totalPages}>Next</button>
      </div>
    </div>
  );
};

export default CustomTable;
