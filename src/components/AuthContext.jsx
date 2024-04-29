import React, { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { account } from "../utils/AppwriteConfig";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => { // Wrap dashboard with provider for auth state when changes occur
    const [isSignedIn, setIsSignedIn] = useState(false);

    const isUserSignedIn = async () => {
        try {
            await account.get().then((response) => {
                if (response.labels.includes("PrivilegedUser")) { // only allow privledged users to log in
                    setIsSignedIn(true);
                }
            }).catch(() => { // if they dont have correct permissions
                console.log("Not Authorized");
                setIsSignedIn(false);
            });
        } catch (error) {
            setIsSignedIn(false);
        }
    };

    useEffect(() => {
        isUserSignedIn();
    }, []);

    return (
        <AuthContext.Provider value={{ isSignedIn, setIsSignedIn }}>
            {children}
        </AuthContext.Provider>
    );
};
AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);