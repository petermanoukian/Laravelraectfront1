//ViewSuperAdminUsersPage.tsx 
import React from 'react';
import { useNavigate , useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axiosInstance from '../../lib/axios';

import { useEffect, useState } from 'react';
import DashboardSuperAdminLayout from '../../layouts/DashboardSuperAdminLayout';
import { NavLink } from 'react-router-dom';
import Pagination from '../../components/Pagination';
import UserFilterControls from '../../components/superadmin/UserFilterControls';
import UserTableRow from '../../components/superadmin/UserTableRow';


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
  const [refreshKey, setRefreshKey] = useState(0);

  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get(`/superadmin/users`, {
          params: {
            page: pageFromQuery,
            per_page: perPage,
            role: roleFilter,
            search: debouncedSearchTerm,
            sort_by: sortField,
            sort_direction: sortDirection,
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
    setCurrentPage(pageFromQuery);
  }, [pageFromQuery, refreshKey, roleFilter, debouncedSearchTerm, sortField, sortDirection]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm.length >= 2 || searchTerm === '') {
        setDebouncedSearchTerm(searchTerm);
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSearchParams({ page: page.toString() });
  };

  const handleDelete = async (id: number) => {
    try {
      await axiosInstance.delete(`/superadmin/userdelete/${id}`, {
        withCredentials: true,
      });
      setUsers(users.filter((user) => user.id !== id));
      setDeleteConfirmation({ show: false, userId: null });
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error('Error deleting user:', error);
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


    <UserFilterControls
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortField={sortField}
        setSortField={setSortField}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
      />




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
            <UserTableRow
              key={userx.id}
              user={userx}
              currentUserId={user?.id}
              onDeleteConfirm={confirmDelete}
            />
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
