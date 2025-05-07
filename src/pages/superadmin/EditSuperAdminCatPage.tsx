// File: src/pages/superadmin/EditSuperAdminCatPage.tsx
// Description: This file contains the EditSuperAdminUserPage component, which allows a super admin to edit user details.

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axiosInstance from '../../lib/axios';

import { NavLink } from 'react-router-dom';

const EditSuperAdminCatPage = () => {
  const { user, isAuthenticated } = useAuth();

  const navigate = useNavigate();
  const { catid: catid1 } = useParams<{ catid: string }>();
  const catid = catid1 ? parseInt(catid1, 10) : null;

  const publicserverpath = import.meta.env.VITE_API_PUBLIC_URL
  
  const [formData, setFormData] = useState({
    name: '',

  });

  const [name, setName] = useState<string>('');


  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [loading, setLoading] = useState(false);
  
  const debounceRef = useRef<number | null>(null);
  const [nameAvailable, setNameAvailable] = useState<boolean | null>(null);
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);




  const fetchCatData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/superadmin/cat/edit/${catid}`, { withCredentials: true });
      console.log("response iss", response.data);
      // Destructure the response data
      const { name } = response.data.catedit;
      
      // Set formData state
      setFormData({
        name: name,
 
      });

      
      setName(name);



      console.log("Line 108 formData after setFormData:", {
        name: name,
 
    });
      
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      
    } finally {
      setLoading(false);
    }
  }, [catid]); // Now memoized and depends on userId

  useEffect(() => {
    if (catid) {

        fetchCatData();
    }
    else {
        console.log("Id is null", catid);  
    }
  }, [catid, fetchCatData]); 



  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
  
      if (name === 'name') {
      
        const name = value;
        if (debounceRef.current) clearTimeout(debounceRef.current);
    
        debounceRef.current = window.setTimeout(async () => {
          
          try {
            const res = await axiosInstance.post(
              '/cats/check-name-edit',
              { name,  id: catid  },  // Include the userId
              { withCredentials: true }
            );
            
            const available = !res.data.exists;  
            setNameAvailable(available);       
            setButtonDisabled(!available);      
          } catch (err) {
            console.error('Check failed:', err);
            setNameAvailable(null);  // Reset if error occurs
          }
        }, 500); 




    } 
  
    // Update formData with the new value for the corresponding field
    setFormData({
      ...formData,
      [name]: value,
    });
  
    setButtonDisabled(false); 
    setErrors({}); // Clear errors when the user starts typing
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

  

    
    // If any frontend errors, stop here
    if (Object.keys(newErrors).length > 0) {
        console.log("Object.keys(newErrors).length > 0 is running")
        console.log("Validation errors found:", newErrors);
      setErrors(newErrors);
      setLoading(false);
      return;
    }
  
    // Proceed to submit
    const catData = new FormData();
    catData.append('name', formData.name);
    console.log("formData name is", formData.name)
    
    for (let [key, value] of catData.entries()) {
        console.log(`${key}: ${value}`);
      }

    console.log("data", catData)
    catData.append('_method', 'PUT');
    try {
        console.log("Data is", catData)
      await axiosInstance.post(`/superadmin/cat/update/${catid}`, catData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data', // Fix from your previous 'application/json'
        },
      });
      navigate('/superadmin/cats');
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
   
    if (Object.keys(errors).length > 0 || nameAvailable === false) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);  
    }
  }, [errors, nameAvailable]);
  



  return (
    <>



      <div className="p-8 rounded border border-gray-200 w-full max-w-3xl mx-auto">
        <h2 className="font-medium text-3xl">Edit Category</h2>
        <form onSubmit={handleSubmit}>
          <div className="mt-8 grid lg:grid-cols-1 gap-4 w-full">


            {/* Name Input */}
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

              {nameAvailable === false && (
                <p className="text-red-500 text-sm">Already taken.</p>
              )}
              {nameAvailable === true && !errors.name && (
                <p className="text-green-600 text-sm">Available.</p>
              )}



            </div>






            {/* Submit Button */}
            <div className="space-x-4 mt-8">
              <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded disabled:bg-gray-400" 
              disabled={buttonDisabled || loading}>
                {loading ? 'Updating...' : 'Update User'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
      );
    };
    
    export default EditSuperAdminCatPage;
    