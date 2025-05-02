//ViewSuperAdminUsersPage.tsx 
import React from 'react';
import { useNavigate , useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

import { useEffect, useState } from 'react';
import DashboardSuperAdminLayout from '../../layouts/DashboardSuperAdminLayout';
import { NavLink } from 'react-router-dom';
import Pagination from '../../components/Pagination';

type Role = {
  name: string;
};

type User = {
  id: number;
  name: string;
  email: string;
  roles: Role[];
};




const ViewSuperAdminUsersPage = () => {

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, setUser, isAuthenticated } = useAuth();

  const [deleteConfirmation, setDeleteConfirmation] = useState<{ show: boolean; userId: number | null }>({
    show: false,
    userId: null,
  });


  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromQuery = parseInt(searchParams.get('page') || '1', 10);
  const [currentPage, setCurrentPage] = useState<number>(pageFromQuery);
  const [totalPages, setTotalPages] = useState(1); // Total pages for pagination
  const perPage = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/superadmin/users`, {
          params: {
            page: pageFromQuery,
            per_page: perPage,
          },
          withCredentials: true,
        });
        setUsers(res.data.users.data);
        setTotalPages(res.data.users.last_page);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUsers();
    setCurrentPage(pageFromQuery); // Keep internal state in sync
  }, [pageFromQuery]);
  

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSearchParams({ page: page.toString() }); // Sync with URL
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8000/api/superadmin/userdelete/${id}`, {
        withCredentials: true,
      });
      setUsers(users.filter((user) => user.id !== id)); // Remove deleted user from the list
      setDeleteConfirmation({ show: false, userId: null }); // Close the confirmation dialog
    } catch (error) {
      console.error('Error deleting user:', error);
      // You could also display an error message to the user here
    }
  };

  const confirmDelete = (userId: number) => {
    setDeleteConfirmation({ show: true, userId });
  };

  const cancelDelete = () => {
    setDeleteConfirmation({ show: false, userId: null });
  };




  if (loading) return (
  <>
  <DashboardSuperAdminLayout>
  <div>..... Loading All Users...</div>
  </DashboardSuperAdminLayout>

    </>
  )

  return (

    <>
    <DashboardSuperAdminLayout>
     
    <p> Welcome {user.name} {user.id}  {user.role} </p>
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">All Users</h2>
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2 text-left">ID</th>
            <th className="border px-4 py-2 text-left">Name</th>
            <th className="border px-4 py-2 text-left">Email</th>
            <th className="border px-4 py-2 text-left">Role</th>
            <th className="border px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((userx: User) => (
            <tr key={userx.id} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{userx.id}</td>
              <td className="border px-4 py-2">{userx.name}</td>
              <td className="border px-4 py-2">{userx.email}</td>
              <td className="border px-4 py-2">{userx.roles[0]?.name || 'N/A'}</td>
              <td className="border px-4 py-2 space-x-2">
                <NavLink to={`/superadmin/users/${userx.id}/edit`}
                className="cursor bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 
                
                rounded text-sm">
                  Edit
                </NavLink>
                {userx.id !== user?.id && (
                      <button
                      onClick={() => confirmDelete(userx.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        section="superadmin"
      />

      {deleteConfirmation.show && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-bold mb-4">Are you sure you want to delete this user?</h3>
              <div className="flex justify-end space-x-4">
                <button onClick={cancelDelete} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
                <button
                  onClick={() => handleDelete(deleteConfirmation.userId!)}
                  className="bg-red-600 text-white px-4 py-2 rounded"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}




    </div>


    </DashboardSuperAdminLayout>
    </>

  );
};

export default ViewSuperAdminUsersPage;
