import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { account } from "../utils/AppwriteConfig";

const PrivateRoute = ({ allowedRoles }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isPermittted, setIsPermitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const isAuthenticated = async () => {
      try {
        const userSession = await account.get();
        setIsSignedIn(userSession);
        setIsPermitted(userSession.labels.includes(allowedRoles));
        setIsLoading(false);
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsLoading(false);
      }
    };

    isAuthenticated();
  }, []);

  if (isLoading) {
    console.log(isPermittted);
    return null;
  }

  return isSignedIn && isPermittted ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;