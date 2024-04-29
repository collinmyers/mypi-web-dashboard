import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import PropTypes from "prop-types";
import { account } from "../utils/AppwriteConfig";

const PrivateRoute = ({ allowedRoles }) => { // Private routes to ensure only allowed users can access protected pages
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isPermitted, setIsPermitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const isAuthenticated = async () => {
      try {
        await account
          .get()
          .then((userSession) => {
            setIsSignedIn(userSession);
            setIsPermitted(userSession.labels.includes(allowedRoles));
            setIsLoading(false);
          })
          .catch((error) => {
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

  return isSignedIn && isPermitted ? <Outlet /> : <Navigate to="/" />;
};

PrivateRoute.propTypes = {
  allowedRoles: PropTypes.string.isRequired,
};

export default PrivateRoute;
