import { Route } from "react-router-dom";
import MainLayout from "../Layouts/MainLayout";

import Home from "../Pages/Public/Home/index";
import Discover from "../Pages/Public/Discover/index";
import Search from "../Pages/Public/Search/index";
import RestaurantProfile from "../Pages/Public/RestaurantProfile/index";

import Login from "../Pages/Public/Auth/Login/index";
import Signup from "../Pages/Public/Auth/Signup/index";

import Forbidden from "../Pages/Safety/Forbidden";
import NotFound from "../Pages/Safety/NotFound";

import DinerOnlyRoute from "./DinerOnlyRoute";

export default [
  <Route path="/login" element={<Login />} />,
  <Route path="/signup" element={<Signup />} />,
  <Route
    path="/discover"
    element={
      <DinerOnlyRoute>
        <Discover />
      </DinerOnlyRoute>
    }
  />,
  <Route
    path="/search"
    element={
      <DinerOnlyRoute>
        <Search />
      </DinerOnlyRoute>
    }
  />,
  <Route
    path="/restaurant/:id"
    element={
      <DinerOnlyRoute>
        <RestaurantProfile />
      </DinerOnlyRoute>
    }
  />,
  <Route
    element={
      <DinerOnlyRoute>
        <MainLayout />
      </DinerOnlyRoute>
    }
    key="public-layout"
  >
    <Route path="/" element={<Home />} />
  </Route>,
  <Route path="/forbidden" element={<Forbidden />} />,
  <Route path="*" element={<NotFound />} />,
];
