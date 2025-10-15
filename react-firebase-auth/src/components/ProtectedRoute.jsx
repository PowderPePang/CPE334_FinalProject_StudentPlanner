import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";

const ProtectedRoute = ({ children }) => {
    const { user } = useUserAuth();
    const location = useLocation();
    console.log("Current user:", user);

    if (!user) {
        // Redirect to unauthorized page with the attempted URL
        return <Navigate to="/unauthorized" state={{ from: location.pathname }} replace />;
    }
    return children;
};

export default ProtectedRoute;