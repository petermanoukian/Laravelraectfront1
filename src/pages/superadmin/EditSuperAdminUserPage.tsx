//EditSuperAdminUserPage.tsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axiosInstance from '../../lib/axios';
import DashboardSuperAdminLayout from '../../layouts/DashboardSuperAdminLayout';
import { NavLink } from 'react-router-dom';

const EditSuperAdminUserPage = () => {
  const { user, isAuthenticated } = useAuth();

  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const userIdInt = userId ? parseInt(userId, 10) : null;
  const publicserverpath = import.meta.env.VITE_API_PUBLIC_URL
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '', 
    img: null as File | null,
    pdf: null as File | null,
  });
  
  const [role, setRole] = useState<string>(''); 
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [img, setImg] = useState<File | null>(null);
  const [pdf, setPdf] = useState<File | null>(null);

  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null); 
  const [pdfPreviewType, setPdfPreviewType] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [loading, setLoading] = useState(false);
  
  const debounceRef = useRef<number | null>(null);
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);


  const getFileTypeFromExtension = (file: File): string => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'application/pdf';
      case 'jpg':
      case 'jpeg':
      case 'png':
        return 'image/jpeg';
      default:
        return '';
    }
  };

  const fetchUserData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/superadmin/user/edit/${userIdInt}`, { withCredentials: true });
      console.log("response iss", response.data);
      // Destructure the response data
      const { name, email, roles, img, pdf, pdfType } = response.data.useredit;
      const roleName = roles?.[0]?.name || ''; 
      // Set formData state
      setFormData({
        name: name,
        email: email,
        password: '', // Leave password empty for security
        role: roleName,
        img: null, // Keep this null because we are handling the file separately
        pdf: null, // Same for PDF file
      });

      // Set individual states (name, email, etc.)
      setName(name);
      setEmail(email);
      setRole(role);
      setPassword(''); // Don't pre-fill password


      const initialPdfType = pdf ? getFileTypeFromExtension({ name: pdf }) : null;
      console.log(' pdf iss ' + pdf)
      console.log(' initial pdf type iss ' + initialPdfType)
      

      // Set preview URLs for image and PDF if available
      setImagePreviewUrl(img || null);
      setPdfPreviewUrl(pdf || null);
     
      setPdfPreviewType(initialPdfType);

      setImg(null); // Keep this null as file uploads will be handled separately
      setPdf(null); 

      // For image and pdf preview
      if (img) {
        setImagePreviewUrl(`${publicserverpath}${img}`);
      }
      if (pdf) {
        // Example: If you have a path to the file, you can set it directly
        setPdfPreviewUrl(`${publicserverpath}${pdf}` || null);
        setPdfPreviewType('application/pdf' );
      }

      console.log("Line 108 formData after setFormData:", {
        name: name,
        email: email,
        password: '', // Just to confirm we're clearing the password field
        role: roleName,
        img: null,
        pdf: null,
    });
      
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      
    } finally {
      setLoading(false);
    }
  }, [userIdInt]); // Now memoized and depends on userId

  useEffect(() => {
    if (userIdInt) {
        //console.log("userId is not null", userId);
      fetchUserData();
    }
    else {
        //console.log("userId is null", userId);  
    }
  }, [userIdInt, fetchUserData]); 


const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const roleValue = e.target.value;
    setRole(roleValue); // Explicitly set the 'role' state
    
    // Also update formData with the new role value
    setFormData({
      ...formData,
      role: roleValue,
    });
  };
  
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
  
    if (name === 'name') {
      setName(value); // Explicitly set the 'name' state
    } else if (name === 'email') {
      
        const email = value;
        if (debounceRef.current) clearTimeout(debounceRef.current);
    
        debounceRef.current = window.setTimeout(async () => {
          if (!/\S+@\S+\.\S+/.test(email)) return; // Skip invalid format
          try {
            const res = await axiosInstance.post(
              '/superadmin/users/check-email-edit',
              { email, user_id: userIdInt },  // Include the userId
              { withCredentials: true }
            );
            
            const available = !res.data.exists;  // If exists is true, email is already taken
            setEmailAvailable(available);       // Store the email availability in state
            setButtonDisabled(!available);      // Disable the button if not available
          } catch (err) {
            console.error('Email check failed:', err);
            setEmailAvailable(null);  // Reset if error occurs
          }
        }, 500); 




    } else if (name === 'password') {
      setPassword(value); // Explicitly set the 'password' state
    }
  
    // Update formData with the new value for the corresponding field
    setFormData({
      ...formData,
      [name]: value,
    });
  
    setButtonDisabled(false); 
    setErrors({}); // Clear errors when the user starts typing
  };
  

  
    const handleImageFile = (file: File) => {
      setImg(file); 
      setImagePreviewUrl(URL.createObjectURL(file)); 
      setFormData({
        ...formData,
        img: file,
      }); 
    }; 

    
    const handlePdfFile = (file: File) => {
      setPdf(file); 
      setFormData({
        ...formData,
        pdf: file, 
      }); 

      const url = URL.createObjectURL(file);
      const type = file.type;
  
      if (
        type === 'application/pdf' ||
        type.startsWith('image/') ||
        type === 'text/plain' ||
        type === 'application/msword' ||
        type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        setPdfPreviewUrl(url);
        setPdfPreviewType(type); // NEW: store MIME type
        console.log('PDF preview URL:', url);
        console.log('PDF preview type:', type); // Log the MIME type
      } else {
        console.log('Invalid file type for PDF preview:', type);
        setPdfPreviewUrl(null);
        setPdfPreviewType(null);
      }

    }; 

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, files } = e.target;

      if (files && files[0]) {
        if (name === 'img') {
          handleImageFile(files[0]); 
        } else if (name === 'pdf') {
          handlePdfFile(files[0]); 
        }
      }
      setErrors({}); 
      setButtonDisabled(false); 


    };





  const handleSubmit = async (e: React.FormEvent) => {
    console.log("handleSubmit is running")
    e.preventDefault();
    setLoading(true);
    setErrors({});
    console.log("handleSubmit is running Line 221")

    console.log("formData before validation Line 230", formData);

    const newErrors: { [key: string]: string[] } = {};

    if (!formData.role) newErrors.role = ['Please Add role - Role is required.'];
  
    // React validations
    if (!formData.name.trim()) newErrors.name = ['The users Name is required.'];
    else if (formData.name.length > 255) newErrors.name = ['Name must be under 255 characters.'];
  
    if (!formData.email.trim()) newErrors.email = ['Email is required.'];
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = ['Invalid email format.'];
  
    
    if (formData.img) {
        const allowedImgTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
        if (!allowedImgTypes.includes(formData.img.type)) newErrors.img = ['Invalid image file type.'];
        else if (formData.img.size > 9 * 1024 * 1024) newErrors.img = ['Image must be under 9MB.'];
    }
  
    if (formData.pdf) {
        const allowedPdfTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain',
            'image/jpeg',
            'image/png',
            'image/jpg',
            'image/gif',
        ];
        if (!allowedPdfTypes.includes(formData.pdf.type)) newErrors.pdf = ['Invalid file type.'];
        else if (formData.pdf.size > 9  * 1024 * 1024) newErrors.pdf = ['File must be under 9MB.'];
    }
    
    // If any frontend errors, stop here
    if (Object.keys(newErrors).length > 0) {
        console.log("Object.keys(newErrors).length > 0 is running")
        console.log("Validation errors found:", newErrors);
      setErrors(newErrors);
      setLoading(false);
      return;
    }
  
    // Proceed to submit
    const userData = new FormData();
    userData.append('name', formData.name);
    console.log("formData name is", formData.name)
    
    for (let [key, value] of userData.entries()) {
        console.log(`${key}: ${value}`);
      }

    userData.append('email', formData.email);
    console.log("formData email is", formData.email)
    for (let [key, value] of userData.entries()) {
        console.log(`${key}: ${value}`);
      }


    userData.append('role', formData.role); // Add the role to the form data
    userData.append('password', formData.password);
    if (formData.img) userData.append('img', formData.img);
    if (formData.pdf) userData.append('pdf', formData.pdf);
    console.log("userData is", userData)
    userData.append('_method', 'PUT');
    try {
        console.log("userData is", userData)
      await axiosInstance.post(`/superadmin/users/update/${userIdInt}`, userData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data', // Fix from your previous 'application/json'
        },
      });
      navigate('/superadmin/users');
    } catch (error: any) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors || {});
        console.error('Failed to create user:', error.response.data.errors);
      } else {
        console.error('Failed to create user:', error);
      }
    } finally {
        console.log("finally block is running")
      setLoading(false);
    }
  };


  useEffect(() => {
    // If there are any validation errors or email is unavailable, disable the button
    if (Object.keys(errors).length > 0 || emailAvailable === false) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);  // Enable the button if there are no errors and email is available
    }
  }, [errors, emailAvailable]);
  



  return (
    <DashboardSuperAdminLayout>

      <div className="w-full p-3 bg-gray-100 mb-4">
        <p className="mt-3 block">Welcome {user?.name}</p>
        <p className="mt-3 block text-sm">
          <NavLink to="/superadmin/users" className="text-blue-500 hover:underline font-bold text-sm">
            &rsaquo; View Users
          </NavLink> 
        </p>
      </div>

      <div className="p-8 rounded border border-gray-200 w-full max-w-3xl mx-auto">
        <h2 className="font-medium text-3xl">Edit User</h2>
        <form onSubmit={handleSubmit}>
          <div className="mt-8 grid lg:grid-cols-1 gap-4 w-full">
            {/* Role Input */}
            <div>
              <label>Role:</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleRoleChange}
                className="bg-gray-100 border border-gray-200 rounded py-1 px-3 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
                required
              >
                <option value="">Select Role</option>
                <option value="superadmin">Superadmin</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
              {errors.role && <p className="text-red-500 text-sm">{errors.role[0]}</p>}
            </div>

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
            </div>

            {/* Email Input */}
            <div>
              <label>Email:</label>
              <input
                className="bg-gray-100 border border-gray-200 rounded py-1 px-3 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
                type="email"
                required
                name="email"
                value={formData.email}
                onChange={handleChange}
              />

                {emailAvailable === false && (
                <p className="text-red-500 text-sm">Email is already taken.</p>
              )}
              {emailAvailable === true && !errors.email && (
                <p className="text-green-600 text-sm">Email is available.</p>
              )}


              {errors.email && <p className="text-red-500 text-sm">{errors.email[0]}</p>}
            </div>

            {/* Password Input */}
            <div>
              <label>Password:</label>
              <input
                className="bg-gray-100 border border-gray-200 rounded py-1 px-3 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password[0]}</p>}
            </div>

            {/* Image Upload */}
            <div>
              <label>Image (JPG, PNG, GIF only):</label>
              <input
                type="file"
                name="img"
                onChange={handleFileChange}
                className="bg-gray-100 border border-gray-200 rounded-lg block w-full 
                text-sm text-gray-500 file:me-4 file:py-2 file:px-4 file:rounded-lg 
                file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white 
                hover:file:bg-blue-700 file:disabled:opacity-50 file:disabled:pointer-events-none 
                dark:text-neutral-500 dark:file:bg-blue-500 dark:hover:file:bg-blue-400"
              />
              {imagePreviewUrl && <img
               src={`${imagePreviewUrl}`} alt="Preview" className="h-24 mt-4 rounded shadow" />}
              {errors.img && <p className="text-red-500 text-sm">{errors.img[0]}</p>}
            </div>

            {/* PDF Upload */}
            <div>
              <label>File (PDF, Word, JPG, PNG, GIF only):</label>
              <input
                type="file"
                name="pdf"
                onChange={handleFileChange}
                className="bg-gray-100 block w-full border border-gray-200 shadow-sm rounded-lg 
                text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none 
                dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 file:bg-gray-50 file:border-0 file:me-4 file:py-3 
                file:px-4 dark:file:bg-neutral-700 dark:file:text-neutral-400"
              />  
            
                
              {pdfPreviewUrl && pdfPreviewType && (
                <div className="mt-4">
                  {pdfPreviewType === 'application/pdf' ? (
                    <embed src={`${pdfPreviewUrl}`} type="application/pdf" width="100%" height="120px" />
                  ) : pdfPreviewType.startsWith('image/') ? (
                    <img src={`${pdfPreviewUrl}`} alt="Image Preview" className="h-24 rounded shadow" />
                  ) : pdfPreviewType === 'text/plain' ? (
                    <iframe src={`${pdfPreviewUrl}`} width="100%" height="120px" />
                  ) : null}
                </div>
              )}
              {errors.pdf && <p className="text-red-500 text-sm">{errors.pdf[0]}</p>}
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
    </DashboardSuperAdminLayout>
      );
    };
    
    export default EditSuperAdminUserPage;
    