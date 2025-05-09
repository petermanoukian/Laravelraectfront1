//EditSuperAdminSubCatPage.tsx


import React, { useState, useEffect, useRef, useCallback , useMemo  } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axiosInstance from '../../lib/axios';
import Select from 'react-select';
import { useLocation } from 'react-router-dom';
import { NavLink } from 'react-router-dom';


type Cat = {
  id: number;
  name: string;
};

const EditSuperAdminSubCatPage = () => {
  const { user, isAuthenticated } = useAuth();

  const navigate = useNavigate();
  const { id: id1 } = useParams<{ id: string }>();
  const id = id1 ? parseInt(id1, 10) : null;

  const publicserverpath = import.meta.env.VITE_API_PUBLIC_URL
  
  const [formData, setFormData] = useState({
    name: '',
    catid:'',
    
  });

  const [name, setName] = useState<string>('');
  const [cats, setCats] = useState<Cat[]>([]);
  const [catid, setCatid] = useState<string>('');

  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [loading, setLoading] = useState(false);
  
  const debounceRef = useRef<number | null>(null);
  const [subAvailable, setSubAvailable] = useState<boolean | null>(null);
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);




  const fetchSubCatData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/superadmin/subcat/edit/${id}`, { withCredentials: true });
      console.log("response iss", response.data);
      // Destructure the response data
      const { name, catid } = response.data.sub;

      // Set formData state
      setFormData({
        name: name,
        catid:  catid, // Ensure catid is set correctly
      });

      
      setName(name);
      setCatid(catid); // Ensure catid is set correctly
      setCats(response.data.cats);

      console.log("Line 108 formData after setFormData:", {
        name: name,
        catid: catid, // Ensure catid is set correctly
    });
      
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      
    } finally {
      setLoading(false);
    }
  }, [id]); 

  useEffect(() => {
    if (id) {

        fetchSubCatData();
    }
    else {
        console.log("Id is null", id);  
    }
  }, [id, fetchSubCatData]); 



  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | { value: string }
  ) => {
    if ('target' in e) {
      const { name, value } = e.target;
  
      if (name === 'name') {
        const name = value;
  
        if (debounceRef.current) clearTimeout(debounceRef.current);
  
        debounceRef.current = window.setTimeout(async () => {
          try {
            const res = await axiosInstance.post(
              '/subcats/check-name-edit',
              { name, catid, id },
              { withCredentials: true }
            );
  
            const available = !res.data.exists;
            setSubAvailable(available);
            setButtonDisabled(!available);
          } catch (err) {
            console.error('Check failed:', err);
            setSubAvailable(null);
          }
        }, 300); // Shorter debounce
      }
  
      if (name === 'catid') {
        setCatid(value);
  
        if (formData.name.trim() !== '') {
          if (debounceRef.current) clearTimeout(debounceRef.current);
  
          debounceRef.current = window.setTimeout(async () => {
            try {
              const res = await axiosInstance.post(
                '/subcats/check-name-edit',
                { name: formData.name, catid: value, id },
                { withCredentials: true }
              );
  
              const available = !res.data.exists;
              setSubAvailable(available);
              setButtonDisabled(!available);
            } catch (err) {
              console.error('Check failed:', err);
              setSubAvailable(null);
            }
          }, 300);
        }
      }
  
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
  
      setButtonDisabled(false);
      setErrors({});
    } else {
      // react-select
      const { value } = e;
  
      setFormData((prev) => ({
        ...prev,
        catid: value,
      }));
  
      setCatid(value);
      setButtonDisabled(false);
      setErrors({});
  
      if (formData.name.trim() !== '') {
        if (debounceRef.current) clearTimeout(debounceRef.current);
  
        debounceRef.current = window.setTimeout(async () => {
          try {
            const res = await axiosInstance.post(
              '/subcats/check-name-edit',
              { name: formData.name, catid: value, id },
              { withCredentials: true }
            );
  
            const available = !res.data.exists;
            setSubAvailable(available);
            setButtonDisabled(!available);
          } catch (err) {
            console.error('Check failed:', err);
            setSubAvailable(null);
          }
        }, 300);
      }
    }
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("handleSubmit is running")
    e.preventDefault();
    setLoading(true);
    setErrors({});
    console.log("handleSubmit is running Line 221")

    console.log("formData before validation Line 230", formData);

    const newErrors: { [key: string]: string[] } = {};

  
    // React validations
    if (!formData.name.trim()) newErrors.name = ['The users Name is required.'];
    else if (formData.name.length > 255) newErrors.name = ['Name must be under 255 characters.'];

  
    if (!formData.catid.trim()) newErrors.name = ['Category is required.'];
    
    // If any frontend errors, stop here
    if (Object.keys(newErrors).length > 0) {
        console.log("Object.keys(newErrors).length > 0 is running")
        console.log("Validation errors found:", newErrors);
      setErrors(newErrors);
      setLoading(false);
      return;
    }
  
    // Proceed to submit


    const subcatData = new FormData();
    subcatData.append('name', formData.name);
    subcatData.append('catid', formData.catid);
    console.log("formData name is", formData.name)
    
    for (let [key, value] of subcatData.entries()) {
        console.log(`${key}: ${value}`);
      }

    console.log("data", subcatData)
    subcatData.append('_method', 'PUT');
    try {
        console.log("Data is", subcatData)
      await axiosInstance.post(`/superadmin/subcat/update/${id}`, subcatData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data', // Fix from your previous 'application/json'
        },
      });
      navigate(`/superadmin/subcats/view/${catid}`);
    } catch (error: any) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors || {});
        console.error('Failed to update:', error.response.data.errors);
      } else {
        console.error('Failed to update:', error);
      }
    } finally {
        console.log("finally block is running")
      setLoading(false);
    }
  };


  useEffect(() => {
   
    if (Object.keys(errors).length > 0 || subAvailable === false) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);  
    }
  }, [errors, subAvailable]);
  

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
  



  const selectedCategoryOption = useMemo(() => {
    return catid
      ? categoryOptions.find((option) => option.value === String(catid)) || null
      : null;
  }, [catid, categoryOptions]);
  

  return (
    <>



      <div className="p-8 rounded border border-gray-200 w-full max-w-3xl mx-auto">
        <h2 className="font-medium text-3xl">Edit SubCategory</h2>
        <form onSubmit={handleSubmit}>
          <div className="mt-8 grid lg:grid-cols-1 gap-4 w-full">



          <div>
            <label>Category:</label>

            <Select
                options={categoryOptions}
                value={selectedCategoryOption}
                onChange={(selectedOption) => {
                  setCatid(selectedOption?.value || '');
                  handleChange({ value: selectedOption?.value || '' }); //
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



            {/* Name Input */}

            {!formData.catid ? (
            <p className="text-gray-600 italic">Select a category to update subcategory.</p>
            ) : (

            
            <div className="w-full">
              <label>Name:</label>
              <input
                required
                className="bg-gray-100 border border-gray-200 rounded py-1 px-3 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name[0]}</p>}

              {subAvailable === false && (
                <p className="text-red-500 text-sm">Already taken.</p>
              )}
              {subAvailable === true && !errors.name && (
                <p className="text-green-600 text-sm">Available.</p>
              )}



            </div>
            )}






            {/* Submit Button */}
            {formData.catid && (
            <div className="space-x-4 mt-8">
              <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded disabled:bg-gray-400" 
              disabled={buttonDisabled || loading}>
                {loading ? 'Updating...' : 'Update User'}
              </button>
            </div>
            )}
          </div>
        </form>
      </div>
    </>
      );
    };
    
    
    

export default EditSuperAdminSubCatPage
