import { Route } from "react-router-dom";
import UserSettingsLayout from "../Layouts/UserSettingsLayout";
import AccountDetails from "../Pages/User/AccountDetails/index";
import Favorites from "../Pages/User/Favorites/index";
import Preferences from "../Pages/User/Preferences/index";
import ProtectedRoute from "./ProtectedRoutes";

export default [
  <Route
    element={<ProtectedRoute allowedRole="diner"><UserSettingsLayout /></ProtectedRoute>}
    key="user-settings"
  >
    <Route path="/user/settings/account-details" element={<AccountDetails />} />
    <Route path="/user/settings/preferences" element={<Preferences />} />
    <Route path="/user/settings/favorites" element={<Favorites />} />
  </Route>
];
