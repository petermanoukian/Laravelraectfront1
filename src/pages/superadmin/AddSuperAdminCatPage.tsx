//AddSuperAdminCatPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axiosInstance from '../../lib/axios';
import { useEffect, useRef } from 'react';

import { NavLink } from 'react-router-dom';

const AddSuperAdmincatPage = () => {

const debounceRef = useRef<number | null>(null);

const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
const { user, setUser, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    name: '',

  });

 
  const [name, setName] = useState<string>('');
  const [nameAvailable, setNameAvailable] = useState<boolean | null>(null);

  const [errors, setErrors] = useState<{ [key: string]: string[] }>({}); 
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();


  
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
  
    if (name === 'name') {
      setName(value); // Explicitly set the 'name' state
    } 
    // Update formData with the new value for the corresponding field
    setFormData({
      ...formData,
      [name]: value,
    });

    setButtonDisabled(false); 
    setErrors({}); // Clear errors when user starts typing
  };
  


  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
  
    const newErrors: { [key: string]: string[] } = {};

  
  
    // React validations
    if (!formData.name.trim()) newErrors.name = ['Name is required.'];
    else if (formData.name.length > 255) newErrors.name = ['Name must be under 255 characters.'];
  

 
  
    // If any frontend errors, stop here
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }
  
    // Proceed to submit
    const userData = new FormData();
    userData.append('name', formData.name);
  
  
    try {
      await axiosInstance.post('/superadmin/cat/add', userData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data', // Fix from your previous 'application/json'
        },
      });
      navigate('/superadmin/cats');
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
    if (Object.keys(errors).length > 0 || nameAvailable === false) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);  // Enable the button if there are no errors and email is available
    }
  }, [errors, nameAvailable]);
  
  

  return (
    <>

    <div className="w-full p-3 bg-gray-100 mb-4">
    <p className = "mt-3 block"> Welcome {user?.name} {user?.id}  {user?.role} </p>
    <p className = "mt-3 block text-sm">
    <NavLink to="/superadmin/cats" className="text-blue-500 hover:underline font-bold text-sm">
        &rsaquo; View categories
    </NavLink> 
    </p>
    </div>

      
      <div className="p-8 rounded border border-gray-200 w-full max-w-3xl mx-auto">
        <h2 className="font-medium text-3xl">Add Category</h2>
        <form onSubmit={handleSubmit}>
          <div className="mt-8 grid lg:grid-cols-1 gap-4 w-full">






            <div>
              <label>Name:</label>
              <input
                className="bg-gray-100 border border-gray-200 rounded py-1 px-3 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
                type="text" 
                name="name"
                value={formData.name}
                
                onChange={(e) => {
                  handleChange(e);
                  if (e.target.name === 'name') {
                    const name = e.target.value;
                    if (debounceRef.current) clearTimeout(debounceRef.current);
                    debounceRef.current = window.setTimeout(async () => {
                     
                      try {
                        const res = await axiosInstance.post(
                          '/cats/check-name',
                          { name},
                          { withCredentials: true }
                        );
                        
                        const available = !res.data.exists;
                        setNameAvailable(available);
                        setButtonDisabled(!available); // Disable if not available
                      } catch (err) {
                        console.error('check failed:', err);
                        setNameAvailable(null);
                      }
                    }, 500);
                  }
                }}
                

              />

              {nameAvailable === false && (
                <p className="text-red-500 text-sm">Category exists.</p>
              )}
              {nameAvailable === true && !errors.email && (
                <p className="text-green-600 text-sm">Category available.</p>
              )}

              {errors.name && <p className="text-red-500 text-sm">{errors.name[0]}</p>}
            </div>
          
           
    
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
  );
};

export default AddSuperAdmincatPage;
