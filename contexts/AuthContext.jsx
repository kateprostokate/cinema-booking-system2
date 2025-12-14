import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/api';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem('isAdmin') === 'true');
  const [authError, setAuthError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    sessionStorage.setItem('isAdmin', String(isAdmin));
  }, [isAdmin]);

  const login = useCallback(async (params) => {
    try {
      setAuthError(null);
      await ApiService.login(params);
      setIsAdmin(true);
      navigate('/admin');
    } catch (e) {
      setAuthError(e.message);
      console.error('Login failed:', e);
    }
  }, [navigate]);

  const logout = useCallback(() => {
    setIsAdmin(false);
    navigate('/admin/login');
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout, authError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
