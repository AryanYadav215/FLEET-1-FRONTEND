import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE } from '../../config';
import { mapTransporter } from '../../api';

export default function TransporterNetwork() {
  const { getAuthHeaders } = useAuth();

  const [showForm, setShowForm] = useState(false);
  const [transporters, setTransporters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    city: '',
    routes: '',
    contact: '',
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(`${API_BASE}/transporters`, {
          headers: getAuthHeaders(),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Failed to load transporters');
        }

        const list = Array.isArray(data) ? data : data.transporters || [];

        if (!cancelled) {
          setTransporters(list.map(mapTransporter));
        }

      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to load');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE}/transporters`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: form.name,
          city: form.city,
          routes: form.routes.split(',').map((r) => r.trim()),
          contact: form.contact,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to add transporter');
      }

      // refresh list
      setTransporters((prev) => [...prev, mapTransporter(data)]);

      setForm({ name: '', city: '', routes: '', contact: '' });
      setShowForm(false);

    } catch (err) {
      alert(err.message || 'Failed to add transporter');
    }
  };

  if (loading) {
    return (
      <div className="empty-state">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <p style={{ color: 'var(--color-error, #c00)' }}>
          {error}
        </p>
      )}

      <div className="page-header">
        <h2>Transporter Network</h2>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Add Transporter'}
        </button>
      </div>

      {showForm && (
        <div className="detail-section" style={{ marginBottom: '20px' }}>
          <h3>Add New Transporter</h3>

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Company name"
                required
              />
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="City"
                required
              />
            </div>

            <div className="form-row">
              <input
                name="routes"
                value={form.routes}
                onChange={handleChange}
                placeholder="Routes (comma separated)"
                required
              />
              <input
                name="contact"
                value={form.contact}
                onChange={handleChange}
                placeholder="Phone"
                required
              />
            </div>

            <button type="submit" className="btn btn-success">
              Add Transporter
            </button>
          </form>
        </div>
      )}

      <div className="stat-cards">
        <div className="stat-card">
          <div className="stat-label">Total</div>
          <div className="stat-value">{transporters.length}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Cities</div>
          <div className="stat-value">
            {new Set(transporters.map((t) => t.city)).size}
          </div>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>City</th>
              <th>Routes</th>
              <th>Contact</th>
            </tr>
          </thead>

          <tbody>
            {transporters.map((t) => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.name}</td>
                <td>{t.city}</td>
                <td>{(t.routes || []).join(', ')}</td>
                <td>{t.contact}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}