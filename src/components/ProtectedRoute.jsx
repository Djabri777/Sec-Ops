

import React from "react";

import { Navigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";

const ROLE_PATHS = {
  admin: "/admin-dashboard",
  pentester: "/pentester-dashboard",
  client: "/client-dashboard",
};

const DEMO_EMAILS = ["client@gmail.com", "client2@gmail.com", "client3@gmail.com"];

const ProtectedRoute = ({ children, allowedRole }) => {

  const { currentUser, userRole, userProfile } = useAuth();

  if (!currentUser) {
    return <Navigate to="/signin" replace />;
  }

  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to={ROLE_PATHS[userRole] || "/"} replace />;
  }

  const isDemo = DEMO_EMAILS.includes(currentUser?.email);
  if (allowedRole === "client" && userProfile && !userProfile.subscriptionActive && !isDemo) {
    return <Navigate to="/pricing" replace />;
  }

  return children;
};

export default ProtectedRoute;
