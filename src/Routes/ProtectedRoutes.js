// // src/routes/DinerOnlyRoute.js
// import React, { useContext } from "react";
// import { Navigate, useLocation } from "react-router-dom";
// import { UserContext } from "../Context/UserContext";

// const DinerOnlyRoute = ({ children }) => {
//   const { userData } = useContext(UserContext);
//   const location = useLocation();
  
//   // Allow public access to restaurant profiles
//   if (location.pathname.startsWith("/restaurant/")) {
//     return children;
//   }
  
//   // Block restaurant owners from other diner-only pages
//   if (userData?.role === "restaurant") {
//     return <Navigate to="/forbidden" />;
//   }
  
//   return children;
// };

// export default DinerOnlyRoute;

import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../Context/UserContext";

const ProtectedRoute = ({ children, allowedRole }) => {
  const { userData } = useContext(UserContext);

  if (!userData) {
    return <Navigate to="/login" />;
  }

  if (allowedRole && userData.role !== allowedRole) {
    return <Navigate to="/forbidden" />;
  }

  return children;
};

export default ProtectedRoute;