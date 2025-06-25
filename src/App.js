import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes } from "react-router-dom";
import { UserContext } from "./Context/UserContext";
import PublicRoutes from "./Routes/PublicRoutes";
import UserRoutes from "./Routes/UserRoutes";
import RestaurantRoutes from "./Routes/RestaurantRoutes";
import { ConfigProvider } from "antd";
import { message } from "antd";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [userData, setUserData] = useState(null);
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    message.success("Test: Ant Design messages are working!");
  }, []);

  return (
    <ConfigProvider> {/* ✅ Wrap everything */}
      <UserContext.Provider value={{ userData, setUserData, userToken, setUserToken }}>
        <Router>
          <ToastContainer position="top-right" autoClose={3000} />
          <Routes>
            {PublicRoutes}
            {UserRoutes}
            {RestaurantRoutes}
          </Routes>
        </Router>
      </UserContext.Provider>
    </ConfigProvider>
  );
}

export default App;