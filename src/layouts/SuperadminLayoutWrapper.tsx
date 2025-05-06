// SuperadminLayoutWrapper.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardSuperAdminLayout from '@/layouts/DashboardSuperAdminLayout';

const SuperadminLayoutWrapper = () => {
  return (
    <DashboardSuperAdminLayout>
      <Outlet />
    </DashboardSuperAdminLayout>
  );
};

export default SuperadminLayoutWrapper;
