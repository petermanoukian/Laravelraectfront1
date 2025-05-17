//Approutes.tsx
//import { Routes, Route } from "react-router-dom";
import { Routes } from "react-router-dom";
import PublicRoutes from './PublicRoutes';

import SuperadminRoutes from './SuperadminRoutes';
//import ProtectedRouteSuper from "@/components/ProtectedRouteSuper";



const AppRoutes = () => {
  return (
    <Routes>
      {PublicRoutes}

      {/* Superadmin route */}
      {SuperadminRoutes}

      {/* Add other routes here */}
    </Routes>
  );
};

export default AppRoutes;

