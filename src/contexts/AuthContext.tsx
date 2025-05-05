// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axiosInstance from '../lib/axios';

type User = {
  id: number;
  name: string;
  email: string;
  role: 'superadmin' | 'admin' | 'user';
  img?: string | null;
  pdf?: string | null;
};

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

    if (token) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      axiosInstance
        .get('/user', { withCredentials: true })
        .then(res => {
          // Extract first role from Spatie response
          const role = res.data.roles?.[0]?.name ?? 'user';

          const authUser: User = {
            id: res.data.id,
            name: res.data.name,
            email: res.data.email,
            role: role as User['role'],
          };

          setUser(authUser);

          // Optionally update storage with refreshed user info
          localStorage.setItem('authUser', JSON.stringify(authUser));
        })
        .catch(err => {
          console.error('Failed to fetch authenticated user:', err);
          setUser(null);
          localStorage.removeItem('authUser');
          localStorage.removeItem('authToken');
          delete axiosInstance.defaults.headers.common['Authorization'];
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const value = {
    user,
    setUser,
    isAuthenticated: !!user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
