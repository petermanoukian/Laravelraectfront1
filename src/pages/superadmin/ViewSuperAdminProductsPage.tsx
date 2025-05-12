import React from 'react'

import { useNavigate , useSearchParams , useParams  } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axiosInstance from '../../lib/axios';
import { Link , NavLink} from 'react-router-dom';
import { useEffect, useState } from 'react';
import ProdTableHeader from '../../components/superadmin/ProdTableHeader';  
import ProdTableRow from '../../components/superadmin/ProdTableRow';
import ProdFilterControls from '../../components/superadmin/ProdFilterControls';
import Pagination from '../../components/Pagination';
import { useLocation } from 'react-router-dom';


type Cat = {
  id: number;
  name: string;
  subcats_count: number;
  catprods_count: number;
};


type Subcat = {
  id: number;
  catid: number;
  name: string;
  cat: Cat; 
  subprods_count: number;
};

type Product = {
  id: number;            // Product ID
  name: string;          // Product name
  prix: number;          // Price (could be decimal, type `number` will handle decimals)
  des: string;           // Description (text field)
  dess: string;          // Detailed description (WYSIWYG editor content, HTML)
  img: string | null;      // Image file input (File object or null if no file)
  pdf: string | null;      // PDF file input (File object or null if no file)
  catid: number;        // Category ID
  subid: number;      // Subcategory ID
  vis: '0' | '1';        // Visibility (enum, either '0' or '1')
  quan: number;          // Quantity (integer)
  ordd: number;          // Order number (number)
  cat: Cat; 
  subcat: Subcat;        // Subcategory object
};



const ViewSuperAdminProductsPage = () => {
    const baseUrl = import.meta.env.VITE_API_PUBLIC_URL;
    const [cats, setCats] = useState<Cat[]>([]);
    const [subcats, setSubCats] = useState<Subcat[]>([]);
    const [prods, setProds] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const { user, setUser, isAuthenticated } = useAuth();
    const location = useLocation();
    const [categoryName, setCategoryName] = useState<string | null>(null);
    const [subcategoryName, setSubcategoryName] = useState<string | null>(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState<{ show: boolean; prodIds: number[] }>({
      show: false,
      prodIds: [],
    }); 

    //const [currentPage, setCurrentPage] = useState<number>(1); 
    const [totalPages, setTotalPages] = useState(1); // Total pages for pagination
    const perPage = 10;
    const [refreshKey, setRefreshKey] = useState(0);
    const [selectedProds, setSelectedProds] = useState<number[]>([]);
    const currentUserRole = user?.role;
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [sortField, setSortField] = useState('id');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [searchParams, setSearchParams] = useSearchParams();
    const { categoryid } = useParams();
    const { subcategoryid } = useParams();
    const [selectedCategoryId, setSelectedCategoryId] = useState(categoryid || '');
    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(subcategoryid || '');
    const navigate = useNavigate();

    //const [shouldRefresh, setShouldRefresh] = useState(false);
    //const [refreshTrigger, setRefreshTrigger] = useState(false);


    useEffect(() => {
      if (categoryid) {
        setSelectedCategoryId(categoryid);
        console.log('chnaged cat  ' + categoryid)
      }
    }, [categoryid]);

    useEffect(() => {
      if (subcategoryid) {
        setSelectedSubcategoryId(subcategoryid);
      }
      console.log('changed subcat  ' + subcategoryid)
    }, [subcategoryid]);


useEffect(() => {
  // Reset the subcategory when the selected category changes and doesn't match the initial categoryid
  if (selectedCategoryId !== categoryid) {
    setSelectedSubcategoryId('');
  }
}, [selectedCategoryId, categoryid]);  // This will run when either selectedCategoryId or categoryid changes
 // This will trigger whenever selectedCategoryId changes


  useEffect(() => {
    
    console.log('chnage of subcategory');
  }, [selectedSubcategoryId]);

    

    const handleToggleSelect = (prodId: number) => {
      setSelectedProds((prevSelected) =>
        prevSelected.includes(prodId)
          ? prevSelected.filter((id) => id !== prodId)
          : [...prevSelected, prodId]
      );
    };


    const handleSelectAll = () => {
      const selectableIds = prods
        
        .map((u) => u.id);
    
      const allSelected = selectableIds.every((id) => selectedProds.includes(id));
    
      if (allSelected) {
        setSelectedProds([]);
      } else {
        setSelectedProds(selectableIds);
      }
    };
    


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
    }, [debouncedSearchTerm, selectedCategoryId , selectedSubcategoryId]);
    
    
    

  useEffect(() => {
    const fetchProds = async () => {
      try {

          let url = '/superadmin/prods/view';

        if (selectedCategoryId) {
          url += `/${selectedCategoryId}`;
        }
        if (selectedSubcategoryId) {
          url += `/${selectedSubcategoryId}`;
        }
        console.log('url is ' + url);
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
        setSubCats(response.data.subcats);
        setCats(response.data.cats);
        setProds(response.data.prods.data);
        console.log('subcats only :', response.data.subcats);
        console.log('cats only :', response.data.cats);
        setTotalPages(response.data.prods.last_page);
        setCategoryName(response.data?.category_name ?? null);
        setSubcategoryName(response.data?.subcategory_name ?? null);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching subcats:', error);
      }
    };
  
    fetchProds();
    }, [
    selectedCategoryId,
    selectedSubcategoryId,
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
      setSelectedSubcategoryId('');

      // Navigate with a fresh page number, keeping everything reset
      navigate('/superadmin/prods/view?page=1', { replace: true });
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
          await axiosInstance.delete(`/superadmin/prod/delete/${ids[0]}`, {
            withCredentials: true,
          });
        }
        else {
  
          
          await axiosInstance.delete('/superadmin/prods/deleteall', {
            data: { subids: ids },
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
            },
          });
        }
      
        // Remove deleted users from UI
        setProds((prev) => prev.filter((u) => !ids.includes(u.id)));
        setSelectedProds((prev) => prev.filter((id) => !ids.includes(id)));
      
        setDeleteConfirmation({ show: false, prodIds: [] });
        setRefreshKey((prev) => prev + 1);
      } catch (error) {
        console.error('Error deleting row(s):', error);
      }
    };

    const confirmDelete = (prodOrProds: number | number[]) => {
      const prodIds = Array.isArray(prodOrProds) ? prodOrProds : [prodOrProds];
      setDeleteConfirmation({ show: true, prodIds });
    };


    const cancelDelete = () => {
      setDeleteConfirmation({ show: false, prodIds: [] });
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

        <NavLink to="/superadmin/cats" className="text-blue-500 hover:underline font-bold text-sm">
            &rsaquo; View categories 
        </NavLink>

        <NavLink
          to={`/superadmin/subcats/view${categoryid ? `/${categoryid}` : ''}`}
          className="ml-1 text-blue-500 hover:underline font-bold text-sm"
        >
          &rsaquo; View Subcategories {categoryName ? ` | ${categoryName}` : ''}
        </NavLink> 
        <br/><br/>
        <NavLink
          to={`/superadmin/prod/add${selectedCategoryId ? `/${selectedCategoryId}` : ''}${selectedSubcategoryId ? `/${selectedSubcategoryId}` : ''}`}
          className="text-blue-500 hover:underline font-bold text-sm"
        >
          &rsaquo; Add Products {categoryName ? ` | ${categoryName}` : ''}
          {subcategoryName ? ` | ${subcategoryName}` : ''}
        </NavLink>




        </p>
      </div>


      <div className="p-6">
      <h2 className="text-xl font-bold mb-4">SubCategories</h2>

        <ProdFilterControls
        cats={cats}
        subcats={subcats}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategoryId={selectedCategoryId}
        setSelectedCategoryId={setSelectedCategoryId}
        selectedSubcategoryId={selectedSubcategoryId}
        setSelectedSubcategoryId={setSelectedSubcategoryId}
      />



      {selectedProds.length > 0 && (
        <>
        <div className = 'flex items-center justify-center px-2 '>
        <button
          onClick={() => confirmDelete(selectedProds)}
          className="mb-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Delete Selected ({selectedProds.length})
        </button>
        </div>
        
        </>
      )}

    {prods.length > 0 ?  (
      <>

      <table className="min-w-full border">

        <ProdTableHeader

          sortField={sortField}
          sortDirection={sortDirection}
          setSortField={setSortField}
          setSortDirection={setSortDirection}
          allSelected={
            prods
        
              .every((u) => selectedProds.includes(u.id))
          }
          onToggleSelectAll={handleSelectAll}
        />


        <tbody>
          {prods.map((prodx: Product) => (
            <ProdTableRow


              key={prodx.id}
              prod={prodx}
              currentUserRole={user?.role}
              onDeleteConfirm={confirmDelete}
              isSelected={selectedProds.includes(prodx.id)}
              onToggleSelect={handleToggleSelect}
              baseUrl={baseUrl}
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

      {selectedProds.length > 0 && (
        <>
        <div className = 'flex items-center justify-center px-5 py-5'>
        <button
          onClick={() => confirmDelete(selectedProds)}
          className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Delete Selected ({selectedProds.length})
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
                  onClick={() => handleDelete(deleteConfirmation.prodIds)}

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

export default ViewSuperAdminProductsPage