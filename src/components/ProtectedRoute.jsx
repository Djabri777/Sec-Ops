

import React from "react";

import { Navigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

const ROLE_PATHS = {
  admin: "/admin-dashboard",        
  pentester: "/pentester-dashboard", 
  client: "/client-dashboard",      
};

const ProtectedRoute = ({ children, allowedRole }) => {
  
  const { currentUser, userRole } = useAuth();

  if (!currentUser) {

    return <Navigate to="/signin" replace />;
  }

  if (allowedRole && userRole !== allowedRole) {

    return <Navigate to={ROLE_PATHS[userRole] || "/"} replace />;
  }

  return children;
};

export default ProtectedRoute;
