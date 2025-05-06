//ViewSuperAdminUsersPage.tsx 
import React from 'react';
import { useNavigate , useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axiosInstance from '../../lib/axios';
import { Link , NavLink} from 'react-router-dom';
import { useEffect, useState } from 'react';
import DashboardSuperAdminLayout from '../../layouts/DashboardSuperAdminLayout';

import Pagination from '../../components/Pagination';
import UserFilterControls from '../../components/superadmin/UserFilterControls';
import UserTableRow from '../../components/superadmin/UserTableRow';
import UserTableHeader from '../../components/superadmin/UserTableHeader';

type Role = {
  name: string;
};

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  img?: string | null;
  pdf?: string | null;
};




const ViewSuperAdminUsersPage = () => {

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, setUser, isAuthenticated } = useAuth();

  const [deleteConfirmation, setDeleteConfirmation] = useState<{ show: boolean; userIds: number[] }>({
    show: false,
    userIds: [],
  });
  

  const [searchParams, setSearchParams] = useSearchParams();

  const [currentPage, setCurrentPage] = useState<number>(1);

  const [totalPages, setTotalPages] = useState(1); // Total pages for pagination
  const perPage = 10;
  const [refreshKey, setRefreshKey] = useState(0);

  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  const currentUserId = user?.id;
  const currentUserRole = user?.role;

  // Toggle one checkbox
  const handleToggleSelect = (userId: number) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };
  
  // Delete selected
  /*
  const handleDeleteSelected = () => {
    if (selectedUsers.length === 0) return;
  
    fetch('/api/users/bulk-delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userIds: selectedUsers }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to delete');
        return res.json();
      })
      .then(() => {
        // Refresh user list or update local state
        setSelectedUsers([]);
        setRefreshKey((prev) => prev + 1);

      })
      .catch((err) => {
        console.error('Error:', err);
      });
  };
  */
  const handleSelectAll = () => {
    const selectableIds = users
      .filter((u) => currentUserRole === 'superadmin' && currentUserId !== u.id)
      .map((u) => u.id);
  
    const allSelected = selectableIds.every((id) => selectedUsers.includes(id));
  
    if (allSelected) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(selectableIds);
    }
  };
  


  useEffect(() => {
    const pageParam = searchParams.get('page');
    const parsedPage = pageParam ? parseInt(pageParam, 10) : 1;
  
    // Only update if parsed page is valid and different from current state
    if (!isNaN(parsedPage) && parsedPage !== currentPage) {
      setCurrentPage(parsedPage);
    }
  }, [searchParams]); // make sure currentPage is in deps
  

  useEffect(() => {
    setCurrentPage(1);
    setSearchParams({ page: '1' });
  }, [roleFilter, debouncedSearchTerm]);
  
  



  useEffect(() => {
    console.log('🔥 fetchUsers useEffect triggered');
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get(`/superadmin/users`, {
          params: {
            page: currentPage,
            per_page: perPage,
            role: roleFilter,
            search: debouncedSearchTerm,
            sortField: sortField,
            sortDirection: sortDirection,
          },
          withCredentials: true,
        });

        setUsers(res.data.users.data);
        console.log("Users list:", users);
        setTotalPages(res.data.users.last_page);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };
  
   
      fetchUsers();
    
  }, [currentPage, refreshKey, roleFilter, debouncedSearchTerm, sortField, sortDirection]);
  

  
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm.length >= 2 || searchTerm === '') {
        setDebouncedSearchTerm(searchTerm);
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const handlePageChange = (page: number) => {
    if (page !== currentPage) {
      setCurrentPage(page);
      setSearchParams({ page: page.toString() });
    }
  };
  

  const handleDelete = async (ids: number[]) => {

    try {
      if (ids.length === 1) {
        await axiosInstance.delete(`/superadmin/userdelete/${ids[0]}`, {
          withCredentials: true,
        });
      }
      else {

        
        await axiosInstance.delete('/superadmin/users/deleteall', {
          data: { user_ids: ids },
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }
    
      // Remove deleted users from UI
      setUsers((prev) => prev.filter((u) => !ids.includes(u.id)));
      setSelectedUsers((prev) => prev.filter((id) => !ids.includes(id)));
    
      setDeleteConfirmation({ show: false, userIds: [] });
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error('Error deleting user(s):', error);
    }
    

  };

  const confirmDelete = (userOrUsers: number | number[]) => {
    const userIds = Array.isArray(userOrUsers) ? userOrUsers : [userOrUsers];
    setDeleteConfirmation({ show: true, userIds });
  };
  

  const cancelDelete = () => {
    setDeleteConfirmation({ show: false, userIds: [] });
  };
  



  if (loading) return (
  <>

  <div>..... Loading All Users...</div>


    </>
  )

  return (

    <>
  
     
    <div className="w-full p-3 bg-gray-100 mb-4">
    <p className = "mt-3 block"> Welcome {user?.name} {user?.id}  {user?.role} </p>
    <p className = "mt-3 block text-sm">
    <NavLink to="/superadmin/users/add" className="text-blue-500 hover:underline font-bold text-sm">
        &rsaquo; Add New User
    </NavLink> 
    </p>
    </div>

    <UserFilterControls
      roleFilter={roleFilter}
      setRoleFilter={setRoleFilter}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
    />




    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">All Users</h2>

      {selectedUsers.length > 0 && (
        <>
        <div className = 'flex items-center justify-center px-2 '>
        <button
          onClick={() => confirmDelete(selectedUsers)}
          className="mb-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Delete Selected ({selectedUsers.length})
        </button>
        </div>
        
        </>
      )}

    {users.length > 0 ?  (

      <>
        <table className="min-w-full border">



        <UserTableHeader
          sortField={sortField}
          sortDirection={sortDirection}
          setSortField={setSortField}
          setSortDirection={setSortDirection}
          allSelected={
            users
              .filter((u) => currentUserRole === 'superadmin' && currentUserId !== u.id)
              .every((u) => selectedUsers.includes(u.id))
          }
          onToggleSelectAll={handleSelectAll}
        />


          <tbody>
            {users.map((userx: User) => (
              <UserTableRow
                key={userx.id}
                user={userx}
                currentUserId={user?.id}
                currentUserRole={user?.role}
                onDeleteConfirm={confirmDelete}
                isSelected={selectedUsers.includes(userx.id)}
                onToggleSelect={handleToggleSelect}
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

        </>

) : (
  <p>No users available or an error occurred.</p>
)}

      {selectedUsers.length > 0 && (
        <>
        <div className = 'flex items-center justify-center px-5 py-5'>
        <button
          onClick={() => confirmDelete(selectedUsers)}
          className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Delete Selected ({selectedUsers.length})
        </button>
        </div>
        
        </>

      )}



      {deleteConfirmation.show && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-bold mb-4">Are you sure you want to delete this user?</h3>
              <div className="flex justify-end space-x-4">
                <button onClick={cancelDelete} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
                <button
                  onClick={() => handleDelete(deleteConfirmation.userIds)}

                  className="bg-red-600 text-white px-4 py-2 rounded"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}




    </div>


    </>

  );
};

export default ViewSuperAdminUsersPage;
