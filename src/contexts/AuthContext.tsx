import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  updateUser: (userData: User) => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
  isAuthenticated: false,
  isAdmin: false,
  updateUser: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          // Set default auth header
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const res = await axios.get('http://localhost:5000/api/users/me');
          setUser(res.data);
        } catch (error) {
          console.error('Failed to fetch user:', error);
          localStorage.removeItem('token');
          setToken(null);
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });
      
      const { token: newToken, ...userData } = res.data;
      
      // Save token to localStorage
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      
      // Set auth header
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      toast.success('Login successful!');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed!';
      toast.error(message);
      throw error;
    }
  };

  // Signup function
  const signup = async (name: string, email: string, password: string) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password,
      });
      
      const { token: newToken, ...userData } = res.data;
      
      // Save token to localStorage
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(userData);
      
      // Set auth header
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      toast.success('Account created successfully!');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Signup failed!';
      toast.error(message);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    toast.success('Logged out successfully');
  };

  // Update user function
  const updateUser = (userData: User) => {
    setUser(userData);
  };

  // Computed properties
  const isAuthenticated = !!user;
  const isAdmin = user?.isAdmin || false;

  const value = {
    user,
    token,
    loading,
    login,
    signup,
    logout,
    isAuthenticated,
    isAdmin,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;