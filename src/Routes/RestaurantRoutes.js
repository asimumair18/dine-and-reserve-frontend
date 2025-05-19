import { Route } from "react-router-dom";
import RestaurantSettingsLayout from "../Layouts/RestaurantSettingsLayout";
import Dashboard from "../Pages/Restaurant/Dashboard";
import RestaurantDetails from "../Pages/Restaurant/RestaurantDetails";
import DietaryInfo from "../Pages/Restaurant/DietaryInfo";
import Timings from "../Pages/Restaurant/Timings";

export default [
  <Route path="/restaurant/dashboard" element={<Dashboard />} />,
  <Route element={<RestaurantSettingsLayout />} key="restaurant-settings">
    <Route path="/restaurant/settings/restaurant-details" element={<RestaurantDetails />} />
    <Route path="/restaurant/settings/dietary-info" element={<DietaryInfo />} />
    <Route path="/restaurant/settings/timings" element={<Timings />} />
  </Route>
];
