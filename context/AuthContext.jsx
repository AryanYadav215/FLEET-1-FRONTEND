import { createContext, useContext, useState } from 'react';
import { API_BASE } from '../config';

const TOKEN_KEY = 'fleet1_token';
const USER_KEY = 'fleet1_user';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));

  const saveAuth = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);

    if (authToken) localStorage.setItem(TOKEN_KEY, authToken);
    else localStorage.removeItem(TOKEN_KEY);

    if (userData) localStorage.setItem(USER_KEY, JSON.stringify(userData));
    else localStorage.removeItem(USER_KEY);
  };

  const login = async (email, password, role) => {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || 'Login failed');

    const token = data.token || data.access_token;
    const userData = data.user || data;

    const finalUser = {
      ...userData,
      role: userData.role || role,
    };

    saveAuth(finalUser, token);

    return finalUser;
  };

  const signup = async (data) => {
    const res = await fetch(`${API_BASE}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        company: data.company,
        company_name: data.company,
      }),
    });

    const json = await res.json();

    if (!res.ok) throw new Error(json.message || 'Signup failed');

    return await login(data.email, data.password, data.role);
  };

  const logout = () => {
    saveAuth(null, null);
  };

  const getAuthHeaders = () => {
    const t = localStorage.getItem(TOKEN_KEY);

    return {
      'Content-Type': 'application/json',
      ...(t ? { Authorization: `Bearer ${t}` } : {}),
    };
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, getAuthHeaders }}>
      {children}
    </AuthContext.Provider>
  );
}