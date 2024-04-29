import React, { useState, useEffect } from "react";

import Layout from "./Layout";
import { DELETE_USER_FUNCTION_ID, functions, GETUSERS_FUNCTION_ID } from "../../../utils/AppwriteConfig";
import UserTable from "../UserComponents/UserTable";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { account } from "../../../utils/AppwriteConfig";
import { toast } from "react-toastify";
import { ACCOUNT_RECOVERY_DOMAIN } from "../../../utils/AppwriteConfig";
import { ContactsOutlined } from "@mui/icons-material";


export default function Users() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
      let responseBody = JSON.parse(response.responseBody);
        responseBody = [responseBody];
        const responseBodyArray = responseBody[0].allUsers;
        const authUsers = responseBodyArray.filter(user => user.email !== "");
        console.log(authUsers);

        const filteredUsers = authUsers.map(user => ({
          $id: user.$id,
          name: user.name,
          email: user.email,
          labels: user.labels
        }));
      
      setUsers(filteredUsers);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const SuccessfulDeletion = () => {
    toast.success("User Deleted", {
      position: toast.POSITION.TOP_CENTER,
    });
  };

  const DeletionFailed = () => {
    toast.error("Failed to Delete User", {
      position: toast.POSITION.TOP_CENTER,
    });
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  const editUser = (item) => {
    navigate("/edit-user", {
      state: {
        user: item,
      }
    });
  };

  const SuccessfulReset = () => {
    toast.success("Recovery Email Sent", {
      position: toast.POSITION.TOP_CENTER,
    });
  };
  const FailedReset = () => {
    toast.success("Recovery Email Sent", {
      position: toast.POSITION.TOP_CENTER,
    });
  };


  const handlePasswordReset = async (email) => {
    try {

      await account.createRecovery(email, ACCOUNT_RECOVERY_DOMAIN);
      SuccessfulReset();


    } catch (error) {
      FailedReset();
      console.error(error);
    }
  };

  const deleteUser = async (user) => {
    try {

      await functions.createExecution(
        DELETE_USER_FUNCTION_ID,
        "",
        false,
        "/",
        "POST",
        {"target-user": user},
      );

      SuccessfulDeletion();
      getUserInfo();
    } catch (error) {
      console.error("Error deleting document:", error);
      DeletionFailed();
    }
  };


  return (
    <div>
      <Layout>
        <div>
          <ToastContainer />
          {isLoading ? <div>Loading...</div> : <UserTable allData={users} passwordReset={handlePasswordReset} onEdit={editUser} onDelete={deleteUser} />}
        </div>
      </Layout>
    </div>
  );
}
