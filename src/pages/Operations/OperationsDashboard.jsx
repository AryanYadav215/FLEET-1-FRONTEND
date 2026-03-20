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

export default function OperationsDashboard() {
  const { getAuthHeaders } = useAuth();

  const [activeTab, setActiveTab] = useState('new');
  const [refresh, setRefresh] = useState(0);

  const [showAssign, setShowAssign] = useState(null);
  const [showHandover, setShowHandover] = useState(null);

  const [selectedTransporter, setSelectedTransporter] = useState('');
  const [handoverCity, setHandoverCity] = useState('');

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

        const mappedShip = (Array.isArray(shipData)
          ? shipData
          : shipData.shipments || []
        ).map(mapShipment);

        const mappedTrans = trans.map(mapTransporter);

        if (!cancelled) {
          setShipments(mappedShip);
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

    load();

    return () => {
      cancelled = true;
    };
  }, [refresh]);

  const stats = {
    total: shipments.length,
    pending: shipments.filter((s) => s.status === 'pending').length,
    assigned: shipments.filter((s) => s.status === 'assigned').length,
    inTransit: shipments.filter((s) =>
      ['picked_up', 'in_transit', 'at_hub'].includes(s.status)
    ).length,
    delivered: shipments.filter((s) => s.status === 'delivered').length,
  };

  const pendingShipments = shipments.filter((s) => s.status === 'pending');

  const handleAssign = async (shipmentId) => {
    if (!selectedTransporter) {
      alert('Please select transporter');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/assign-transporter`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          shipment_id: shipmentId,
          transporter_id: parseInt(selectedTransporter, 10),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to assign');
      }

      setShowAssign(null);
      setSelectedTransporter('');
      setRefresh((r) => r + 1);

    } catch (err) {
      alert(err.message || 'Failed to assign');
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
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="page-header">
        <h2>Operations Dashboard</h2>
      </div>

      <div className="stat-cards">
        <div className="stat-card">
          <div className="stat-label">Total</div>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pending</div>
          <div className="stat-value">{stats.pending}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Delivered</div>
          <div className="stat-value">{stats.delivered}</div>
        </div>
      </div>

      <div className="table-container">
        <h3>Pending Shipments</h3>

        {pendingShipments.length > 0 ? (
          <table>
            <tbody>
              {pendingShipments.map((s) => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.pickup?.city}</td>
                  <td>{s.delivery?.city}</td>

                  <td>
                    <select
                      value={selectedTransporter}
                      onChange={(e) => setSelectedTransporter(e.target.value)}
                    >
                      <option value="">Select</option>
                      {transporters.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>

                    <button onClick={() => handleAssign(s.numericId ?? s.id)}>
                      Assign
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No pending shipments</p>
        )}
      </div>
    </div>
  );
}