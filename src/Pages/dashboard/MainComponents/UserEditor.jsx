import React, { useState, useEffect } from "react";

import Layout from "./Layout";
import { functions, GETUSERS_FUNCTION_ID } from "../../../utils/AppwriteConfig";
import UserTable from "../UserComponents/UserTable";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { account } from "../../../utils/AppwriteConfig";
import { toast } from "react-toastify";
import { ACCOUNT_RECOVERY_DOMAIN } from "../../../utils/AppwriteConfig";


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
      setUsers(responseBody["userInfo"]);
    } catch (err) {
      console.error(err);
    }
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


  return (
    <div>
      <Layout>
        <div>
          <ToastContainer />

          <UserTable allData={users} passwordReset={handlePasswordReset} onEdit={editUser} />


        </div>

      </Layout>
    </div>
  );
}
