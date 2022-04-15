import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuthStatus from "../hooks/useAuthStatus";
import Spinner from "./Spinner";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuthStatus();
  const location = useLocation();
  console.log(location);

  if (loading) {
    return <Spinner />;
  }

  return user ? (
    children
  ) : (
    <Navigate to="/signin" state={{ from: location }} replace />
  );
};

export default ProtectedRoute;
