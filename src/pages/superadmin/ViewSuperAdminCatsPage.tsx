//ViewSuperAdminCatsPage.tsx
//import React from 'react'
//import { useNavigate , useSearchParams  } from 'react-router-dom';
import {  useSearchParams  } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axiosInstance from '../../lib/axios';
import { NavLink} from 'react-router-dom';
import { useEffect, useState } from 'react';
import CatTableHeader from '../../components/superadmin/CatTableHeader';
import CatTableRow from '../../components/superadmin/CatTableRow';
import CatFilterControls from '../../components/superadmin/CatFilterControls';
import Pagination from '../../components/Pagination';
import { useLocation } from 'react-router-dom';

type Cat = {
  id: number;
  name: string;
  subcats_count: number;
  catprods_count: number;
};

const ViewSuperAdminCatsPage = () => {

  const [cats, setCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const location = useLocation();

  const [deleteConfirmation, setDeleteConfirmation] = useState<{ show: boolean; catIds: number[] }>({
    show: false,
    catIds: [],
  }); 

    const [currentPage, setCurrentPage] = useState<number>(1);
  
    const [totalPages, setTotalPages] = useState(1); // Total pages for pagination
    const perPage = 10;
    const [refreshKey, setRefreshKey] = useState(0);
    const [selectedCats, setSelectedCats] = useState<number[]>([]);
    const currentUserRole = user?.role;

    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [sortField, setSortField] = useState('id');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [searchParams, setSearchParams] = useSearchParams();

    const handleToggleSelect = (catId: number) => {
      setSelectedCats((prevSelected) =>
        prevSelected.includes(catId)
          ? prevSelected.filter((id) => id !== catId)
          : [...prevSelected, catId]
      );
    };


    const handleSelectAll = () => {
      const selectableIds = cats
        .filter((u) => currentUserRole === 'superadmin' )
        .map((u) => u.id);
    
      const allSelected = selectableIds.every((id) => selectedCats.includes(id));
    
      if (allSelected) {
        setSelectedCats([]);
      } else {
        setSelectedCats(selectableIds);
      }
    };
    
  useEffect(() => {
    const pageParam = searchParams.get('page');
    const parsedPage = pageParam ? parseInt(pageParam, 10) : 1;
  
    // Only update if parsed page is valid and different from current state
    if (!isNaN(parsedPage) && parsedPage !== currentPage) {
      setCurrentPage(parsedPage);
    }
  }, [searchParams , currentPage]); // make sure currentPage is in deps
  

  useEffect(() => {
    setCurrentPage(1);
    setSearchParams({ page: '1' });
  }, [debouncedSearchTerm, setSearchParams]);
  


    useEffect(() => {
    
      const fetchCats = async () => {
        try {
          const response = await axiosInstance.get('/superadmin/cats', {
            params: {
              page: currentPage,
              perPage: perPage,
              search: debouncedSearchTerm,
              sortField: sortField,
              sortDirection: sortDirection,
            },
          });
          
          setCats(response.data.cats.data);
          setTotalPages(response.data.cats.last_page);
          console.log('Total pages:', response.data.totalPages);
          setLoading(false);
       
        } catch (error) {
          console.error('Error fetching cats:', error);
        }
      };
    
      fetchCats();
    }, [currentPage, refreshKey , debouncedSearchTerm, sortField, sortDirection ]);

    useEffect(() => {
      if (location.state?.refresh) {
        console.log('Reloading categories...');
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
          await axiosInstance.delete(`/superadmin/cat/delete/${ids[0]}`, {
            withCredentials: true,
          });
        }
        else {
  
          
          await axiosInstance.delete('/superadmin/cats/deleteall', {
            data: { catids: ids },
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
            },
          });
        }
      
        // Remove deleted users from UI
        setCats((prev) => prev.filter((u) => !ids.includes(u.id)));
        setSelectedCats((prev) => prev.filter((id) => !ids.includes(id)));
      
        setDeleteConfirmation({ show: false, catIds: [] });
        setRefreshKey((prev) => prev + 1);
      } catch (error) {
        console.error('Error deleting user(s):', error);
      }
    };

    const confirmDelete = (catOrCats: number | number[]) => {
      const catIds = Array.isArray(catOrCats) ? catOrCats : [catOrCats];
      setDeleteConfirmation({ show: true, catIds });
    };


    const cancelDelete = () => {
      setDeleteConfirmation({ show: false, catIds: [] });
    };


    

    if (loading) return (
      <>
    
      <div>..... Loading All cats...</div>
    
    
        </>
      )
    return (
    <>
  
     
      <div className="w-full p-3 bg-gray-100 mb-4">
        <p className = "mt-3 block text-sm">
        <NavLink to="/superadmin/cats/add" className="text-blue-500 hover:underline font-bold text-sm">
            &rsaquo; Add New Category
        </NavLink> 
        </p>
      </div>


      <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Categories</h2>

      <CatFilterControls

      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
    />



      {selectedCats.length > 0 && (
        <>
        <div className = 'flex items-center justify-center px-2 '>
        <button
          onClick={() => confirmDelete(selectedCats)}
          className="mb-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Delete Selected ({selectedCats.length})
        </button>
        </div>
        
        </>
      )}

    {cats.length > 0 ?  (
      <>

      <table className="min-w-full border">

        <CatTableHeader

          sortField={sortField}
          sortDirection={sortDirection}
          setSortField={setSortField}
          setSortDirection={setSortDirection}
          allSelected={
            cats
              .filter((u) => currentUserRole === 'superadmin' )
              .every((u) => selectedCats.includes(u.id))
          }
          onToggleSelectAll={handleSelectAll}
        />

        <tbody>
          {cats.map((catx: Cat) => (
            <CatTableRow
              key={catx.id}
              cat={catx}
              currentUserRole={user?.role}
              onDeleteConfirm={confirmDelete}
              isSelected={selectedCats.includes(catx.id)}
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
  <p>No categories or an error occurred.</p>
)}

      {selectedCats.length > 0 && (
        <>
        <div className = 'flex items-center justify-center px-5 py-5'>
        <button
          onClick={() => confirmDelete(selectedCats)}
          className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Delete Selected ({selectedCats.length})
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
                  onClick={() => handleDelete(deleteConfirmation.catIds)}

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

export default ViewSuperAdminCatsPage