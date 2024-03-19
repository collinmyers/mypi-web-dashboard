import React, { useState, useEffect } from "react";

import Layout from "./Layout";
import { functions, GETUSERS_FUNCTION_ID } from "../../../utils/AppwriteConfig";

export default function Users() {
  const [users, setUsers] = useState("hi");


  const getUserInfo = async () => {
    try {
      const response = await functions.createExecution(
        GETUSERS_FUNCTION_ID,
        "",
        false,
        "/",
        "GET"
      );
      console.log(response.responseBody);
      setUsers(response);
    } catch (err) {
      console.error(err);
    }
  };



  useEffect(() => {

    getUserInfo();

  }, []);

  return (
    <div>
      <Layout>
        <div>
        </div>

      </Layout>
    </div>
  );
}
