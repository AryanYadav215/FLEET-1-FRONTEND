import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const roleRedirects = {
  manufacturer: '/manufacturer/dashboard',
  transporter: '/transporter/dashboard',
  operations: '/operations/dashboard',
  admin: '/admin/users',
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('manufacturer');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password, role);
    navigate(roleRedirects[role]);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Welcome Back</h1>
        <p>Sign in to Logistics Aggregator ERP</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>
          <div className="form-group">
            <label>Login As</label>
            <select value={role} onChange={e => setRole(e.target.value)}>
              <option value="manufacturer">Manufacturer</option>
              <option value="transporter">Transporter</option>
              <option value="operations">Operations Team</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '8px' }}>
            Sign In
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '16px', marginBottom: 0 }}>
          Don't have an account? <Link to="/signup" style={{ color: 'var(--color-primary)', fontWeight: 500 }}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
