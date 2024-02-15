import {React,useState} from "react";
import "../../../styling/EventsStyling/EventTableStyle.css";



const EventsTable = ({ data,deleteEvent,editEvent,createEvent}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);

  const handleSearchChange = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleDeleteClick = (item) => {
    const isConfirmed = window.confirm("Are you sure you want to delete?");
    if (isConfirmed) {
      deleteEvent(item);
    }
  };

  const filteredData = data.filter((item) =>
    item.Name.toLowerCase().includes(searchTerm.toLowerCase())
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
        <div className="create-event-container">
          <button onClick={() => createEvent()} className="create-event-button">Create Event</button>
        </div>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Latitude</th>
              <th>Longitude</th>
              <th>FileID</th>
              <th>DateTime</th>
              <th>Description</th>
              <th>Long Description</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {currentPageData.map((item) => (
              <tr key={item.$id} className="table-row">
                <td>{item.Name}</td>
                <td>{item.Latitude}</td>
                <td>{item.Longitude}</td>
                <td>{item.FileID}</td>
                <td>{item.DateTime}</td>
                <td>{item.EventListDescription}</td>
                <td>{item.EventDetailsDescription}</td>

                <td>
                  <button  className="edit-button" onClick={() => editEvent(item)}>Edit</button>
                </td>
                <td>
                  <button  className="delete-button" onClick={() => handleDeleteClick(item)}>Delete</button>
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

export default EventsTable;


