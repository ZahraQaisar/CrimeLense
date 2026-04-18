import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/predictionService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user,            setUser]            = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading,       setIsLoading]       = useState(true);

  // ── Restore session on mount ────────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem('cl_token');
    const cached = localStorage.getItem('cl_user');

    if (token && cached) {
      try {
        const parsed = JSON.parse(cached);
        setUser(parsed);
        setIsAuthenticated(true);
      } catch (_) {}

      // Verify token is still valid against the server
      authService.me()
        .then(({ user: freshUser }) => {
          setUser(freshUser);
          setIsAuthenticated(true);
          localStorage.setItem('cl_user', JSON.stringify(freshUser));
        })
        .catch(() => {
          // Token expired or invalid — clear everything
          localStorage.removeItem('cl_token');
          localStorage.removeItem('cl_user');
          setUser(null);
          setIsAuthenticated(false);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  // ── Login ────────────────────────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    const { token, user: userData } = await authService.login(email, password);
    localStorage.setItem('cl_token', token);
    localStorage.setItem('cl_user',  JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
    return userData;
  }, []);

  // ── Register ─────────────────────────────────────────────────────────────────
  const register = useCallback(async (name, email, password) => {
    const { token, user: userData } = await authService.register(name, email, password);
    localStorage.setItem('cl_token', token);
    localStorage.setItem('cl_user',  JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
    return userData;
  }, []);

  // ── Logout ───────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem('cl_token');
    localStorage.removeItem('cl_user');
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  // ── Update local user data ────────────────────────────────────────────────────
  const updateUser = useCallback((updates) => {
    setUser(prev => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('cl_user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
