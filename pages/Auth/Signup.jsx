import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const roleRedirects = {
  manufacturer: '/manufacturer/dashboard',
  transporter: '/transporter/dashboard',
  operations: '/operations/dashboard',
  admin: '/admin/users',
};

export default function Signup() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    company: '',
    role: 'manufacturer',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 🔥 signup now also logs in user
      const user = await signup(form);

      // 🔥 redirect to correct dashboard
      navigate(roleRedirects[user.role] || '/login');
    } catch (err) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Create Account</h1>
        <p>Register for Logistics Aggregator ERP</p>

        {error && (
          <p style={{ color: 'var(--color-error, #c00)', fontSize: '14px', marginBottom: '8px' }}>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter full name"
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@company.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Create password"
              required
            />
          </div>

          <div className="form-group">
            <label>Company Name</label>
            <input
              name="company"
              value={form.company}
              onChange={handleChange}
              placeholder="Your company name"
              required
            />
          </div>

          <div className="form-group">
            <label>Register As</label>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="manufacturer">Manufacturer</option>
              <option value="transporter">Transporter</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            style={{ marginTop: '8px' }}
            disabled={loading || !form.email || !form.password || !form.name}
          >
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '16px', marginBottom: 0 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 500 }}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}