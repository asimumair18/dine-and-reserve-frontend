// src/Context/UserContext.js
import React, { createContext, useState } from "react";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [userToken, setUserToken] = useState(null);

  return (
    <UserContext.Provider value={{ userData, setUserData, userToken, setUserToken }}>
      {children}
    </UserContext.Provider>
  );
};