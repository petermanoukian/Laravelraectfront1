import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import axiosInstance from '../../lib/axios';

const UserStatus: React.FC = () => {
  const { user, setUser, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  // Only run this on mount if user is supposed to be logged in
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get('/user');
        setUser(res.data);
      } catch (err) {
        // Not authenticated, no need to set user
        console.warn('Not authenticated');
      }
    };

    if (!user && !loading) {
      fetchUser();
    }
  }, [user, loading, setUser]);

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/logout', {}, { withCredentials: true });
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
      <div className="mt-1 mb-2">
        <p className="mt-1 mb-2">Welcome, {user.name}!</p>
        <p className="mt-1 mb-4">Role: {user.role}</p>
        {user.role === 'superadmin' && (
          <Link to="/superadmin" className="py-2 px-4 bg-white border border-gray-200 text-gray-600 rounded hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 mr-4">
            Go to Superadmin Dashboard
          </Link>
        )}
        {user.role === 'admin' && (
          <Link to="/admin" className="py-2 px-4 bg-white border border-gray-200 text-gray-600 rounded hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 mr-4">
            Go to Admin Dashboard
          </Link>
        )}
        {user.role === 'user' && (
          <Link to="/user" className="py-2 px-4 bg-white border border-gray-200 text-gray-600 rounded hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 mr-4">
            Go to User Dashboard
          </Link>
        )}
        <div className="text-center py-5">
          <button onClick={handleLogout} className="bg-red-600 text-white py-2 px-4 rounded">
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <Link to="/login">
      <button className="py-1.5 px-4 bg-gray-50 hover:bg-gray-100">Login</button>
    </Link>
  );
};

export default UserStatus;
