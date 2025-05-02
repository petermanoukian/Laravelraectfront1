import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import DashboardSuperAdminLayout from '../../layouts/DashboardSuperAdminLayout';

const AddSuperAdminUserPage = () => {
  return (
    <>
    <DashboardSuperAdminLayout>
     Add users
    </DashboardSuperAdminLayout>
    </>
  );
};

export default AddSuperAdminUserPage;
