import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiLogin } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for active session
    const sessionToken = localStorage.getItem('subi_auth_session');
    if (sessionToken) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (password) => {
    const res = await apiLogin(password);
    if (res.success) {
      localStorage.setItem('subi_auth_session', res.token || 'subi_session_active');
      setIsAuthenticated(true);
      return { success: true };
    } else {
      return { success: false, message: res.message || 'Invalid password' };
    }
  };

  const logout = () => {
    localStorage.removeItem('subi_auth_session');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
