// src/components/superadmin/UserStatus.tsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import { NavLink } from 'react-router-dom';

const UserStatus: React.FC = () => {
  const { user, setUser, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8000/api/logout', {}, { withCredentials: true });
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) return <p>Loading...</p>;

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center justify-end space-x-4 text-sm text-gray-700">
        <div>
          <p className="font-semibold">{user.name}</p>
          <p className="text-1xl text-gray-500">{user.role}</p>
        </div>
        <Link
          to={`/superadmin/edit/${user.id}`}
          className="text-blue-600 hover:underline text-md"
        >
          Edit Profile
        </Link>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    );
  }

  return null;
};

export default UserStatus;
