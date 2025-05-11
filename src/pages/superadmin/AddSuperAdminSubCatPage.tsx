// AddSuperAdminSubCatPage.tsx

import React, { useEffect, useRef, useState} from 'react';
import { useNavigate , useSearchParams , useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axiosInstance from '../../lib/axios';
import { NavLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Select from 'react-select';

type Cat = {
  id: number;
  name: string;
};

const AddSuperAdminSubCatPage = () => {

  const debounceRef = useRef<number | null>(null);

  const { categoryid : categoryid1} = useParams();
  
  const [categoryid, setCategoryid] = useState<string>(categoryid1 || '');

  const [formData, setFormData] = useState({
    name: '',
    catid: categoryid || '',

  });




  useEffect(() => {
    setCategoryid(categoryid1 || '');
    setFormData((prev) => ({ ...prev, catid: categoryid1 || '' }));
  }, [categoryid1]);

  const navigate = useNavigate();

  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
  const { user, setUser, isAuthenticated } = useAuth();



  const [name, setName] = useState<string>('');
  const [cats, setCats] = useState<Cat[]>([]);
  const [categoryName, setCategoryName] = useState<string | null>(null);
  const [subAvailable, setSubAvailable] = useState<boolean | null>(null);

  const [errors, setErrors] = useState<{ [key: string]: string[] }>({}); 
  const [loading, setLoading] = useState(false);
  
  const { currentUser } = useAuth();

  /*
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
  
    if (name === 'name') {
      setName(value);
    }
  
    if (name === 'catid') {
      setCategoryid(value); // ✅ Update the separate categoryid state too
    }
  
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  
    setButtonDisabled(false);
    setErrors({});
  };
  */


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | { value: string }
  ) => {
    // Check if the event is from a native select element or react-select
    if ('target' in e) {
      const { name, value } = e.target;
  
      if (name === 'name') {
        setName(value);
      }
  
      if (name === 'catid') {
        setCategoryid(value); 
      }
  
      // Update form data
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
  
      setButtonDisabled(false);
      setErrors({});
    } else {
      // If the event is from react-select
      const { value } = e;
  
      setFormData((prev) => ({
        ...prev,
        catid: value,
      }));
  
      setCategoryid(value); // Update separate categoryid state too
      setButtonDisabled(false);
      setErrors({});
    }
  };
  

  useEffect(() => {
    
    const fetchCats = async () => {

        const url = categoryid
          ? `/superadmin/subcat/add/${categoryid}`
          : `/superadmin/subcat/add`; // no catid

      try {
        const response = await axiosInstance.get(url, {
        
        });
        console.log('Fetched cats:', response.data.cats);
        setCats(response.data.cats);
         setCategoryName(response.data?.category_name ?? null); // Set category name if available
        console.log('Category name:', response.data.category_name);
      } catch (error) {
        console.error('Error fetching cats:', error);
      }
    };
  
    fetchCats();
  }, [ ]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
  
    const newErrors: { [key: string]: string[] } = {};

    if (!formData.name.trim()) newErrors.name = ['Name is required.'];
    else if (formData.name.length > 255) newErrors.name = ['Name must be under 255 characters.'];
  
    if (!formData.catid.trim()) newErrors.name = ['Category is required.'];

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }
  
    // Proceed to submit
    const subcatData = new FormData();
    subcatData.append('name', formData.name);
    subcatData.append('catid', formData.catid);
  
    try {
      await axiosInstance.post('/superadmin/subcat/add', subcatData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data', // Fix from your previous 'application/json'
        },
      });
      navigate('/superadmin/subcats/view');
    } catch (error: any) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors || {});
      } else {
        console.error('Failed to create user:', error);
      }
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    // If there are any validation errors or email is unavailable, disable the button
    if (Object.keys(errors).length > 0 || subAvailable === false) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);  // Enable the button if there are no errors and email is available
    }
  }, [errors, subAvailable]);

  useEffect(() => {
    if (!formData.catid) {
      setSubAvailable(null); // Or null if you want no message
      setFormData((prev) => ({
        ...prev,
        name: '', // Optional: clear the name field too
      }));
      setButtonDisabled(true); // Disable submit
    }
  }, [formData.catid]);

  const categoryOptions: OptionType[] = [
    { value: '', label: 'All Categories' }, // Add this line
    ...(
      Array.isArray(cats)
        ? cats.map((cat) => ({
            value: String(cat.id),
            label: cat.name,
          }))
        : []
    ),
  ];

const selectedCategoryOption = categoryid
  ? categoryOptions.find((option) => option.value === categoryid) || null
  : null;


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
          &rsaquo; View Subcategories {categoryName ? `Belonging to ${categoryName}` : ''}
        </NavLink>
        </p>
      </div>

      <div className="p-8 rounded border border-gray-200 w-full max-w-3xl mx-auto">
        <h2 className="font-medium text-3xl">Add SubCategory</h2>
        <form onSubmit={handleSubmit}>
          <div className="mt-8 grid lg:grid-cols-1 gap-4 w-full">


          <div>
            <label>Category:</label>

            <Select
              options={categoryOptions}
              value={selectedCategoryOption}
              onChange={(selectedOption) => {
                setCategoryid(selectedOption?.value || '');
                handleChange({ value: selectedOption?.value || '' }); 

                if (formData.name.trim() !== '') {
                  if (debounceRef.current) clearTimeout(debounceRef.current);
            
                  debounceRef.current = window.setTimeout(async () => {
                    try {
                      const res = await axiosInstance.post(
                        '/subcats/check-name',
                        {
                          name: name,
                          catid: selectedOption?.value || '',
                        },
                        { withCredentials: true }
                      );
            
                      const available = !res.data.exists;
                      setSubAvailable(available);
                      setButtonDisabled(!available);
                    } catch (err) {
                      console.error('check failed:', err);
                      setSubAvailable(null);
                    }
                  }, 300);
                }
              }} 

              placeholder="Select a category..."
              isSearchable={true}
              className="w-64"
              classNamePrefix="react-select"
            />

            {/*

            <select
              required
              className="bg-gray-100 border border-gray-200 rounded py-1 px-3 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
              name="catid"
              value={formData.catid}
              onChange={handleChange}
            >
              <option value="">Select a category</option>
              {cats.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            */} 
          </div>

          {!formData.catid ? (
            <p className="text-gray-600 italic">Select a category to add a subcategory.</p>
            ) : (

          <div>
            <label>Name:</label>
            <input
              className="bg-gray-100 border border-gray-200 rounded py-1 px-3 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
              type="text"
              required
              placeholder="Enter subcategory name"
              name="name"
              value={formData.name}
              disabled={!formData.catid} // ✅ Disable if no category selected
              onChange={(e) => {
                handleChange(e);
      
              if (e.target.name === 'name') {
                const name = e.target.value;

              if (debounceRef.current) clearTimeout(debounceRef.current);

                debounceRef.current = window.setTimeout(async () => {
                  if (!formData.catid) return; // ✅ Don't call API without catid

                    try {
                      const res = await axiosInstance.post(
                        '/subcats/check-name',
                        {
                          name,
                          catid: formData.catid, // ✅ Send catid too
                        },
                        { withCredentials: true }
                      );

                      const available = !res.data.exists;
                      setSubAvailable(available);
                      setButtonDisabled(!available);
                    } catch (err) {
                      console.error('check failed:', err);
                      setSubAvailable(null);
                    }
                  }, 500);
                }
              }}
            />

            {subAvailable === false && (
              <p className="text-red-500 text-sm">SubCategory exists.</p>
            )}
            {subAvailable === true && (
              <p className="text-green-600 text-sm">SubCategory available.</p>
            )}

            {errors.name && <p className="text-red-500 text-sm">{errors.name[0]}</p>}
          </div>
         )} 
           
    
          <div className="space-x-4 mt-8">
              <button
                type="submit"
                disabled={loading || buttonDisabled}  

                className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 active:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Add'}
              </button>
            </div>
          </div>

        </form>
      </div>
    </>




  )
}

export default AddSuperAdminSubCatPage