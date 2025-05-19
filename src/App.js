import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserContext } from "./Context/UserContext";
import Navbar from "./Components/Navbar/index";
import PublicRoutes from "./Routes/PublicRoutes";
import UserRoutes from "./Routes/UserRoutes";
import RestaurantRoutes from "./Routes/RestaurantRoutes";

function App() {
  const [userData, setUserData] = useState(null);
  const [userToken, setUserToken] = useState(null);

  return (
    <UserContext.Provider value={{ userData, setUserData, userToken, setUserToken }}>
      <Router>
        <Routes>
          {PublicRoutes}
          {UserRoutes}
          {RestaurantRoutes}
        </Routes>
      </Router>
    </UserContext.Provider>
  );
}

export default App;


