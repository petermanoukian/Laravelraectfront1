// src/axiosSetup.ts
import axios from 'axios';

// Check if token exists in localStorage or sessionStorage and set it in axios
const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}
