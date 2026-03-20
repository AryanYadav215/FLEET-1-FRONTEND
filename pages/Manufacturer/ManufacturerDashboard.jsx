import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// ✅ FIXED (Vite-safe absolute imports)
import { mapShipment } from '../../api';

const statusLabels = {
  pending: 'Pending',
  assigned: 'Assigned',
  picked_up: 'Picked Up',
  in_transit: 'In Transit',
  at_hub: 'At Hub',
  handed_over: 'Handed Over',
  delivered: 'Delivered',
};

export default function ManufacturerDashboard() {
  const { user, getAuthHeaders } = useAuth();
  const navigate = useNavigate();

  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(`${API_BASE}/shipments`, {
          headers: getAuthHeaders(),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Failed to load shipments');
        }

        const list = Array.isArray(data) ? data : data.shipments || [];

        if (!cancelled) {
          setShipments(list.map(mapShipment));
        }

      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to load shipments');
          setShipments([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    if (user) {
      load();
    }

    return () => {
      cancelled = true;
    };
  }, [user]);

  const stats = {
    total: shipments.length,
    pending: shipments.filter((s) => s.status === 'pending').length,
    inTransit: shipments.filter((s) =>
      ['picked_up', 'in_transit', 'at_hub'].includes(s.status)
    ).length,
    delivered: shipments.filter((s) => s.status === 'delivered').length,
  };

  const recentShipments = shipments.slice(0, 5);

  if (loading) {
    return (
      <div className="empty-state">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h2>Dashboard</h2>

        <Link to="/manufacturer/create-shipment" className="btn btn-primary">
          + Create Shipment
        </Link>
      </div>

      {error && (
        <p style={{ color: 'var(--color-error, #c00)', marginBottom: '12px' }}>
          {error}
        </p>
      )}

      <div className="stat-cards">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-label">Total Shipments</div>
          <div className="stat-value">{stats.total}</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-label">Pending</div>
          <div className="stat-value">{stats.pending}</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🚚</div>
          <div className="stat-label">In Transit</div>
          <div className="stat-value">{stats.inTransit}</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-label">Delivered</div>
          <div className="stat-value">{stats.delivered}</div>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h3>Recent Shipments</h3>

          <Link to="/manufacturer/shipments" className="btn btn-secondary btn-sm">
            View All
          </Link>
        </div>

        {recentShipments.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Shipment ID</th>
                <th>Destination</th>
                <th>Goods</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>

            <tbody>
              {recentShipments.map((s) => (
                <tr
                  key={s.id}
                  className="clickable"
                  onClick={() =>
                    navigate(`/manufacturer/shipments/${s.numericId ?? s.id}`)
                  }
                >
                  <td><strong>{s.id}</strong></td>
                  <td>{s.delivery?.city || '-'}</td>
                  <td>{s.goods?.description || '-'}</td>
                  <td>
                    <span className={`badge badge-${s.status}`}>
                      {statusLabels[s.status] || s.status}
                    </span>
                  </td>
                  <td>
                    {s.createdAt
                      ? new Date(s.createdAt).toLocaleDateString()
                      : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <div className="emoji">📦</div>
            <p>No shipments yet. Create your first shipment!</p>
          </div>
        )}
      </div>
    </div>
  );
}