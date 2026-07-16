import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import api from '../api/axios.js';

const AuthContext = createContext(null);

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('bodyVisionUser')) || null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);
  const [token, setToken] = useState(localStorage.getItem('bodyVisionToken'));
  const [initializing, setInitializing] = useState(Boolean(token));

  useEffect(() => {
    const loadMe = async () => {
      if (!token) {
        setInitializing(false);
        return;
      }

      try {
        const { data } = await api.get('/auth/me');
        setUser(data.user);
        localStorage.setItem('bodyVisionUser', JSON.stringify(data.user));
      } catch {
        setUser(null);
        setToken(null);
        localStorage.removeItem('bodyVisionToken');
        localStorage.removeItem('bodyVisionUser');
      } finally {
        setInitializing(false);
      }
    };

    loadMe();
  }, [token]);

  const persistSession = (payload) => {
    if (!payload?.token || !payload?.user) {
      throw new Error('Invalid authentication response');
    }

    setUser(payload.user);
    setToken(payload.token);
    localStorage.setItem('bodyVisionToken', payload.token);
    localStorage.setItem('bodyVisionUser', JSON.stringify(payload.user));
  };

  const login = async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    persistSession(data);
    return data;
  };

  const register = async (values) => {
    const { data } = await api.post('/auth/register', values);
    persistSession(data);
    return data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('bodyVisionToken');
    localStorage.removeItem('bodyVisionUser');
  };

  const refreshUser = async () => {
    const { data } = await api.get('/auth/me');
    setUser(data.user);
    localStorage.setItem('bodyVisionUser', JSON.stringify(data.user));
    return data.user;
  };

  const value = useMemo(() => ({
    initializing,
    isAuthenticated: Boolean(token && user),
    login,
    logout,
    refreshUser,
    register,
    setUser,
    token,
    user
  }), [initializing, token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
