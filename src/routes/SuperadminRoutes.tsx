// SuperadminRoutes.tsx
import { Route } from "react-router-dom";
import { Outlet } from "react-router-dom";
import SuperadminPage from "@/pages/superadmin";
import ProtectedRouteSuper from "@/components/ProtectedRouteSuper";
import SuperadminLayoutWrapper from "@/layouts/SuperadminLayoutWrapper";
import DashboardSuperAdminLayout from "@/layouts/DashboardSuperAdminLayout";
import ViewSuperAdminUsersPage from "@/pages/superadmin/ViewSuperAdminUsersPage";
import AddSuperAdminUserPage from "@/pages/superadmin/AddSuperAdminUserPage";
import EditSuperAdminUserPage from "@/pages/superadmin/EditSuperAdminUserPage";
import ViewSuperAdminCatsPage from "@/pages/superadmin/ViewSuperAdminCatsPage";
import AddSuperAdminCatPage from "@/pages/superadmin/AddSuperAdminCatPage"; 
import EditSuperAdminCatPage from "@/pages/superadmin/EditSuperAdminCatPage";
import ViewSuperAdminSubCatsPage from "@/pages/superadmin/ViewSuperAdminSubCatsPage";
import AddSuperAdminSubCatPage from "@/pages/superadmin/AddSuperAdminSubCatPage"; 
import EditSuperAdminSubCatPage from "@/pages/superadmin/EditSuperAdminSubCatPage"; 

const SuperadminRoutes = [
  <Route
    key="superadmin-layout"
    path="/superadmin"
    element={
      <ProtectedRouteSuper>
        <SuperadminLayoutWrapper />
      </ProtectedRouteSuper>
    }
  >
    <Route index element={<SuperadminPage />} />
    <Route path="users" element={<ViewSuperAdminUsersPage />} />
    <Route path="users/add" element={<AddSuperAdminUserPage />} />
    <Route path="users/edit/:userId" element={<EditSuperAdminUserPage />} />
    <Route path="cats" element={<ViewSuperAdminCatsPage />} />
    <Route path="cats/add" element={<AddSuperAdminCatPage />} />
    <Route path="cat/edit/:catid" element={<EditSuperAdminCatPage />} />



    <Route path="subcats/view">
        <Route index element={<ViewSuperAdminSubCatsPage />} />
        <Route path=":categoryid" element={<ViewSuperAdminSubCatsPage />} />
    </Route>

    <Route path="subcats/add">
        <Route index element={<AddSuperAdminSubCatPage />} />
        <Route path=":categoryid" element={<AddSuperAdminSubCatPage />} />
    </Route>

    <Route path="subcat/edit/:id" element={<EditSuperAdminSubCatPage />} />




  </Route>,
];
export default SuperadminRoutes;


