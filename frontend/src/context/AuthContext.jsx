import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('arwas_world_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to load user:', error);
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    setUser({ ...userData, token });
    localStorage.setItem('arwas_world_user', JSON.stringify({ ...userData, token }));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('arwas_world_user');
    localStorage.removeItem('arwas_world_cart');
  };

  const isLoggedIn = () => !!user;

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
