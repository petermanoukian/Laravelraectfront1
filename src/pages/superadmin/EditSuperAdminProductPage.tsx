//EditSuperAdminProductPage.tsx

import React, { useState, useEffect, useRef, useCallback , useMemo  } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axiosInstance from '../../lib/axios';
import Select from 'react-select';
import { useLocation } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';

type Cat = {
  id: number;
  name: string;
}; 

type Sub = {
  id: number;
  catid: number;
  name: string;
};

  type Tagg = 
  {
    id: number;
    name: string;
  }; 

const EditSuperAdminProductPage = () => {

  const { user, isAuthenticated } = useAuth();

  const navigate = useNavigate();
  const { id: id1 } = useParams<{ id: string }>();
  const id = id1 ? parseInt(id1, 10) : null;

  const publicserverpath = import.meta.env.VITE_API_PUBLIC_URL
  
  const [formData, setFormData] = useState<{
  name: string;
  catid: string | number;
  subid: string | number;
  quan: number;
  ordd: number;
  vis: string;
  prix: number;
  des: string;
  dess: string;
  img: File | null;
  pdf: File | null;
  taggids: string[]; // FIXED: string[]
}>({
  name: '',
  catid: '',
  subid: '',
  quan: 1,
  ordd: 1,
  vis: '1',
  prix: 1,
  des: '',
  dess: '',
  img: null,
  pdf: null,
  taggids: [], // empty to start
});

  const [name, setName] = useState<string>('');
  const [cats, setCats] = useState<Cat[]>([]);
  const [catid, setCatid] = useState<string>('');
  const [subs, setSubs] = useState<Cat[]>([]);
  const [subid, setSubid] = useState<string>('');
  const [img, setImg] = useState<string>('');
  const [pdf, setPdf] = useState<string>('');
  const [des, setDes] = useState('');
  const [dess, setDess] = useState(''); 
  const [prix, setPrix] = useState(1); 
  const [vis, setVis] = useState('1');  
  const [quan, setQuan] = useState(1);  
  const [ordd, setOrdd] = useState(1);
  const [taggs, setTaggs] = useState<Tagg[]>([]);
  const [taggids, setTaggids] = useState<string[]>([]); 


  const [imgPreview, setImgPreview] = useState<string | null>(null);
  const [prodAvailable, setProdAvailable] = useState<boolean | null>(null);

  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [loading, setLoading] = useState(false);
  
  const debounceRef = useRef<number | null>(null);

  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
  const [firstSubLoad, setFirstSubLoad] = useState(false);

  const fetchProdData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/superadmin/prod/edit/${id}`, { withCredentials: true });
      console.log("response iss", response.data);
      // Destructure the response data
      const { name, catid, subid, prix, des, dess, vis, quan, img, pdf , ordd } = response.data.prod;

      // Set formData state
      setFormData({
        name: name,
        catid: String(catid),
        subid: String(subid),
        quan: quan,
        ordd: ordd,
        vis: String(vis),
        prix: prix,
        des: des,
        dess: dess,
        img: null, 
        pdf: null, 
        taggids: response.data.taggids.map((id: number) => String(id)),
      });

      
      setName(name);
      setCatid(catid); 
      setSubid(subid);
      setDes(des);
      setDess(dess);
      setOrdd(ordd);
      setQuan(quan);
      setPrix(prix);
      setImg(img);
      setPdf(pdf);
      setVis(vis);
      setCats(response.data.cats);
      setSubs(response.data.subs);
      setTaggs(response.data.taggs);
      setTaggids(response.data.taggids.map((id: number) => String(id)));
      setImgPreview(img ? `${publicserverpath}${img}` : null);

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

        fetchProdData();
    }
    else {
        console.log("Id is null", id);  
    }
  }, [id, fetchProdData]); 

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      | { value: string }
  ) => {
    if ('target' in e) {
      const { name, value, type } = e.target;

      // Handle fields and update respective states
      if (name === 'name') {
        setName(value);
      }

      if (name === 'catid') {
        setCatid(value);
      }

      if (name === 'subid') {
        setSubid(value);
      }

      if (name === 'des') {
        setDes(value);
      }

      if (name === 'dess') {
        setDess(value); // This will still be handled by TinyMCE
      }

      if (name === 'quan') {
        // Convert quan value to number here and ensure it is >= 0
        setQuan(Math.max(0, parseInt(value) || 0));
      }

      if (name === 'ordd') {
        // For order number, ensure it's parsed to a valid integer (0 by default if invalid)
        setOrdd(Math.max(0, parseInt(value) || 0));
      }

      if (name === 'prix') {
        // For price (prix), handle it as a string (allow decimals)
        setPrix(parseFloat(value) || 0);
      }

      if (name === 'vis') {
        setVis(value);
      }

      // Update full form data, parsing numbers where applicable
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'number' ? value : value, // Keep all values as strings to avoid warnings
      }));

      // Enable button and reset errors
      setButtonDisabled(false);
      setErrors({});
    } else {
      // If from a library like react-select
      const { value } = e;

      setCatid(value);
      setSubid(value);

      setFormData((prev) => ({
        ...prev,
        catid: isNaN(Number(value)) ? '' : Number(value),
        subid: isNaN(Number(value)) ? '' : Number(value),
      }));


      setButtonDisabled(false);
      setErrors({});
    }
  };

  const handleTaggidsChange = (selectedOptions: any) => {
    const tagids = selectedOptions ? selectedOptions.map((opt: any) => String(opt.value)) : [];

    setTaggids(tagids);
    setFormData((prev) => ({
      ...prev,
      taggids: tagids,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
  
    const newErrors: { [key: string]: string[] } = {};

    if (!formData.name.trim()) newErrors.name = ['Name is required.'];
    else if (formData.name.length > 255) newErrors.name = ['Name must be under 255 characters.'];
  
    if (!String(formData.catid).trim()) newErrors.catid = ['Category is required.'];
    if (!String(formData.subid).trim()) newErrors.subid = ['Subcategory is required.'];


    if (formData.quan < 0) {
        newErrors.quan = ['Quantity must be at least 0.'];
    }

      // Visibility validation (should be '0' or '1')
      if (formData.vis !== '0' && formData.vis !== '1') {
        newErrors.vis = ['Visibility must be either "0" (hidden) or "1" (visible).'];
      }

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
        'application/octet-stream', 
        'image/jpeg',
        'image/png',
        'image/jpg',
        'image/gif',
      ];
      if (!allowedPdfTypes.includes(formData.pdf.type)) newErrors.pdf = ['Invalid file type.'];
      else if (formData.pdf.size > 9  * 1024 * 1024) newErrors.pdf = ['File must be under 9MB.'];
    }



    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }
  
    // Proceed to submit
    const prodData = new FormData();
    prodData.append('name', formData.name);
    prodData.append('catid', String(formData.catid));
    prodData.append('subid', String(formData.subid));
    prodData.append('vis', formData.vis);
    prodData.append('quan', formData.quan.toString());
    prodData.append('prix', formData.prix.toString());
    prodData.append('des', formData.des);
    prodData.append('dess', formData.dess);
    prodData.append('ordd', formData.ordd.toString());
    if (formData.img) prodData.append('img', formData.img);
    if (formData.pdf) prodData.append('pdf', formData.pdf);
    formData.taggids.forEach((id) => {
      prodData.append('taggids[]', id); // already string
    });
    console.log('Form data:', prodData);
    console.log('Form data:', formData);
    prodData.append('_method', 'PUT');
    try {
      await axiosInstance.post(`/superadmin/prod/update/${id}`, prodData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data', // Fix from your previous 'application/json'
        },
      });
      navigate('/superadmin/prods/view');
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
   
    if (Object.keys(errors).length > 0 || prodAvailable === false) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);  
    }
  }, [errors, prodAvailable]);

  useEffect(() => {
      console.log('catid value from form:', formData.catid);
      console.log('catid type:', typeof formData.catid);
      if (!formData.catid) {
        setProdAvailable(null); // Or null if you want no message
        setFormData((prev) => ({
          ...prev,
       
        }));
        setButtonDisabled(true); // Disable submit
      }
    }, [formData.catid]);
  
  useEffect(() => {
    console.log('subid value from form:', formData.subid);
    console.log('subid type:', typeof formData.subid);

    if (!formData.subid) {
      setProdAvailable(null); // Or null if you want no message
      setFormData((prev) => ({
        ...prev,
        name: '', // Optional: clear the name field too
      }));
      setButtonDisabled(true); // Disable submit
    }
  }, [formData.subid]);



  useEffect(() => {
  console.log('catid value of catid:', catid);
  console.log('catid type of catid:', typeof catid);

  if (catid) {
    // Use your axiosInstance to fetch subcategories based on catid
    const fetchSubcategories = async () => {
      try {
        const response = await axiosInstance.get(`/superadmin/subsbycat/${catid}`, {
          withCredentials: true,
        });
        console.log('Fetched subcategories:', response.data.subs);

        const fetchedSubs = response.data.subs;
       
        if (firstSubLoad) {
          setSubid('');
        }


        setSubs(fetchedSubs); // Update the subs state with the fetched subcategories


        // Enable the submit button if subcategories exist
        setButtonDisabled(fetchedSubs.length === 0);
      } catch (error) {
        console.error('Error fetching subcategories:', error);
        setSubs([]);
        setSubid('');
        setButtonDisabled(true); // Disable button if there is an error
      }
    };

    fetchSubcategories();
  } 
  else 
  {
    setSubs([]);
    setSubid('');
  }
}, [catid, firstSubLoad]); // Re-run when catid changes

  const handleCatChange = (newCatid: string | number) => {
    setFirstSubLoad(true);
    setCatid(newCatid); // Trigger the useEffect
  };


  useEffect(() => {
    console.log('subid value of subid:', subid);
    console.log('subid type of subid:', typeof subid);
  }, [subid]);




  const handleImageFile = (file: File) => {
      setImg(file); 
      
      setFormData({
        ...formData,
        img: file,
      }); 
      setImgPreview(URL.createObjectURL(file));
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
    ) 
    {
      //ok
    } else {
      console.warn('Unsupported file type selected');
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
  
      setButtonDisabled(false); 
    };
  

 const categoryOptions: OptionType[] = [
    { value: '', label: 'All Categories' }, // Add this line
    ...(
      Array.isArray(cats)
        ? cats.map((cat) => ({
            value: String(cat.id),
           
            label: `${cat.name}`,

          }))
        : []
    ),
  ];

  const selectedCategoryOption = categoryOptions.find(
    (option) => Number(option.value) === catid
  );


  console.log('line 420 catid is - ' , catid ) 
  console.log('catid type:', typeof catid)

  const subcategoryOptions: OptionType[] = [
    { value: '', label: 'All SubCategories' }, // Add this line
    ...(
      Array.isArray(subs)
        ? subs.map((sub) => ({
            value: String(sub.id),
            label: `${sub.name}`, 

          }))
        : []
    ),
  ];

  const selectedSubcategoryOption = subcategoryOptions.find(
    (option) => Number(option.value) === subid
  ) ;


const taggOptions = taggs.map((tagg) => ({
  value: String(tagg.id), // MUST BE STRING
  label: tagg.name,
}));


  const checkNameAvailability = (id: string, name: string, catid: string, subid: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = window.setTimeout(async () => {
      if (!name || !catid || !subid) return;

      try {
        const res = await axiosInstance.post(
          '/prods/check-name-edit',
          { id, name, catid, subid },
          { withCredentials: true }
        );

        const available = !res.data.exists;
        setProdAvailable(available);
        setButtonDisabled(!available);
      } catch (err) {
        console.error('check failed:', err);
        setProdAvailable(null);
      }
    }, 500);
  };



  return (
    
<>

    <div className="w-full p-3 bg-gray-100 mb-4">
      <p className = "mt-3 block text-sm">

        <NavLink
          to={`/superadmin/prods/view`}
          className=" text-blue-500 hover:underline font-bold text-sm"
        >
          &rsaquo; View Products 
        </NavLink> 

      </p>
    </div>

      
      <div className="p-4 rounded border border-gray-200 w-full max-w-3xl mx-auto">
        <h4 className="font-medium text-1xl">Add product</h4>
        <form onSubmit={handleSubmit}>
          <div className="mt-4 grid lg:grid-cols-1 gap-4 w-full">

            <div className="flex justify-between gap-3 mb-4">

              <div className="w-1/2">
                  <label>Category: {catid} 
                    {selectedCategoryOption?.label} </label>
                  <Select
                    options={categoryOptions}
                    value={selectedCategoryOption}
                    onChange={(selectedOption) => {
                      const value = selectedOption?.value || '';
                      setCatid(value);
                      handleCatChange(value);
                      handleChange({ target: { name: 'catid', value } });

                      if (formData.name.trim() !== '' && formData.subid) {
                        checkNameAvailability(id ,formData.name.trim(), value, formData.subid);
                      }
                    }}
                    placeholder="Select a category..."
                    isSearchable={true}
                    className="w-85"
                    classNamePrefix="react-select"
                  />
 
                </div>

         {!catid ? (
            <p className="text-gray-600 italic">Select a category to add a subcategory.</p>
            ) : (
                <div className="w-1/2">
                  <label>SubCategory:
                {subid} 

                  </label>

                  <Select
                    options={subcategoryOptions}
                    value={selectedSubcategoryOption}
                    onChange={(selectedOption) => {
                      const value = selectedOption?.value || '';
                      setSubid(value);
                      handleChange({ target: { name: 'subid', value } });

                      if (formData.name.trim() !== '' && formData.catid) {
                        checkNameAvailability(id, formData.name.trim(), formData.catid, value);
                      }
                    }}
                    placeholder="Select a Subcategory..."
                    isSearchable={true}
                    className="w-75"
                    classNamePrefix="react-select"
                  />

                </div>
            ) }

          </div>

         {!catid || !subid ? (
            <p className="text-gray-600 italic">Select a category to add a subcategory.</p>
            ) : (
              
            <>
          <div>
            <label>Name:</label>
            <input
                className="bg-gray-100 border border-gray-200 rounded py-1 px-3 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
                type="text"
                required
                placeholder="Title"
                name="name"
                value={formData.name}
                disabled={!formData.catid || !formData.subid}
                onChange={(e) => {
                  handleChange(e);

                  const name = e.target.value;

                  if (debounceRef.current) clearTimeout(debounceRef.current);

                  if (formData.catid && formData.subid) {
                    debounceRef.current = window.setTimeout(() => {
                      checkNameAvailability(id, name.trim(), formData.catid, formData.subid);
                    }, 500);
                  }
                }}
              />

            {prodAvailable === false && (
              <p className="text-red-500 text-sm">Product exists in that catgeory subcategory.</p>
            )}
            {prodAvailable === true &&  (
              <p className="text-green-600 text-sm">Product available.</p>
            )}

            {errors.name && <p className="text-red-500 text-sm">{errors.name[0]}</p>}
          </div>

          <div className="w-full">
              <label>Tags:</label>

 <Select
  options={taggOptions}
  isMulti
  value={taggOptions.filter((opt) => formData.taggids.includes(opt.value))} // comparing string to string ✅
  onChange={handleTaggidsChange}
  placeholder="Tags"
  isSearchable
  className="w-[99%]"
  classNamePrefix="react-select"
/>
          </div>


          <div>
          <label>Short Description:</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            value={des} name = 'des'
             onChange={handleChange}
            placeholder="Short description..."
          />
          </div>
          
          <div>
          <label>Detailed Description </label>
            <Editor
              apiKey="wtkr004h3tlah7yljg2m1o3rg03scnqq5lg4ph3jjhg7j59t" // optional
              initialValue={dess}
              init={{
                height: 300,
                menubar: true,
                plugins: [
                  'link', 'image', 'code', 'lists', 'table', 'wordcount', 'emoticons', 'textcolor', 'charmap', 'media', 'paste'
                ],
                toolbar: `
                  undo redo | formatselect | bold italic underline strikethrough | 
                  alignleft aligncenter alignright | bullist numlist outdent indent | 
                  link image table | forecolor backcolor emoticons | code | charmap | media | wordcount
                `,
                image_advtab: true, // For better image handling in TinyMCE
                automatic_uploads: true, // Enable image upload via TinyMCE
                file_picker_types: 'image', // Allow users to pick images
                content_style: 'body { font-family: Arial, sans-serif; font-size: 14px; }', // Default content style
              }}
              onEditorChange={(content) => {
                setDess(content); // Update the dess state with content
                setFormData((prev) => ({
                  ...prev,
                  dess: content, // Update formData with new content
                }));
              }}
            />


          </div>

          
          <div>
          <label>Price:</label>
          <input
            type="number"
            min="0"
            className="w-full border rounded px-3 py-2"
            value={prix} name = 'prix'
           onChange={handleChange}
            placeholder="Optional"
          />

          </div>


        <div>
            <label>Visibility (vis):</label>
            <div className="flex gap-4">
              <label>
                <input
                  type="radio"
                  className="me-2"
                  name="vis"
                  value="1"
                  checked={vis === '1'}
                  onChange={(e) => handleChange(e)} // Use handleChange here
                /> 
                Visible
              </label>
              <label>
                <input
                  className="me-2"
                  type="radio"
                  name="vis"
                  value="0"
                  checked={vis === '0'}
                  onChange={(e) => handleChange(e)} // Use handleChange here
                /> 
                Hidden
              </label>
            </div>
          </div>


         <div>
          <label>Quantity:</label>
          <input
            type="number" name="quan"
            min="0"
            className="w-1/2 border rounded px-3 py-2 ml-2"
            value={quan}
            onChange={handleChange}
            placeholder="Enter quantity"
          />

         </div>

        <div>
          <label>Order Number:</label>
          <input
            type="number"
            name="ordd"  // This will be passed to the handleChange function
            min="0"
            className="w-1/2 border rounded px-3 py-2 ml-2"
            value={ordd}  // This should be the state you're managing
            onChange={handleChange}  // This calls handleChange
            placeholder="Order by number"
          />
        </div>


          <div>
              <label>Image: (JPG,Png,Gif only allowed)</label>
              <input
                type="file"
                name="img"
                accept=".jpg,.jpeg,.png,.gif"
                onChange={handleFileChange}
                className="bg-gray-100 border border-gray-200 rounded-lg block w-full text-sm text-gray-500 
                file:me-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold 
                file:bg-blue-600 file:text-white hover:file:bg-blue-700 
                file:disabled:opacity-50 file:disabled:pointer-events-none 
                dark:text-neutral-500 dark:file:bg-blue-500 dark:hover:file:bg-blue-400"
              />

              {imgPreview && (
                <img
                  src={imgPreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover border rounded mt-3 mb-2"
                />
              )}



              {errors.img && <p className="text-red-500 text-sm">{errors.img[0]}</p>}
            </div>
            <div>
              <label>File: (PDF, Word, Text, JPG,Png,Gif only allowed)</label>
              <input
                type="file"
                name="pdf"
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                onChange={handleFileChange}
                className="bg-gray-100 block w-full border border-gray-200 shadow-sm rounded-lg text-sm 
                focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 
                disabled:pointer-events-none dark:bg-neutral-900 
                dark:border-neutral-700 dark:text-neutral-400 
                file:bg-gray-50 file:border-0 file:me-4 file:py-3 file:px-4 
                sdark:file:bg-neutral-700 dark:file:text-neutral-400"
              />

              {pdf && (
                <div className="mt-2">
                  <a
                    href={`${publicserverpath}${pdf}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View existing file
                  </a>
                </div>
              )}




              {errors.pdf && <p className="text-red-500 text-sm">{errors.pdf[0]}</p>}
            </div>



            <div className="space-x-4 mt-3">
              <button
                type="submit"
                disabled={loading || buttonDisabled}  

                className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 active:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Update'}
              </button>
            </div>


          </>

         )} 
           
    

          </div>

        </form>
      </div>
    </>



  )
}

export default EditSuperAdminProductPage