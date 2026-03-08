import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Signup() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    company: '',
    role: 'manufacturer',
  });
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(form);
    alert('Account created! Please login.');
    navigate('/login');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Create Account</h1>
        <p>Register for Logistics Aggregator ERP</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Enter full name" required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@company.com" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Create password" required />
          </div>
          <div className="form-group">
            <label>Company Name</label>
            <input name="company" value={form.company} onChange={handleChange} placeholder="Your company name" required />
          </div>
          <div className="form-group">
            <label>Register As</label>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="manufacturer">Manufacturer</option>
              <option value="transporter">Transporter</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '8px' }}>
            Create Account
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '16px', marginBottom: 0 }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 500 }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}
