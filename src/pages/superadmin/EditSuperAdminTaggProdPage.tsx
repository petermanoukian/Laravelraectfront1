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

  

  const [formData, setFormData] = useState({
    prodids: prodid ? [parseInt(prodid)] : [],
    taggids: taggid ? [parseInt(taggid)] : [],
  });

  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [loading, setLoading] = useState(false);
    


  return (
    <div>EditSuperAdminTaggProdPage</div>
  )
}

export default EditSuperAdminTaggProdPage