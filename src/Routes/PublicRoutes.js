import { Route } from "react-router-dom";

// Layouts
import MainLayout from "../Layouts/MainLayout";

// Public Pages
import Home from "../Pages/Public/Home/index";
import Discover from "../Pages/Public/Discover/index";
import Search from "../Pages/Public/Search/index";
import RestaurantProfile from "../Pages/Public/RestaurantProfile/index";

// Auth Pages
import Login from "../Pages/Public/Auth/Login/index";
import Signup from "../Pages/Public/Auth/Signup/index";
import ForgotPassword from "../Pages/Public/Auth/ForgotPassword/index";
import ResetPassword from "../Pages/Public/Auth/ResetPassword/index";

export default [
    <Route path="/login" element={<Login />} />,
    <Route path="/signup" element={<Signup />} />,
    <Route path="/forgot-password" element={<ForgotPassword />} />,
    <Route path="/reset-password/:uuid" element={<ResetPassword />} />,
    <Route path="/discover" element={<Discover />} />,
    <Route path="/search" element={<Search />} />,
    <Route path="/restaurant/:id" element={<RestaurantProfile />} />,

  // Public pages under MainLayout
  <Route element={<MainLayout />} key="public-layout">
    <Route path="/" element={<Home />} />
  </Route>
];
