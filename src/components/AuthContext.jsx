// AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { account } from "../utils/AppwriteConfig";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isSignedIn, setIsSignedIn] = useState(false);

    const isUserSignedIn = async () => {
        try {
            await account.get().then((response) => {
                if (response.labels.includes("PrivilegedUser")) {
                    console.log("I have permission");
                    setIsSignedIn(true);
                }
            }).catch(() => { console.log("Not Authorized"); });
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




