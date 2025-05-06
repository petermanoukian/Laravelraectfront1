// src/components/superadmin/UserStatus.tsx

import React from 'react';

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import axiosInstance from '../../lib/axios';
import { NavLink } from 'react-router-dom';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'


const UserStatus: React.FC = () => {
  const { user, setUser, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();


  

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


      <>
      <div className="flex items-center justify-end space-x-4 text-sm text-gray-700">


        <Menu as="div" className="relative inline-block text-left w-44">
        <MenuButton
        className="inline-flex w-full items-center justify-between rounded-md bg-white px-4 py-2 text-sm font-medium
        text-gray-700 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          My account
          <ChevronDownIcon className="ml-2 h-4 w-4 text-gray-500" aria-hidden="true" />

          </MenuButton>
              <MenuItems anchor="bottom"
              className="absolute right-0 z-20 mt-2 w-44 origin-top-right rounded-md px-3
              bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              >

              <div className="py-1"> 

              <MenuItem>
              {({ active }) => (
                <Link
                  to={`/superadmin/users/edit/${user.id}`}
                  className={`block w-full px-3 py-2 text-sm ${
                    active ? 'bg-indigo-100 text-indigo-900' : 'text-blue-600'
                  }`}
                >
              Edit Profile
            </Link>
          )}
        </MenuItem>

        <MenuItem>
          {({ active }) => (
            <button
              onClick={(e) => {
                e.preventDefault(); 
                handleLogout();
              }}
              className="bg-red-600 text-white px-3 py-1 rounded text-md hover:bg-red-700 cursor mt-1"
            >
              Logout
            </button>
          )}
        </MenuItem>



          </div>
        </MenuItems>
      </Menu>
 
      <div className="flex items-center space-x-4">
     
        {user.img && (
          <>
      
            <img
              src={`${import.meta.env.VITE_API_PUBLIC_URL}${user.img}`}
              alt="User"
              className="w-10 h-10 rounded-full object-cover"
            />
            </>
          )}
          <div className="flex flex-col">
            <p className="font-semibold"> {user.name}</p>
            <p className="text-1xl text-gray-500">{user.role}</p> 
          </div>

        </div>
 
      </div>


      </>
    );
  }

  return null;
};

export default UserStatus;
