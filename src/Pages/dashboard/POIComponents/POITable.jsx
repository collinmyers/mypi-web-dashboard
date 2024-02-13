import React, { useState } from "react";
import "../../../styling/POITable.css";

const CustomTable = ({ data,allData, onEdit, onDelete, onCreate,fetchPreviousPage, fetchNextPage, currentPage, totalPages }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
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
    <div className="search-container">
    <input type="text" placeholder="Search by name..." value={searchTerm} onChange={handleSearchChange}/>
    </div>
    <div className="table-container">
    <div className="create-event-container">
    <button onClick={() => onCreate()} className="create-event-button">Create Event</button>
  </div>
    <table className="custom-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Latitude</th>
              <th>Longitude</th>
              <th>Status</th>
              <th>Type</th>
              <th>Edit</th>
              <th>Delete</th>
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

export default CustomTable;
