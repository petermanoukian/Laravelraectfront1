//ViewSuperAdminSubCatsPage.tsx

import React from 'react'
import { useNavigate , useSearchParams , useParams  } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axiosInstance from '../../lib/axios';
import { Link , NavLink} from 'react-router-dom';
import { useEffect, useState } from 'react';
import SubCatTableHeader from '../../components/superadmin/SubCatTableHeader';  
import SubCatTableRow from '../../components/superadmin/SubCatTableRow';
import SubCatFilterControls from '../../components/superadmin/SubCatFilterControls';
import Pagination from '../../components/Pagination';
import { useLocation } from 'react-router-dom';



type Cat = {
  id: number;
  name: string;
};


type Subcat = {
  id: number;
  catid: number;
  name: string;
  cat: Cat; 
  subprods_count: number;
};

const ViewSuperAdminSubCatsPage = () => {

    const [cats, setCats] = useState<Cat[]>([]);
    const [subcats, setSubCats] = useState<Subcat[]>([]);
    const [loading, setLoading] = useState(true);
    const { user, setUser, isAuthenticated } = useAuth();
    const location = useLocation();
    const [categoryName, setCategoryName] = useState<string | null>(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState<{ show: boolean; subcatIds: number[] }>({
      show: false,
      subcatIds: [],
    }); 

    //const [currentPage, setCurrentPage] = useState<number>(1); 
    const [totalPages, setTotalPages] = useState(1); // Total pages for pagination
    const perPage = 10;
    const [refreshKey, setRefreshKey] = useState(0);
    const [selectedSubCats, setSelectedSubCats] = useState<number[]>([]);
    const currentUserRole = user?.role;
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [sortField, setSortField] = useState('id');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [searchParams, setSearchParams] = useSearchParams();
    const { categoryid } = useParams();
    const [selectedCategoryId, setSelectedCategoryId] = useState(categoryid || '');
    const navigate = useNavigate();

    //const [shouldRefresh, setShouldRefresh] = useState(false);
    //const [refreshTrigger, setRefreshTrigger] = useState(false);


    useEffect(() => {
      if (categoryid) {
        setSelectedCategoryId(categoryid);
      }
    }, [categoryid]);
    

    const handleToggleSelect = (subcatId: number) => {
      setSelectedSubCats((prevSelected) =>
        prevSelected.includes(subcatId)
          ? prevSelected.filter((id) => id !== subcatId)
          : [...prevSelected, subcatId]
      );
    };


    const handleSelectAll = () => {
      const selectableIds = subcats
        
        .map((u) => u.id);
    
      const allSelected = selectableIds.every((id) => selectedSubCats.includes(id));
    
      if (allSelected) {
        setSelectedSubCats([]);
      } else {
        setSelectedSubCats(selectableIds);
      }
    };
    
    /*
    useEffect(() => {
      const pageParam = searchParams.get('page');
      const parsedPage = pageParam ? parseInt(pageParam, 10) : 1;
    
      if (!isNaN(parsedPage) && parsedPage !== currentPage) {
        setCurrentPage(parsedPage);
      }
    }, [currentPage, searchParams]);
    */

    const pageParam = searchParams.get('page');
    const currentPage = pageParam ? parseInt(pageParam, 10) : 1

    useEffect(() => {
      const newParams = new URLSearchParams(searchParams);
    
      // Reset to page 1 ONLY if debouncedSearchTerm or selectedCategoryId changes
      newParams.set('page', '1');
    
      // Only update searchParams if page is NOT already 1
      if (searchParams.get('page') !== '1') {
        setSearchParams(newParams);
      }
    
      // Also reset local state page
      //setCurrentPage(1);
    }, [debouncedSearchTerm, selectedCategoryId]);
    
    
    

  useEffect(() => {
    const fetchSubCats = async () => {
      try {
        const url = selectedCategoryId
          ? `/superadmin/subcats/view/${selectedCategoryId}`
          : `/superadmin/subcats/view`; // no catid
  
        const response = await axiosInstance.get(url, {
          params: {
            page: currentPage,
            perPage,
            search: debouncedSearchTerm,
            sortField,
            sortDirection,
          },
        });
        //console.log(response.data);
        setSubCats(response.data.subcats.data);
        setCats(response.data.cats);
        //console.log('subcats only :', response.data.subcats.data);
        //console.log('cats only :', response.data.cats);
        setTotalPages(response.data.subcats.last_page);
        setCategoryName(response.data?.category_name ?? null);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching subcats:', error);
      }
    };
  
    fetchSubCats();
    }, [
    selectedCategoryId,
    currentPage,
    refreshKey,
    debouncedSearchTerm,
    sortField,
    sortDirection,
  ]);
  
  


  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const refreshSubs = params.get('refreshsubs');

    if (refreshSubs === 'fullrefresh') {
      console.log('Full refresh of subcategories triggered...');

      // Reset search term and category selection
      setSearchTerm('');
      setSelectedCategoryId('');

      // Navigate with a fresh page number, keeping everything reset
      navigate('/superadmin/subcats/view?page=1', { replace: true });
    }
  }, [location, navigate]);
  
  


    useEffect(() => {
      const handler = setTimeout(() => {
        if (searchTerm.length >= 2 || searchTerm === '') {
          setDebouncedSearchTerm(searchTerm);
        }
      }, 400);
      return () => clearTimeout(handler);
    }, [searchTerm]);



    const handlePageChange = (page: number) => {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('page', page.toString());
      setSearchParams(newParams);
    };
    


    const handleDelete = async (ids: number[]) => {

      try {
        if (ids.length === 1) {
          await axiosInstance.delete(`/superadmin/subcat/delete/${ids[0]}`, {
            withCredentials: true,
          });
        }
        else {
  
          
          await axiosInstance.delete('/superadmin/subcats/deleteall', {
            data: { subids: ids },
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
            },
          });
        }
      
        // Remove deleted users from UI
        setSubCats((prev) => prev.filter((u) => !ids.includes(u.id)));
        setSelectedSubCats((prev) => prev.filter((id) => !ids.includes(id)));
      
        setDeleteConfirmation({ show: false, subcatIds: [] });
        setRefreshKey((prev) => prev + 1);
      } catch (error) {
        console.error('Error deleting user(s):', error);
      }
    };

    const confirmDelete = (subOrSubs: number | number[]) => {
      const subcatIds = Array.isArray(subOrSubs) ? subOrSubs : [subOrSubs];
      setDeleteConfirmation({ show: true, subcatIds });
    };


    const cancelDelete = () => {
      setDeleteConfirmation({ show: false, subcatIds: [] });
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
        <NavLink
      to={`/superadmin/subcats/add${selectedCategoryId ? `/${selectedCategoryId}` : ''}`}
      className="text-blue-500 hover:underline font-bold text-sm"
    >
      &rsaquo; Add New SubCategory {categoryName ? `to ${categoryName}` : ''}
    </NavLink>
        </p>
      </div>


      <div className="p-6">
      <h2 className="text-xl font-bold mb-4">SubCategories</h2>

      <SubCatFilterControls
      cats={cats}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      selectedCategoryId={selectedCategoryId}
      setSelectedCategoryId={setSelectedCategoryId}
    />



      {selectedSubCats.length > 0 && (
        <>
        <div className = 'flex items-center justify-center px-2 '>
        <button
          onClick={() => confirmDelete(selectedSubCats)}
          className="mb-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Delete Selected ({selectedSubCats.length})
        </button>
        </div>
        
        </>
      )}

    {subcats.length > 0 ?  (
      <>

      <table className="min-w-full border">

        <SubCatTableHeader

          sortField={sortField}
          sortDirection={sortDirection}
          setSortField={setSortField}
          setSortDirection={setSortDirection}
          allSelected={
            subcats
        
              .every((u) => selectedSubCats.includes(u.id))
          }
          onToggleSelectAll={handleSelectAll}
        />


        <tbody>
          {subcats.map((subcatx: Subcat) => (
            <SubCatTableRow


              key={subcatx.id}
              subcat={{ ...subcatx, cat: subcatx.cat ?? { id: subcatx.catid, name: '' } }}
              currentUserRole={user?.role}
              onDeleteConfirm={confirmDelete}
              isSelected={selectedSubCats.includes(subcatx.id)}
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
  <p>No records</p>
)}

      {selectedSubCats.length > 0 && (
        <>
        <div className = 'flex items-center justify-center px-5 py-5'>
        <button
          onClick={() => confirmDelete(selectedSubCats)}
          className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Delete Selected ({selectedSubCats.length})
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
                  onClick={() => handleDelete(deleteConfirmation.subcatIds)}

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





export default ViewSuperAdminSubCatsPage