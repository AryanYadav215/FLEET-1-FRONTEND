import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

// ✅ FIXED IMPORTS (VERY IMPORTANT)
import { API_BASE } from '../../config';
import { mapShipment, mapTransporter, statusToBackend } from '../../api';
const statusLabels = {
  pending: 'Pending',
  assigned: 'Assigned',
  picked_up: 'Picked Up',
  in_transit: 'In Transit',
  at_hub: 'At Hub',
  handed_over: 'Handed Over',
  delivered: 'Delivered',
};

const statusFlow = [
  'assigned',
  'picked_up',
  'in_transit',
  'at_hub',
  'handed_over',
  'delivered',
];

function getNextStatus(current) {
  const idx = statusFlow.indexOf(current);
  if (idx >= 0 && idx < statusFlow.length - 1) {
    return statusFlow[idx + 1];
  }
  return null;
}

export default function TransporterDashboard() {
  const { user, getAuthHeaders } = useAuth();

  const [refresh, setRefresh] = useState(0);
  const [shipments, setShipments] = useState([]);
  const [transporters, setTransporters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const headers = getAuthHeaders();

        const [shipRes, transRes] = await Promise.all([
          fetch(`${API_BASE}/shipments`, { headers }),
          fetch(`${API_BASE}/transporters`, { headers }),
        ]);

        const shipData = await shipRes.json();
        const transData = transRes.ok ? await transRes.json() : [];

        if (!shipRes.ok) {
          throw new Error(shipData.message || 'Failed to load');
        }

        const trans = Array.isArray(transData)
          ? transData
          : transData.transporters || [];

        const mappedTrans = trans.map(mapTransporter);
        const mappedShip = (Array.isArray(shipData)
          ? shipData
          : shipData.shipments || []
        ).map(mapShipment);

        const transporter =
          mappedTrans.find(
            (t) =>
              t.name === user?.company_name || t.name === user?.name
          ) || mappedTrans[0];

        const transporterShipments = transporter
          ? mappedShip.filter(
              (s) =>
                (s.assignedTransporter ?? s.currentTransporter) ==
                transporter.id
            )
          : [];

        const toShow =
          transporterShipments.length > 0
            ? transporterShipments
            : mappedShip;

        if (!cancelled) {
          setShipments(toShow);
          setTransporters(mappedTrans);
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

    if (user) {
      load();
    }

    return () => {
      cancelled = true;
    };
  }, [user, refresh]);

  const transporter =
    transporters.find(
      (t) =>
        t.name === user?.company_name || t.name === user?.name
    ) || transporters[0];

  const handleStatusUpdate = async (shipmentId, newStatus) => {
    try {
      const backendStatus = statusToBackend[newStatus] || newStatus;

      const res = await fetch(`${API_BASE}/update-status`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          shipment_id: shipmentId,
          status: backendStatus,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to update status');
      }

      setRefresh((r) => r + 1);

    } catch (err) {
      alert(err.message || 'Failed to update status');
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
        <h2>Transporter Dashboard</h2>

        <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
          {transporter
            ? `${transporter.name} — ${transporter.city}`
            : 'Loading...'}
        </span>
      </div>

      <div className="stat-cards">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-label">Assigned Shipments</div>
          <div className="stat-value">{shipments.length}</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🚚</div>
          <div className="stat-label">In Transit</div>
          <div className="stat-value">
            {shipments.filter((s) =>
              ['picked_up', 'in_transit'].includes(s.status)
            ).length}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-label">Delivered</div>
          <div className="stat-value">
            {shipments.filter((s) => s.status === 'delivered').length}
          </div>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h3>Assigned Shipments</h3>
        </div>

        {shipments.length > 0 ? (
          <table>
            <tbody>
              {shipments.map((s) => {
                const nextStatus = getNextStatus(s.status);

                return (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td>{s.pickup?.city}</td>
                    <td>{s.delivery?.city}</td>

                    <td>
                      {nextStatus ? (
                        <button
                          onClick={() =>
                            handleStatusUpdate(
                              s.numericId ?? s.id,
                              nextStatus
                            )
                          }
                        >
                          {statusLabels[nextStatus]}
                        </button>
                      ) : (
                        'Done'
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p>No shipments</p>
        )}
      </div>
    </div>
  );
}