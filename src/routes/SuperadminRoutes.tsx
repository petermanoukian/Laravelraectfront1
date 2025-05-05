import { Route } from "react-router-dom";
import SuperadminPage from "@/pages/superadmin";
import ProtectedRouteSuper from "@/components/ProtectedRouteSuper";
import ViewSuperAdminUsersPage from "@/pages/superadmin/ViewSuperAdminUsersPage";
import AddSuperAdminUserPage from "@/pages/superadmin/AddSuperAdminUserPage";
import EditSuperAdminUserPage from "@/pages/superadmin/EditSuperAdminUserPage";
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

  <Route
    key="view-superadmin-users"
    path="/superadmin/users"
    element={
      <ProtectedRouteSuper>
        <ViewSuperAdminUsersPage />
      </ProtectedRouteSuper>
    }
  />,
  <Route
    key="add-superadmin-user"
    path="/superadmin/users/add"
    element={
      <ProtectedRouteSuper>
        <AddSuperAdminUserPage />
      </ProtectedRouteSuper>
    }
  />,

  <Route
  key="edit-superadmin-user"
  path="/superadmin/users/edit/:userId"
  element={
    <ProtectedRouteSuper>
      <EditSuperAdminUserPage />
    </ProtectedRouteSuper>
  }
/>,



];

export default SuperadminRoutes;


