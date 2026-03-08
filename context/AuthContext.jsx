import { createContext, useContext, useState } from 'react';
import { users } from '../data/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (email, password, role) => {
    // Mock login - find user by role or create mock session
    const found = users.find(u => u.role === role) || {
      id: 99,
      name: 'Test User',
      email,
      role,
      company: 'Test Company',
    };
    setUser({ ...found, email });
    return found;
  };

  const signup = (data) => {
    const newUser = {
      id: users.length + 1,
      name: data.name,
      email: data.email,
      role: data.role,
      company: data.company,
      status: 'active',
    };
    users.push(newUser);
    return newUser;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
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
