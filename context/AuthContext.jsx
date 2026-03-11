import { createContext, useContext, useState } from 'react';
import { API_BASE } from '../src/config';

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
    const userData = { ...data.user, role: data.user.role || role };
    saveAuth(userData, data.token);
    return userData;
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
    return json.user;
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

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export default AuthContext;
