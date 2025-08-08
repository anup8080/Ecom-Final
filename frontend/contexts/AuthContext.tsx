import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

// Representation of an authenticated user.  The backend now returns a
// `role` field instead of `isAdmin`.  Additional fields like
// `verified` may be present.  Future social auth providers could
// extend this type with optional properties.
interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  verified?: boolean;
}

interface AuthContextProps {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; phone?: string; role?: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

/**
 * Provides authentication state and helper methods to descendents.
 * Tokens and user details are persisted in localStorage so that
 * page reloads retain login state.  Axios is configured to
 * automatically include the bearer token in subsequent requests.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialise auth state from localStorage
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await axios.post('/api/auth/login', { email, password });
    const { token: receivedToken, user: receivedUser } = response.data;
    setToken(receivedToken);
    setUser(receivedUser);
    // Persist to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', receivedToken);
      localStorage.setItem('user', JSON.stringify(receivedUser));
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${receivedToken}`;
  };

  const register = async (data: { name: string; email: string; password: string; phone?: string }) => {
    const response = await axios.post('/api/auth/register', data);
    const { token: receivedToken, user: receivedUser } = response.data;
    setToken(receivedToken);
    setUser(receivedUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', receivedToken);
      localStorage.setItem('user', JSON.stringify(receivedUser));
    }
    axios.defaults.headers.common['Authorization'] = `Bearer ${receivedToken}`;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};