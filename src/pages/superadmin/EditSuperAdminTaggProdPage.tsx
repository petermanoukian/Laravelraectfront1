//EditSuperAdminTaggProdPage.tsx
import React, { useState, useEffect, useRef, useCallback , useMemo  } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axiosInstance from '../../lib/axios';
import Select from 'react-select';
import { useLocation } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

type Prod = {
  id: number;
  name: string;
};

type Tagg = {
  id: number;
  name: string;
};

const EditSuperAdminTaggProdPage = () => {

  const navigate = useNavigate();
  const { id: id1 } = useParams<{ id: string }>();
  const id = id1 ? parseInt(id1, 10) : null;

  
  const [prodid, setProdid] = useState<number | null>(null);
  const [taggid, setTaggid] = useState<number | null>(null);
  const [prods, setProds] = useState<Prod[]>([]);
  const [taggs, setTaggs] = useState<Tagg[]>([]);
  const [relatedProdids, setRelatedProdids] = useState<number[]>([]);
  const [relatedTaggids, setRelatedTaggids] = useState<number[]>([]);
  const [prodids, setProdids] = useState<number[]>([]);
  const [taggids, setTaggids] = useState<number[]>([]);



  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [loading, setLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);  

  const [formData, setFormData] = useState<{
    prodids: number[],
    taggids: number[],
  }>({
    prodids: [],
    taggids: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/superadmin/prodtagg/edit/${id}`, { withCredentials: true });

        const {
          relatedProds,
          relatedTaggs,
          prodid,
          taggid,
          prodtagg,
          prods,
          taggs
        } = response.data;

        // Optional: You can use setProdid/taggid for form controls
        setProdid(prodid);
        setTaggid(taggid);

      setFormData({
        prodids: Array.isArray(relatedProds) ? relatedProds : [],
        taggids: Array.isArray(relatedTaggs) ? relatedTaggs : [],
      });

        setProds(prods); // dropdown options
        setTaggs(taggs);    // dropdown options
      } catch (error) {
        console.error("Error loading prodtagg edit data", error);
      }
    };

    fetchData();
  }, [id]);



  const handleChangeTraditional = (
  e: React.ChangeEvent<HTMLSelectElement>
    ) => {
      const { name, selectedOptions } = e.target;

      // Convert selectedOptions to array of numbers
      const values = Array.from(selectedOptions, (option) => Number(option.value));

      // Update formData correctly
      setFormData((prev) => ({
        ...prev,
        [name === 'prodid[]' ? 'prodids' : 'taggids']: values,
      }));

      setButtonDisabled(false);
      setErrors({});
    };

    type OptionType = { value: number; label: string };

    const handleChangeReactSelect = (
      selected: MultiValue<OptionType>,
      name: 'prodids' | 'taggids'
    ) => {
      const values = selected.map((option) => option.value);

      setFormData((prev) => ({
        ...prev,
        [name]: values,
      }));

      setButtonDisabled(false);
      setErrors({});
    };



   const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const newErrors: { [key: string]: string[] } = {};

    if (formData.prodids.length === 0) newErrors.prodids = ['At least one product is required.'];
    if (formData.taggids.length === 0) newErrors.taggids = ['At least one tag is required.'];

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    const prodData = new FormData();

    // Append each item properly for Laravel to treat them as arrays
    formData.prodids.forEach((id) => prodData.append('prodids[]', id.toString()));
    formData.taggids.forEach((id) => prodData.append('taggids[]', id.toString()));


    prodData.append('_method', 'PUT');

    try {
      await axiosInstance.post(`/superadmin/prodtagg/update/${id}`, prodData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Redirect based on presence of prodid or taggid
      //let redirectUrl = '/superadmin/viewtaggprod/view';
      //if (prodid) redirectUrl += `/${prodid}`;
      //if (taggid) redirectUrl += prodid ? `/${taggid}` : `//${taggid}`;
      navigate('/superadmin/prods/view');

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







  return (
    <>
    





      <div className="p-8 rounded border border-gray-200 w-full max-w-3xl mx-auto">
        <h2 className="font-medium text-3xl"> Tags to Products</h2>
        <form onSubmit={handleSubmit}>
          <div className="mt-2 grid lg:grid-cols-1 gap-4 w-full">

            <div>
            <label>Products:</label>

            <Select
              isMulti
              isSearchable
              name="prodids"
              options={prods.map((prod) => ({
                value: prod.id,
                label: prod.name,
              }))}
              value={formData.prodids.map((id) => {
                const prod = prods.find((p) => p.id === id);
                return prod ? { value: prod.id, label: prod.name } : null;
              }).filter(Boolean)}
              onChange={(selected) => handleChangeReactSelect(selected, 'prodids')}
            />

            
            <select
            name="prodid[]"
            multiple
            value={formData.prodids}
            onChange={handleChangeTraditional}
            className="mt-1 block w-full p-2 border border-gray-300 
            rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" >
            {prods.map((prod) => (
              <option key={prod.id} value={prod.id}>
                {prod.name}
              </option>
            ))}
          </select>




           
            </div>


            <div>
            <label>Tags:</label>



              <select
                name="taggid[]"
                multiple
                value={formData.taggids}
                onChange={handleChangeTraditional}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md 
                shadow-sm focus:ring-blue-500 focus:border-blue-500" >
                {taggs.map((tagg) => (
                  <option key={tagg.id} value={tagg.id}>
                    {tagg.name}
                  </option>
                ))}
              </select>

              <Select
                isMulti
                isSearchable
                name="taggids"
                options={taggs.map((tagg) => ({
                  value: tagg.id,
                  label: tagg.name,
                }))}
                value={formData.taggids.map((id) => {
                  const tagg = taggs.find((t) => t.id === id);
                  return tagg ? { value: tagg.id, label: tagg.name } : null;
                }).filter(Boolean)}
                onChange={(selected) => handleChangeReactSelect(selected, 'taggids')}
              />



           
            </div>




            <div className="space-x-4 mt-8">
              <button
                type="submit"
                disabled={loading || buttonDisabled}  

                className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 active:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Edit'}
              </button>
            </div>


          </div>

        </form>
      </div>





    
    </>
  
  )
}

export default EditSuperAdminTaggProdPage