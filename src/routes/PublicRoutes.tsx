// src/routes/PublicRoutes.tsx

import { Route } from 'react-router-dom';
import HomePage from '../pages/open/Homepage';
import Login from '../pages/open/Login';
import GuestLayout from '../layouts/GuestLayout';

const PublicRoutes = (
    <>
      {/* HomePage uses DefaultLayout manually */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />

    </>
  );
  
  export default PublicRoutes;

