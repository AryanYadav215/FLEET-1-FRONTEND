import { useState } from 'react';
import { transporters, addTransporter } from '../../data/mockData';

export default function TransporterNetwork() {
  const [showForm, setShowForm] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [form, setForm] = useState({
    name: '',
    city: '',
    routes: '',
    contact: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addTransporter({
      name: form.name,
      city: form.city,
      routes: form.routes.split(',').map(r => r.trim()),
      contact: form.contact,
    });
    setForm({ name: '', city: '', routes: '', contact: '' });
    setShowForm(false);
    setRefresh(r => r + 1);
  };

  return (
    <div>
      <div className="page-header">
        <h2>Transporter Network</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Transporter'}
        </button>
      </div>

      {showForm && (
        <div className="detail-section" style={{ marginBottom: '20px' }}>
          <h3>Add New Transporter</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Transporter Name</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Company name" required />
              </div>
              <div className="form-group">
                <label>Operating City</label>
                <input name="city" value={form.city} onChange={handleChange} placeholder="e.g. Delhi" required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Service Routes (comma separated)</label>
                <input name="routes" value={form.routes} onChange={handleChange} placeholder="e.g. Delhi → Jaipur, Delhi → Chandigarh" required />
              </div>
              <div className="form-group">
                <label>Contact Number</label>
                <input name="contact" value={form.contact} onChange={handleChange} placeholder="Phone number" required />
              </div>
            </div>
            <button type="submit" className="btn btn-success">Add Transporter</button>
          </form>
        </div>
      )}

      <div className="stat-cards">
        <div className="stat-card">
          <div className="stat-icon">🚛</div>
          <div className="stat-label">Total Transporters</div>
          <div className="stat-value">{transporters.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏙️</div>
          <div className="stat-label">Cities Covered</div>
          <div className="stat-value">{new Set(transporters.map(t => t.city)).size}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-label">Active</div>
          <div className="stat-value">{transporters.filter(t => t.status === 'active').length}</div>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h3>All Transporters</h3>
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>City</th>
              <th>Routes</th>
              <th>Contact</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {transporters.map(t => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td><strong>{t.name}</strong></td>
                <td>{t.city}</td>
                <td>{(t.routes || []).join(', ')}</td>
                <td>{t.contact}</td>
                <td><span className="badge badge-delivered">{t.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
