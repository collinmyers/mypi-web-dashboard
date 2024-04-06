import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import PropTypes from "prop-types"; // Import PropTypes
import { account } from "../utils/AppwriteConfig";

const PrivateRoute = ({ allowedRoles }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isPermittted, setIsPermitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const isAuthenticated = async () => {
      try {
        await account.get().then((userSession) => {
          setIsSignedIn(userSession);
          setIsPermitted(userSession.labels.includes(allowedRoles));
          setIsLoading(false);
        }).catch((error) => {
          throw new Error(error);
        });
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsLoading(false);
      }
    };

    isAuthenticated();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; 
  }

  return isSignedIn && isPermittted ? <Outlet /> : <Navigate to="/" />;
};

PrivateRoute.propTypes = {
  allowedRoles: PropTypes.string.isRequired,
};

export default PrivateRoute;