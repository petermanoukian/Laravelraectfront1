//ViewSuperAdminTaggProdPage.tsx

import React from 'react'
import { useNavigate , useSearchParams , useParams  } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axiosInstance from '../../lib/axios';
import { Link , NavLink} from 'react-router-dom';
import { useEffect, useState } from 'react';
import TaggProdTableHeader from '../../components/superadmin/TaggProdTableHeader';  
import TaggProdTableRow from '../../components/superadmin/TaggProdTableRow';
import ProdTaggFilterControls from '../../components/superadmin/ProdTaggFilterControls';
import Pagination from '../../components/Pagination';
import { useLocation } from 'react-router-dom';



type Tagg = {
  id: number;
  name: string;
  prods_count: number;
};


type Prod = {
  id: number;
  name: string;
  taggs_count: number;
};

type Taggprod = {
  id: number;            // Product ID
  catid: number;        // Category ID
  subid: number;      // Subcategory ID
  prod: Prod; 
  tagg: Tagg;        // Subcategory object
};




const ViewSuperAdminTaggProdPage = () => {

  const baseUrl = import.meta.env.VITE_API_PUBLIC_URL;
  const [prods, setProds] = useState<Prod[]>([]);
  const [taggs, setTaggs] = useState<Tagg[]>([]);
  const [taggprods, setTaggprods] = useState<taggprod[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, setUser, isAuthenticated } = useAuth();
  const location = useLocation();
  const [ProdName, setProdName] = useState<string | null>(null);
  const [taggName, setTaggName] = useState<string | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ show: boolean; taggprodIds: number[] }>({
    show: false,
    taggprodIds: [],
  }); 

  //const [currentPage, setCurrentPage] = useState<number>(1); 
  const [totalPages, setTotalPages] = useState(1); // Total pages for pagination
  const perPage = 10;
  const [refreshKey, setRefreshKey] = useState(0);

  const [selectedTaggProds, setSelectedTaggProds] = useState<number[]>([]);
  const currentUserRole = user?.role;
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchParams, setSearchParams] = useSearchParams();
  const { prodid } = useParams();
  const { taggid } = useParams();
  const [selectedProdId, setSelectedProdId] = useState(prodid || '');
  const [selectedTaggId, setSelectedTaggId] = useState(taggid || '');
  const navigate = useNavigate();

  //const [shouldRefresh, setShouldRefresh] = useState(false);
  //const [refreshTrigger, setRefreshTrigger] = useState(false);


  useEffect(() => {
    if (taggid) {
      setSelectedTaggId(taggid);
      console.log('changed tag  HERE ' + taggid)
    }
  }, [taggid]);

  useEffect(() => {
    if (prodid) {
      setSelectedProdId(prodid);
    }
    console.log('changed prod HERE  ' + prodid)
  }, [prodid]);


    useEffect(() => {
    console.log('Updated selectedProdId:', selectedProdId);
  }, [selectedProdId]);

  useEffect(() => {
    console.log('Updated selectedTaggId:', selectedTaggId);
  }, [selectedTaggId]);
  
  const handleToggleSelect = (taggprodId: number) => {
    setSelectedTaggProds((prevSelected) =>
      prevSelected.includes(taggprodId)
        ? prevSelected.filter((id) => id !== taggprodId)
        : [...prevSelected, taggprodId]
    );
  };


  const handleSelectAll = () => {
    const selectableIds = taggprods     
    .map((u) => u.id); 
    const allSelected = selectableIds.every((id) => selectedTaggProds.includes(id));
    if (allSelected) {
      setSelectedTaggProds([]);
    } else {
      setSelectedTaggProds(selectableIds);
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
    }, [debouncedSearchTerm, searchParams, selectedProdId, selectedTaggId, setSearchParams]);


    useEffect(() => {
    const fetchTaggProds = async () => {
      try {

        const url = `/superadmin/prodtaggs/view/${selectedProdId || 0}/${selectedTaggId || 0}`;

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
        setProds(response.data.prods);
        setTaggs(response.data.taggs);
        setTaggprods(response.data.prodtaggs.data);
        console.log('prods ', prods);
        console.log('taggs' , taggs);
        console.log('taggs and prods' , taggprods);
        setTotalPages(response.data.prodtaggs.last_page);
        setProdName(response.data?.prodName ?? null);
        setTaggName(response.data?.taggName ?? null);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching records:', error);
      }
    };
  
    fetchTaggProds();
    }, [selectedProdId, selectedTaggId, currentPage, refreshKey, debouncedSearchTerm, 
      sortField, sortDirection, prodid, taggid]);


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
          await axiosInstance.delete(`/superadmin/prodtagg/delete/${ids[0]}`, {
            withCredentials: true,
          });
        }
        else {
  
          
          await axiosInstance.delete('/superadmin/prodtaggs/deleteall', {
            data: { prodtaggids: ids },
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
            },
          });
        }
      
        // Remove deleted users from UI
        setTaggprods((prev) => prev.filter((u) => !ids.includes(u.id)));
        setSelectedTaggProds((prev) => prev.filter((id) => !ids.includes(id)));
      
        setDeleteConfirmation({ show: false, taggprodIds: [] });
        setRefreshKey((prev) => prev + 1);
      } catch (error) {
        console.error('Error deleting row(s):', error);
      }
    };

    const confirmDelete = (rowOrRows: number | number[]) => {
      const taggprodIds = Array.isArray(rowOrRows) ? rowOrRows : [rowOrRows];
      setDeleteConfirmation({ show: true, taggprodIds });
    };


    const cancelDelete = () => {
      setDeleteConfirmation({ show: false, taggprodIds: [] });
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
          to={`/superadmin/addtaggprod${prodid ? `/${prodid}` : '/0'}${taggid ? `/${taggid}` : '/0'}`}
          className="ml-1 text-blue-500 hover:underline font-bold text-sm"
        >
          &rsaquo; Add Tags and Product {ProdName ? `Belonging to ${ProdName}` : ''}
          {taggName ? `Belonging to ${taggName}` : ''}
        </NavLink>

        </p>
      </div>

      <div className="p-6">
      <h2 className="text-xl font-bold mb-4">SubCategories</h2>

        <ProdTaggFilterControls
        prods={prods}
        taggs={taggs}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedProdId={selectedProdId}
        setSelectedProdId={setSelectedProdId}
        selectedTaggId={selectedTaggId}
        setSelectedTaggId={setSelectedTaggId}
      />

      {selectedTaggProds.length > 0 && (
        <>
        <div className = 'flex items-center justify-center px-2 '>
        <button
          onClick={() => confirmDelete(selectedTaggProds)}
          className="mb-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Delete Selected ({selectedTaggProds.length})
        </button>
        </div>
        
        </>
      )}

    {taggprods.length > 0 ?  (
      <>

      <table className="min-w-full border">
        <TaggProdTableHeader
          sortField={sortField}
          sortDirection={sortDirection}
          setSortField={setSortField}
          setSortDirection={setSortDirection}
          allSelected={
            taggprods
              .every((u) => selectedTaggProds.includes(u.id))
          }
          onToggleSelectAll={handleSelectAll}
        />


        <tbody>
          {taggprods.map((taggprodx: Taggprod) => (
            <TaggProdTableRow
              key={taggprodx.id}
              taggprod={taggprodx}
              currentUserRole={user?.role}
              onDeleteConfirm={confirmDelete}
              isSelected={selectedTaggProds.includes(taggprodx.id)}
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

      {selectedTaggProds.length > 0 && (
        <>
        <div className = 'flex items-center justify-center px-5 py-5'>
        <button
          onClick={() => confirmDelete(selectedTaggProds)}
          className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Delete Selected ({selectedTaggProds.length})
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
                  onClick={() => handleDelete(deleteConfirmation.taggprodIds)}

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

export default ViewSuperAdminTaggProdPage