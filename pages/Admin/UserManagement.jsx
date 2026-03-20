import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE } from '../../config';

const roleLabels = {
  manufacturer: 'Manufacturer',
  transporter: 'Transporter',
  operations: 'Operations',
  admin: 'Admin',
};

export default function UserManagement() {
  const { getAuthHeaders } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(`${API_BASE}/users`, {
          headers: getAuthHeaders(),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Failed to load users');
        }

        const list = Array.isArray(data) ? data : data.users || [];

        if (!cancelled) {
          setUsers(list);
        }

      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to load users');
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

  const stats = {
    total: users.length,
    manufacturer: users.filter((u) => u.role === 'manufacturer').length,
    transporter: users.filter((u) => u.role === 'transporter').length,
    others: users.filter((u) =>
      ['operations', 'admin'].includes(u.role)
    ).length,
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
        <h2>User Management</h2>
      </div>

      <div className="stat-cards">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-label">Total Users</div>
          <div className="stat-value">{stats.total}</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏭</div>
          <div className="stat-label">Manufacturers</div>
          <div className="stat-value">{stats.manufacturer}</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🚚</div>
          <div className="stat-label">Transporters</div>
          <div className="stat-value">{stats.transporter}</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⚙️</div>
          <div className="stat-label">Operations / Admin</div>
          <div className="stat-value">{stats.others}</div>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h3>All Users</h3>
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Company</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>

                <td>
                  <strong>{u.name || '-'}</strong>
                </td>

                <td>{u.email || '-'}</td>

                <td>{u.company || u.company_name || '-'}</td>

                <td>
                  <span
                    className={`badge badge-${
                      u.role === 'manufacturer'
                        ? 'assigned'
                        : u.role === 'transporter'
                        ? 'in_transit'
                        : 'delivered'
                    }`}
                  >
                    {roleLabels[u.role] || u.role}
                  </span>
                </td>

                <td>
                  <span className="badge badge-delivered">
                    {u.status || 'Active'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="empty-state">
            <p>No users found.</p>
          </div>
        )}
      </div>
    </div>
  );
}