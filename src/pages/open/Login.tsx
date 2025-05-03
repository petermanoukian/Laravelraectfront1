// src/pages/Login.tsx
import { useState , useEffect } from 'react';
import axiosInstance from '../../lib/axios';
import { useNavigate } from 'react-router-dom';
import GuestLayout from '../../layouts/GuestLayout';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff } from 'lucide-react'; 

function Login() {
  const { isAuthenticated, user, setUser } = useAuth();
  const navigate = useNavigate(); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect to role-based dashboard
      if (user.role === 'superadmin') navigate('/superadmin');
      else if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'user') navigate('/user');
      else navigate('/user');
    }
  }, [isAuthenticated, user, navigate]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      const response = await axiosInstance.post('/login', {
        email,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true, 
      });
  
      const { token, user } = response.data;
      
      if (rememberMe) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('authUser', JSON.stringify(user));
      } else {
        sessionStorage.setItem('authToken', token);
        sessionStorage.setItem('authUser', JSON.stringify(user));
      }
      

      const storedToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      if (storedToken) {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      }

     
      setUser(user); // ✅ central state update
      console.log('FULL RESPONSE:', response.data);
      
      switch (user.role) {
        case 'superadmin':
          navigate('/superadmin');
          break;
        case 'admin':
          navigate('/admin');
          break;
        case 'user':
          navigate('/user');
          break;
        default:
          navigate('/');

          break;
      }

  
      // TODO: Redirect or update your app state
    } catch (err: any) {
      const message = err.response?.data?.message || 'Login failed.';
      setError(message);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <>
    <GuestLayout>
 
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        
       

        <form onSubmit={handleSubmit} className="space-y-1">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-1 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>


          <div className="mt-3 relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:ring-1 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 mt-[10px] text-gray-500"
                tabIndex={-1}
              >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>



          </div>


          <div className="mt-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              Remember Me
            </label>
        </div>



          <div className = 'mt-3'>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          </div> 
        </form>




    </GuestLayout>
    </>
  );
}

export default Login;

