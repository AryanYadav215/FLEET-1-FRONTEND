import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// ✅ Vite-safe imports
import { API_BASE } from '/src/config';
import { mapShipment } from '/src/api';

const statusLabels = {
  pending: 'Pending',
  assigned: 'Assigned',
  picked_up: 'Picked Up',
  in_transit: 'In Transit',
  at_hub: 'At Hub',
  handed_over: 'Handed Over',
  delivered: 'Delivered',
};

export default function ShipmentList() {
  const { user, getAuthHeaders } = useAuth();

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

  if (loading) {
    return (
      <div className="empty-state">
        <p>Loading shipments...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h2>My Shipments</h2>

        <Link to="/manufacturer/create-shipment" className="btn btn-primary">
          + Create Shipment
        </Link>
      </div>

      {error && (
        <p style={{ color: 'var(--color-error, #c00)' }}>{error}</p>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Shipment ID</th>
              <th>Pickup City</th>
              <th>Destination City</th>
              <th>Goods</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>

          <tbody>
            {shipments.map((s) => (
              <tr key={s.id}>
                <td><strong>{s.id}</strong></td>
                <td>{s.pickup?.city || '-'}</td>
                <td>{s.delivery?.city || '-'}</td>
                <td>{s.goods?.description || '-'}</td>
                <td>{s.goods?.quantity || '-'}</td>
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

        {shipments.length === 0 && (
          <div className="empty-state">
            <p>No shipments found.</p>
          </div>
        )}
      </div>
    </div>
  );
}