import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('rv_fitness_token');
    const savedUser = localStorage.getItem('rv_fitness_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        // Verify with server
        api.get('/auth/me')
          .then((res) => {
            if (res.data.success) {
              const freshUser = { ...JSON.parse(savedUser), ...res.data.user };
              setUser(freshUser);
              localStorage.setItem('rv_fitness_user', JSON.stringify(freshUser));
            }
          })
          .catch(() => {
            // Handled by Axios interceptor if 401
          })
          .finally(() => setLoading(false));
      } catch (e) {
        localStorage.removeItem('rv_fitness_token');
        localStorage.removeItem('rv_fitness_user');
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    let res;
    try {
      res = await api.post('/auth/login', { email, password });
    } catch (err) {
      if (err.response && err.response.status === 404) {
        res = await api.post('/login', { email, password });
      } else {
        throw err;
      }
    }
    if (res.data.success) {
      const { token: newToken, user: newUser } = res.data;
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('rv_fitness_token', newToken);
      localStorage.setItem('rv_fitness_user', JSON.stringify(newUser));
      return newUser;
    }
    throw new Error(res.data.message || 'Login failed');
  };

  const register = async (formData) => {
    let res;
    try {
      res = await api.post('/auth/register', formData);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        res = await api.post('/register', formData);
      } else {
        throw err;
      }
    }
    if (res.data.success) {
      const { token: newToken, user: newUser, membership, invoice } = res.data;
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('rv_fitness_token', newToken);
      localStorage.setItem('rv_fitness_user', JSON.stringify(newUser));
      return { user: newUser, message: res.data.message, membership, invoice };
    }
    throw new Error(res.data.message || 'Registration failed');
  };

  const logout = () => {
    localStorage.removeItem('rv_fitness_token');
    localStorage.removeItem('rv_fitness_user');
    setToken(null);
    setUser(null);
    window.location.href = '/login';
  };

  const updateUser = (updatedFields) => {
    const updated = { ...user, ...updatedFields };
    setUser(updated);
    localStorage.setItem('rv_fitness_user', JSON.stringify(updated));
  };

  const isAdmin = user?.role === 'admin';
  const isTrainer = user?.role === 'trainer';
  const isMember = user?.role === 'member';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAdmin,
        isTrainer,
        isMember
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
