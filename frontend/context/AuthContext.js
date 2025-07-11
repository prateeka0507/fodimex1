import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to load user from token
    const currentUser = authAPI.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  // Accept either (email, password) or ({email, password})
  const login = async (emailOrObj, password) => {
    let credentials;
    if (typeof emailOrObj === 'object') {
      credentials = emailOrObj;
    } else {
      credentials = { email: emailOrObj, password };
    }
    const { user } = await authAPI.login(credentials);
    setUser(user);
    return user;
  };

  // Accept a single form object for register
  const register = async (form) => {
    const { user } = await authAPI.register(form);
    setUser(user);
    return user;
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 