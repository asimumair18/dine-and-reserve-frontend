import { Route } from "react-router-dom";
import RestaurantSettingsLayout from "../Layouts/RestaurantSettingsLayout";
import Dashboard from "../Pages/Restaurant/Dashboard";
import RestaurantDetails from "../Pages/Restaurant/RestaurantDetails";
import DietaryInfo from "../Pages/Restaurant/DietaryInfo";
import Timings from "../Pages/Restaurant/Timings";
import ProtectedRoute from "./ProtectedRoutes";

export default [
  <Route
    path="/restaurant/dashboard"
    element={
      <ProtectedRoute allowedRole="restaurant">
        <Dashboard />
      </ProtectedRoute>
    }
  />,
  <Route
    element={
      <ProtectedRoute allowedRole="restaurant">
        <RestaurantSettingsLayout />
      </ProtectedRoute>
    }
    key="restaurant-settings"
  >
    <Route path="/restaurant/settings/restaurant-details" element={<RestaurantDetails />} />
    <Route path="/restaurant/settings/dietary-info" element={<DietaryInfo />} />
    <Route path="/restaurant/settings/timings" element={<Timings />} />
  </Route>
];
