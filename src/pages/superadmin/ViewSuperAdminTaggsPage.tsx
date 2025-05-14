//ViewSuperAdminTaggsPage.tsx
import React from 'react'
import { useNavigate , useSearchParams  } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axiosInstance from '../../lib/axios';
import { Link , NavLink} from 'react-router-dom';
import { useEffect, useState } from 'react';
import TaggTableHeader from '../../components/superadmin/TaggTableHeader';
import TaggTableRow from '../../components/superadmin/TaggTableRow';
import TaggFilterControls from '../../components/superadmin/TaggFilterControls';
import Pagination from '../../components/Pagination';
import { useLocation } from 'react-router-dom';

type Tagg = {
  id: number;
  name: string;

};

const ViewSuperAdminTaggsPage = () => {

  const [taggs, setTaggs] = useState<Tagg[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, setUser, isAuthenticated } = useAuth();
  const location = useLocation();

  const [deleteConfirmation, setDeleteConfirmation] = useState<{ show: boolean; taggIds: number[] }>({
    show: false,
    taggIds: [],
  }); 

    const [currentPage, setCurrentPage] = useState<number>(1);
  
    const [totalPages, setTotalPages] = useState(1); // Total pages for pagination
    const perPage = 10;
    const [refreshKey, setRefreshKey] = useState(0);
    const [selectedTaggs, setSelectedTaggs] = useState<number[]>([]);
    const currentUserRole = user?.role;

    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [sortField, setSortField] = useState('id');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [searchParams, setSearchParams] = useSearchParams();

    const handleToggleSelect = (taggId: number) => {
      setSelectedTaggs((prevSelected) =>
        prevSelected.includes(taggId)
          ? prevSelected.filter((id) => id !== taggId)
          : [...prevSelected, taggId]
      );
    };


    const handleSelectAll = () => {
      const selectableIds = taggs
        .filter((u) => currentUserRole === 'superadmin' )
        .map((u) => u.id);
    
      const allSelected = selectableIds.every((id) => selectedTaggs.includes(id));
    
      if (allSelected) {
        setSelectedTaggs([]);
      } else {
        setSelectedTaggs(selectableIds);
      }
    };
    
  useEffect(() => {
    const pageParam = searchParams.get('page');
    const parsedPage = pageParam ? parseInt(pageParam, 10) : 1;
  
    // Only update if parsed page is valid and different from current state
    if (!isNaN(parsedPage) && parsedPage !== currentPage) {
      setCurrentPage(parsedPage);
    }
  }, [currentPage, searchParams]); // make sure currentPage is in deps
  

  useEffect(() => {
    setCurrentPage(1);
    setSearchParams({ page: '1' });
  }, [debouncedSearchTerm, setSearchParams]);
  


    useEffect(() => {
    
      const fetchTaggs = async () => {
        try {
          const response = await axiosInstance.get('/superadmin/taggs/view', {
            params: {
              page: currentPage,
              perPage: perPage,
              search: debouncedSearchTerm,
              sortField: sortField,
              sortDirection: sortDirection,
            },
          });
          
          setTaggs(response.data.taggs.data);
          setTotalPages(response.data.taggs.last_page);
          console.log('Total pages:', response.data.totalPages);
          setLoading(false);
       
        } catch (error) {
          console.error('Error fetching records:', error);
        }
      };
    
      fetchTaggs();
    }, [currentPage, refreshKey , debouncedSearchTerm, sortField, sortDirection ]);

    useEffect(() => {
      if (location.state?.refresh) {
        console.log('Reloading ...');
        setSearchTerm(''); // Reset search term
      }
    }, [location.state?.refresh]); // Will only run when location.state.refresh changes


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
          await axiosInstance.delete(`/superadmin/tagg/delete/${ids[0]}`, {
            withCredentials: true,
          });
        }
        else {
  
          
          await axiosInstance.delete('/superadmin/taggs/deleteall', {
            data: { ids: ids },
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
            },
          });
        }
      
        // Remove deleted users from UI
        setTaggs((prev) => prev.filter((u) => !ids.includes(u.id)));
        setSelectedTaggs((prev) => prev.filter((id) => !ids.includes(id)));
      
        setDeleteConfirmation({ show: false, taggIds: [] });
        setRefreshKey((prev) => prev + 1);
      } catch (error) {
        console.error('Error deleting user(s):', error);
      }
    };

    const confirmDelete = (taggOrTaggs: number | number[]) => {
      const taggIds = Array.isArray(taggOrTaggs) ? taggOrTaggs : [taggOrTaggs];
      setDeleteConfirmation({ show: true, taggIds });
    };


    const cancelDelete = () => {
      setDeleteConfirmation({ show: false, taggIds: [] });
    };


    

    if (loading) return (
      <>
    
      <div>..... Loading ...</div>
    
    
        </>
      )
    return (
    <>
  
     
      <div className="w-full p-3 bg-gray-100 mb-4">
        <p className = "mt-3 block text-sm">
        <NavLink to="/superadmin/tagg/add" className="text-blue-500 hover:underline font-bold text-sm">
            &rsaquo; Add New Tag
        </NavLink> 
        </p>
      </div>


      <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Tags</h2>

      <TaggFilterControls

      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
    />



      {selectedTaggs.length > 0 && (
        <>
        <div className = 'flex items-center justify-center px-2 '>
        <button
          onClick={() => confirmDelete(selectedTaggs)}
          className="mb-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Delete Selected ({selectedTaggs.length})
        </button>
        </div>
        
        </>
      )}

    {taggs.length > 0 ?  (
      <>

      <table className="min-w-full border">

        <TaggTableHeader

          sortField={sortField}
          sortDirection={sortDirection}
          setSortField={setSortField}
          setSortDirection={setSortDirection}
          allSelected={
            taggs
              .filter((u) => currentUserRole === 'superadmin' )
              .every((u) => selectedTaggs.includes(u.id))
          }
          onToggleSelectAll={handleSelectAll}
        />

        <tbody>
          {taggs.map((taggx: Tagg) => (
            <TaggTableRow
              key={taggx.id}
              tagg={taggx}
              currentUserRole={user?.role}
              onDeleteConfirm={confirmDelete}
              isSelected={selectedTaggs.includes(taggx.id)}
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
  <p>No records.</p>
)}

      {selectedTaggs.length > 0 && (
        <>
        <div className = 'flex items-center justify-center px-5 py-5'>
        <button
          onClick={() => confirmDelete(selectedTaggs)}
          className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Delete Selected ({selectedTaggs.length})
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
                  onClick={() => handleDelete(deleteConfirmation.taggIds)}

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

export default ViewSuperAdminTaggsPage