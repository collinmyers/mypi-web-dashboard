import React, { useState, useEffect } from "react";

import Layout from "./Layout";
import { functions, GETUSERS_FUNCTION_ID } from "../../../utils/AppwriteConfig";
import UserTable from "../UserComponents/UserTable";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Users() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const getUserInfo = async () => {
    try {
      const response = await functions.createExecution(
        GETUSERS_FUNCTION_ID,
        "",
        false,
        "/",
        "GET"
      );
      const responseBody = JSON.parse(response.responseBody);
      setUsers(responseBody["filteredUsersList"]);
    } catch (err) {
      console.error(err);
    }
  };


  useEffect(() => {

    getUserInfo();

  }, []);

  const editUser = (item) => {
    navigate("/editUser", {
      state: {
        user: item,
      }
    });
  };

  return (
    <div>
      <Layout>
        <div>
          <ToastContainer/>

          <UserTable allData = {users} onEdit={editUser}/>


        </div>

      </Layout>
    </div>
  );
}
