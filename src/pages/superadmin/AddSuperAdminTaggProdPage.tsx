//AddSuperAdminTaggProdPage.tsx

import React, { useEffect, useRef, useState} from 'react';
import { useNavigate , useSearchParams , useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axiosInstance from '../../lib/axios';
import { NavLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Select from 'react-select';

type Prod = {
  id: number;
  name: string;
};

type Tagg = {
  id: number;
  name: string;
};

const AddSuperAdminTaggProdPage = () => {

  const { prodid : prodid1} = useParams();  
  const [prodid, setProdid] = useState<string>(prodid1 || '');
  const { taggid : taggid1} = useParams();  
  const [taggid, setTaggid] = useState<string>(taggid1 || '');
  const navigate = useNavigate();
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
  const { user, setUser, isAuthenticated } = useAuth();
  const [taggs, setTaggs] = useState<Tagg[]>([]);
  const [prods, setProds] = useState<Prod[]>([]);
  const [prodName, setProdName] = useState<string | null>(null);
  const [taggName, setTaggName] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({}); 
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const [prodids, setProdids] = useState<number[]>([]);
  const [taggids, setTaggids] = useState<number[]>([]);

  const [formData, setFormData] = useState({
    prodids: prodid ? [parseInt(prodid)] : [],
    taggids: taggid ? [parseInt(taggid)] : [],
  });


  useEffect(() => {
    if (prodid) {
      setFormData((prev) => ({
        ...prev,
        prodids: [parseInt(prodid)],
      }));
    }

    if (taggid) {
      setFormData((prev) => ({
        ...prev,
        taggids: [parseInt(taggid)],
      }));
    }
  }, [prodid, taggid]);

  useEffect(() => {
    
    const fetchTaggprods = async () => {
    const url = `/superadmin/prodtagg/add/${prodid || 0}/${taggid || 0}`;

    try {
      const response = await axiosInstance.get(url, {});
      console.log('Fetched:', response.data.prods);
      setProds(response.data.prods);
      setProdName(response.data?.prodName ?? null); 
      console.log('Prod name:', response.data.prodName);

      console.log('Fetched:', response.data.taggs);
      setTaggs(response.data.taggs);
      setTaggName(response.data?.taggName ?? null); 
      console.log('Tag name:', response.data.taggName);


    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  fetchTaggprods();
}, [prodid, taggid]);


// Ordinary HTML <select multiple>
  const handleArraySelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, options } = e.target;

    const selectedValues = Array.from(options)
      .filter((opt) => opt.selected)
      .map((opt) => parseInt(opt.value));

    if (name === 'prodids') {
      setProdids(selectedValues);
      setFormData((prev) => ({ ...prev, prodids: selectedValues }));
    }

    if (name === 'taggids') {
      setTaggids(selectedValues);
      setFormData((prev) => ({ ...prev, taggids: selectedValues }));
    }

    setButtonDisabled(false);
    setErrors({});
  };


// Searchable multi-select via react-select
  type OptionType = { value: number; label: string };

  const handleReactSelectMulti = (
    selected: OptionType[] | null,
    name: 'prodids' | 'taggids'
  ) => {
    const selectedValues = selected ? selected.map((opt) => opt.value) : [];

    if (name === 'prodids') {
      setProdids(selectedValues);
      setFormData((prev) => ({ ...prev, prodids: selectedValues }));
    }

    if (name === 'taggids') {
      setTaggids(selectedValues);
      setFormData((prev) => ({ ...prev, taggids: selectedValues }));
    }

    setButtonDisabled(false);
    setErrors({});
  };





  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const newErrors: { [key: string]: string[] } = {};

    if (prodids.length === 0) newErrors.prodids = ['At least one product is required.'];
    if (taggids.length === 0) newErrors.taggids = ['At least one tag is required.'];

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    const prodData = new FormData();

    // Append each item properly for Laravel to treat them as arrays
    prodids.forEach((id) => prodData.append('prodids[]', id.toString()));
    taggids.forEach((id) => prodData.append('taggids[]', id.toString()));

    try {
      await axiosInstance.post('/superadmin/prodtaggs/add', prodData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Redirect based on presence of prodid or taggid
      let redirectUrl = '/superadmin/viewtaggprod/view';
      if (prodid) redirectUrl += `/${prodid}`;
      if (taggid) redirectUrl += prodid ? `/${taggid}` : `//${taggid}`;
      navigate(redirectUrl);

    } catch (error: any) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors || {});
      } else {
        console.error('Failed to create tag-product relation:', error);
      }
    } finally {
      setLoading(false);
    }
  };


  const prodOptions = prods.map((p) => ({ value: p.id, label: p.name }));
  const taggOptions = taggs.map((t) => ({ value: t.id, label: t.name }));

  const sortedProds = [...prods].sort((a, b) => {
    const aSelected = formData.prodids.includes(a.id) ? 0 : 1;
    const bSelected = formData.prodids.includes(b.id) ? 0 : 1;
    return aSelected - bSelected;
  });

  const sortedTaggs = [...taggs].sort((a, b) => {
    const aSelected = formData.taggids.includes(a.id) ? 0 : 1;
    const bSelected = formData.taggids.includes(b.id) ? 0 : 1;
    return aSelected - bSelected;
  });

  return (
   

<>

      <div className="w-full p-3 bg-gray-100 mb-4">
        <p className = "mt-3 block text-sm">


        <NavLink
          to={`/superadmin/viewtaggprod/view${prodid ? `/${prodid}` : '/0'}${taggid ? `/${taggid}` : '/0'}`}
          className="ml-1 text-blue-500 hover:underline font-bold text-sm"
        >
          &rsaquo; View Tags and Product {prodName ? `Belonging to ${prodName}` : ''}
          {taggName ? `Belonging to ${taggName}` : ''}
        </NavLink>
        </p>
      </div>

      <div className="p-8 rounded border border-gray-200 w-full max-w-3xl mx-auto">
        <h2 className="font-medium text-3xl">Add Tags to Products</h2>
        <form onSubmit={handleSubmit}>
          <div className="mt-2 grid lg:grid-cols-1 gap-4 w-full">

            <div>
            <label>Products:</label>
            <Select
                isMulti
                name="prodids"
                options={prodOptions}
                value={prodOptions.filter(opt => formData.prodids.includes(opt.value))}
                onChange={(selected) => handleReactSelectMulti(selected, 'prodids')}
              />

          <select
              id="prodids"
              multiple
              name="prodids"
              value={formData.prodids}
              onChange={handleArraySelectChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
             {sortedProds.map((prod) => (
                <option key={prod.id} value={prod.id}>
                  {prod.name}
                </option>
              ))}
            </select>
            {errors.prodids && <p className="text-red-500 text-sm">{errors.prodids.join(', ')}</p>}

           
            </div>


            <div>
            <label>Tags:</label>

                <Select
                  isMulti
                  name="taggids"
                  options={taggOptions}
                    value={taggOptions.filter(opt => formData.taggids.includes(opt.value))}

                  onChange={(selected) => handleReactSelectMulti(selected, 'taggids')}
                />


                <select
                    multiple
                    name="taggids"
                    value={formData.taggids}
                    onChange={handleArraySelectChange}
                                 className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"

                  >
                    {sortedTaggs.map((tagg) => (
                      <option key={tagg.id} value={tagg.id}>
                        {tagg.name}
                      </option>
                    ))}
        
                  </select>
                  {errors.taggids && <p className="text-red-500 text-sm">{errors.taggids.join(', ')}</p>}
           
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






  )
}

export default AddSuperAdminTaggProdPage