import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./app";
import { AuthProvider } from "./components/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <App />
  </AuthProvider>

);
