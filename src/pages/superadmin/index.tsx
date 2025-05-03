// src/pages/superadmin/index.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axiosInstance from '../../lib/axios';
import DashboardSuperAdminLayout from '../../layouts/DashboardSuperAdminLayout';

const SuperadminPage = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/logout', {}, { withCredentials: true });
      localStorage.removeItem('authToken'); // Clear token from localStorage
      sessionStorage.removeItem('authToken'); // Clear token from sessionStorage
      setUser(null); // Clear user state
      navigate('/login'); // Redirect to login page
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (

    <>



<DashboardSuperAdminLayout>
      <h2 className="text-2xl font-semibold mb-4">Welcome, Superadmin!</h2>
      <p>This is your dashboard content. You can add stats, tables, or anything here.</p>
      <div className="mt-6">
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white py-2 px-4 rounded cursor"
        >
          Logout
        </button>
      </div>
    </DashboardSuperAdminLayout>
    </>




  );
};

export default SuperadminPage;
