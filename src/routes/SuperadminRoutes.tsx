import { Route } from "react-router-dom";
import SuperadminPage from "@/pages/superadmin";
import ProtectedRouteSuper from "@/components/ProtectedRouteSuper";

const SuperadminRoutes = [
  <Route
    key="superadmin"
    path="/superadmin"
    element={
      <ProtectedRouteSuper>
        <SuperadminPage />
      </ProtectedRouteSuper>
    }
  />,
];

export default SuperadminRoutes;


