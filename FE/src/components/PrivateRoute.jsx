import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/" replace />;
  //Whatever you wrap inside <PrivateRoute> ... </PrivateRoute> gets passed in as children.
  //here is chidlren is Todospage
  return children;
};

export default PrivateRoute;
