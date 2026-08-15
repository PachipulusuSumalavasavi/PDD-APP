import React, { createContext, useState } from 'react';
import api from '../services/api';
import { dataStore } from '../services/dataStore';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('careermate_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(false);

  const login = async (email, password, roleHint = 'student') => {
    setLoading(true);
    try {
      // Try backend API first
      const response = await api.post('/auth/login', { email, password });
      const data = response.data;
      setUser(data);
      localStorage.setItem('careermate_token', data.token);
      localStorage.setItem('careermate_user', JSON.stringify(data));
      setLoading(false);
      return { success: true, role: data.role };
    } catch (err) {
      // Dynamic DataStore fallback
      try {
        const storedUser = dataStore.loginUser(email, password);
        setUser(storedUser);
        localStorage.setItem('careermate_token', 'mock-token-123');
        localStorage.setItem('careermate_user', JSON.stringify(storedUser));
        setLoading(false);
        return { success: true, role: storedUser.role };
      } catch (dsErr) {
        setLoading(false);
        return { success: false, message: dsErr.message };
      }
    }
  };

  const register = async (formData) => {
    setLoading(true);
    let registeredUser = null;
    
    // Save to dynamic DataStore
    try {
      registeredUser = dataStore.registerUser(formData);
    } catch (e) {
      setLoading(false);
      return { success: false, message: e.message };
    }

    // Post to backend API asynchronously if active
    try {
      const response = await api.post('/auth/register', formData);
      const data = response.data;
      
      setUser(data);
      localStorage.setItem('careermate_token', data.token);
      localStorage.setItem('careermate_user', JSON.stringify(data));
      setLoading(false);
      return { success: true, role: data.role };
    } catch (e) {
      if (e.response && e.response.data && e.response.data.message) {
        setLoading(false);
        return { success: false, message: e.response.data.message };
      }
    }

    setUser(registeredUser);
    localStorage.setItem('careermate_token', 'mock-token-123');
    localStorage.setItem('careermate_user', JSON.stringify(registeredUser));
    setLoading(false);
    return { success: true, role: registeredUser.role };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('careermate_token');
    localStorage.removeItem('careermate_user');
  };

  const updateProfile = (updatedDetails) => {
    const newUser = { ...user, ...updatedDetails };
    setUser(newUser);
    localStorage.setItem('careermate_user', JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
