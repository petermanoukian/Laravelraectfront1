// AddSuperAdminProductPage.tsx


import React, { useEffect, useRef, useState} from 'react';
import { useNavigate , useSearchParams , useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axiosInstance from '../../lib/axios';
import { NavLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Select from 'react-select';
import { Editor } from '@tinymce/tinymce-react';


  type Cat = 
  {
    id: number;
    name: string;
    subcats_count: number;
    catprods_count: number;
  }; 

  type Subcat = {
    id: number;
    catid: number;
    name: string;
    subprods_count: number;
  };

  type Tagg = 
  {
    id: number;
    name: string;
  }; 

  type OptionType = {
  value: string;
  label: string;
  isDisabled: boolean;
  };

  const AddSuperAdminProductPage = () => {
  const debounceRef = useRef<number | null>(null);
  const {categoryid: categoryid1, subcategoryid: subcategoryid1 } = useParams();
  const [categoryid, setCategoryid] = useState<string>(categoryid1 || '');
  const [subcategoryid, setSubcategoryid] = useState<string>(subcategoryid1 || '');
  const [categoryName, setCategoryName] = useState<string>('');
  const [subcategoryName, setSubcategoryName] = useState<string>('');

  const [des, setDes] = useState('');
  const [, setDess] = useState(''); 
  const [prix, setPrix] = useState(1); 
  const [vis, setVis] = useState('1');  
  const [quan, setQuan] = useState(1);  
  const [ordd, setOrdd] = useState(1);
  const [imgPreview, setImgPreview] = useState<string | null>(null);

  // You might also want to log state to check the flow
  useEffect(() => {
    //console.log('categoryid1 from useParams:', categoryid1);
   // console.log('subcategoryid1 from useParams:', subcategoryid1);

    if (categoryid1) {
      setCategoryid(categoryid1);
    }

    if (subcategoryid1) {
      setSubcategoryid(subcategoryid1);
    }

  }, [categoryid1, subcategoryid1]);

  // Log for debugging
  //console.log('categoryid state:', categoryid);
  //console.log('subcategoryid state:', subcategoryid);


  const [formData, setFormData] = useState<{
    name: string;
    catid: string;
    subid: string;
    quan: number;
    ordd: number;
    vis: string;
    prix: number;
    des: string;
    dess: string;
    img: File | null;
    pdf: File | null;
    taggids: number[];
  }>({
    name: '',
    catid: categoryid || '',
    subid: subcategoryid || '',
    quan: 1,
    ordd: 1,
    vis: '1',   
    prix: 1,
    des: '',
    dess: '',
    img: null,
    pdf: null,
    taggids: [],
  });

  useEffect(() => {
    setCategoryid(categoryid1 || '');
    setFormData((prev) => ({ ...prev, catid: categoryid1 || '' }));
  }, [categoryid1]);


  useEffect(() => {
    setSubcategoryid(subcategoryid1 || '');
    setFormData((prev) => ({ ...prev, subid: subcategoryid1 || '' }));
  }, [subcategoryid1]);


  const navigate = useNavigate();

  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
  //const { user, setUser, isAuthenticated } = useAuth();
  const [,setName] = useState<string>('');
  const [cats, setCats] = useState<Cat[]>([]);
  const [subcats, setSubCats] = useState<Subcat[]>([]);
  const [prodAvailable, setProdAvailable] = useState<boolean | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({}); 
  const [loading, setLoading] = useState(false);
  //const { currentUser } = useAuth();
  const [, setImg] = useState<File | null>(null);
  const [, setPdf] = useState<File | null>(null);
  const [taggs, setTaggs] = useState<Tagg[]>([]);
  const [, setTaggids] = useState<number[]>([]);


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
          setCategoryid(value);
        }

        if (name === 'subid') {
          setSubcategoryid(value);
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

        setCategoryid(value);
        setSubcategoryid(value);
        

        setFormData((prev) => ({
          ...prev,
          catid: value,
          subid: value,
        }));


        setButtonDisabled(false);
        setErrors({});
      }
    };

    const handleTaggidsChange = (selectedOptions: any) => {
      const tagids = selectedOptions ? selectedOptions.map((opt: any) => opt.value) : [];

      setTaggids(tagids);

      setFormData((prev) => ({
        ...prev,
        taggids: tagids,
      }));
    };



    useEffect(() => {
    
    const fetchAddData = async () => {

    let url = '/superadmin/prod/add';

    if (categoryid) {
      url += `/${categoryid}`;
    }

    if (subcategoryid) {
      url += `/${subcategoryid}`;
    }


      try {
        const response = await axiosInstance.get(url, {
        
        });
        //console.log('Fetched cats:', response.data.cats);
        //console.log('Fetched subcats:', response.data.subs);
        setCats(response.data.cats);  
        setSubCats(response.data.subs);
        setTaggs(response.data.taggs);  
        //setCategoryid(response.data.catid || ''); // Set default category
        //setSubcategoryid(response.data.subid || ''); // Set default subcategory
        setCategoryName(response.data.category_name || ''); // Set default category name
        setSubcategoryName(response.data.subcategory_name || ''); // Set default subcategory name
        //console.log('Fetched category name:', response.data.category_name);
        //console.log('Fetched subcategory name:', response.data.subcategory_name);
        
      } catch (error) {
        console.error('Error fetching :', error);
      }
    };
  
    fetchAddData();
  }, [ categoryid , subcategoryid]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
  
    const newErrors: { [key: string]: string[] } = {};

    if (!formData.name.trim()) newErrors.name = ['Name is required.'];
    else if (formData.name.length > 255) newErrors.name = ['Name must be under 255 characters.'];
  
    if (!formData.catid.trim()) newErrors.name = ['Category is required.'];
    if (!formData.subid.trim()) newErrors.name = ['SubCategory is required.'];


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
    prodData.append('catid', formData.catid);
    prodData.append('subid', formData.subid);
    formData.taggids.forEach((id) => {
      prodData.append('taggids[]', id.toString());
    });
    prodData.append('vis', formData.vis);
    prodData.append('quan', formData.quan.toString());
    prodData.append('prix', formData.prix.toString());
    prodData.append('des', formData.des);
    prodData.append('dess', formData.dess);
    prodData.append('ordd', formData.ordd.toString());
    if (formData.img) prodData.append('img', formData.img);
    if (formData.pdf) prodData.append('pdf', formData.pdf);
    console.log('Form data:', prodData);
    console.log('Form data:', formData);

    try {
      await axiosInstance.post('/superadmin/prod/add', prodData, {
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
    // If there are any validation errors or email is unavailable, disable the button
    if (Object.keys(errors).length > 0 || prodAvailable === false) {
      setButtonDisabled(true);
    } else {
      setButtonDisabled(false);  // Enable the button if there are no errors and email is available
    }
  }, [errors, prodAvailable]);

  useEffect(() => {
    if (!formData.catid) {
      setProdAvailable(null); // Or null if you want no message
      setFormData((prev) => ({
        ...prev,
        name: '', // Optional: clear the name field too
      }));
      setButtonDisabled(true); // Disable submit
    }
  }, [formData.catid]);

  useEffect(() => {
    if (!formData.subid) {
      setProdAvailable(null); // Or null if you want no message
      setFormData((prev) => ({
        ...prev,
        name: '', // Optional: clear the name field too
      }));
      setButtonDisabled(true); // Disable submit
    }
  }, [formData.subid]);


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

    URL.createObjectURL(file);
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
    { value: '', label: 'All Categories', isDisabled: false }, // Add this line
    ...(
      Array.isArray(cats)
        ? cats.map((cat) => ({
            value: String(cat.id),
            label: `${cat.name}-(${cat.subcats_count}Subcategories-${cat.catprods_count} Items)`,
            isDisabled: false,
          }))
        : []
    ),
  ]; 

  const selectedCategoryOption = categoryid
  ? categoryOptions.find((option) => option.value === categoryid) || null
  : null;


  const subcategoryOptions: OptionType[] = [
    { value: '', label: 'All SubCategories' , isDisabled: true}, // Add this line
    ...(
      Array.isArray(subcats)
        ? subcats.map((sub) => ({
            value: String(sub.id),
             isDisabled: false ,
            label: `${sub.name}-(${sub.subprods_count} Items)`, 
            subprods_count: sub.subprods_count, 
          }))
        : []
    ),
  ];

  const selectedSubcategoryOption = subcategoryid
  ? subcategoryOptions.find((option) => option.value === subcategoryid) || null
  : null;

  const taggOptions: OptionType[] = [
     { value: '', label: 'Tags', isDisabled: true },
    ...(
      Array.isArray(taggs)
        ? taggs.map((tagg) => ({
            value: String(tagg.id),
            label: `${tagg.name}`,
            isDisabled: false, 
          }))
        : []
    ),
  ];


  const checkNameAvailability = (name: string, catid: string, subid: string) => {
  if (debounceRef.current) clearTimeout(debounceRef.current);

  debounceRef.current = window.setTimeout(async () => {
    if (!name || !catid || !subid) return;

    try {
      const res = await axiosInstance.post(
        '/prods/check-name',
        { name, catid, subid },
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
          to={`/superadmin/prods/view${categoryid ? `/${categoryid}` : ''}${subcategoryid ? `/${subcategoryid}` : ''}`}
          className=" text-blue-500 hover:underline font-bold text-sm"
        >
          &rsaquo; View Products {categoryName ? ` | ${categoryName}` : ''}
           {subcategoryName ? ` | ${subcategoryName}` : ''}
        </NavLink> 

      </p>
    </div>

      
      <div className="p-4 rounded border border-gray-200 w-full max-w-3xl mx-auto">
        <h4 className="font-medium text-1xl">Add product</h4>
        <form onSubmit={handleSubmit}>
          <div className="mt-4 grid lg:grid-cols-1 gap-4 w-full">

            <div className="flex justify-between gap-3 mb-4">

              <div className="w-1/2">
                  <label>Category:</label>

                  <Select
                    options={categoryOptions}
                    value={selectedCategoryOption}
                    onChange={(selectedOption) => {
                      const value = selectedOption?.value || '';
                      setCategoryid(value);
                      handleChange({ target: { name: 'catid', value } });

                      if (formData.name.trim() !== '' && formData.subid) {
                        checkNameAvailability(formData.name.trim(), value, formData.subid);
                      }
                    }}
                    placeholder="Select a category..."
                    isSearchable={true}
                    className="w-85"
                    classNamePrefix="react-select"
                  />

 
                </div>


                <div className="w-1/2">
                  <label>SubCategory:</label>

                  <Select
                    options={subcategoryOptions}
                    value={selectedSubcategoryOption}
                    onChange={(selectedOption) => {
                      const value = selectedOption?.value || '';
                      setSubcategoryid(value);
                      handleChange({ target: { name: 'subid', value } });

                      if (formData.name.trim() !== '' && formData.catid) {
                        checkNameAvailability(formData.name.trim(), formData.catid, value);
                      }
                    }}
                    placeholder="Select a Subcategory..."
                    isSearchable={true}
                    className="w-75"
                    classNamePrefix="react-select"
                  />

                </div>

          </div>

         {!formData.catid || !formData.subid ? (
            <p className="text-gray-600 italic">Select a category to add a subcategory.</p>
            ) : (
            <>
          <div>
            <label>Name:</label>
            <input
                className=" border border-gray-200 rounded py-1 px-3 block focus:ring-blue-500 focus:border-blue-500 text-gray-700 w-full"
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
                      checkNameAvailability(name.trim(), formData.catid, formData.subid);
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
               onChange={handleTaggidsChange}
                placeholder="Tags."
                isSearchable={true}
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
              initialValue=""
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
              {errors.pdf && <p className="text-red-500 text-sm">{errors.pdf[0]}</p>}
            </div>



            <div className="space-x-4 mt-3">
              <button
                type="submit"
                disabled={loading || buttonDisabled}  

                className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 active:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Add'}
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

export default AddSuperAdminProductPage