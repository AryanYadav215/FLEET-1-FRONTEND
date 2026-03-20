import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
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
  }, [refresh]); // ✅ removed getAuthHeaders

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
  const activeShipments = shipments.filter(
    (s) => !['pending', 'delivered'].includes(s.status)
  );
  const allShipments = shipments;

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

  const handleHandover = async (shipmentId) => {
    if (!selectedTransporter || !handoverCity) {
      alert('Select transporter and city');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/update-status`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          shipment_id: shipmentId,
          status: statusToBackend.handed_over || 'Handed Over',
          transporter_id: parseInt(selectedTransporter, 10),
          location: handoverCity,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to handover');
      }

      setShowHandover(null);
      setSelectedTransporter('');
      setHandoverCity('');
      setRefresh((r) => r + 1);

    } catch (err) {
      alert(err.message || 'Failed to handover');
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
        <h2>Operations Dashboard</h2>
      </div>

      <div className="stat-cards">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-label">Total Shipments</div>
          <div className="stat-value">{stats.total}</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-label">Pending Assignment</div>
          <div className="stat-value">{stats.pending}</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🚚</div>
          <div className="stat-label">In Progress</div>
          <div className="stat-value">
            {stats.assigned + stats.inTransit}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-label">Delivered</div>
          <div className="stat-value">{stats.delivered}</div>
        </div>
      </div>

      <div className="tabs">
        <button className={`tab ${activeTab === 'new' ? 'active' : ''}`} onClick={() => setActiveTab('new')}>
          New Requests ({pendingShipments.length})
        </button>
        <button className={`tab ${activeTab === 'active' ? 'active' : ''}`} onClick={() => setActiveTab('active')}>
          Active Shipments ({activeShipments.length})
        </button>
        <button className={`tab ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>
          All Shipments ({allShipments.length})
        </button>
      </div>

      {/* NEW REQUESTS */}
      {activeTab === 'new' && (
        <div className="table-container">
          <h3>Shipments Pending Assignment</h3>

          {pendingShipments.length > 0 ? (
            <table>
              <tbody>
                {pendingShipments.map((s) => (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td>{s.pickup?.city}</td>
                    <td>{s.delivery?.city}</td>

                    <td>
                      {showAssign === s.id ? (
                        <>
                          <select value={selectedTransporter} onChange={(e) => setSelectedTransporter(e.target.value)}>
                            <option value="">Select</option>
                            {transporters.map((t) => (
                              <option key={t.id} value={t.id}>
                                {t.name}
                              </option>
                            ))}
                          </select>

                          <button onClick={() => handleAssign(s.numericId ?? s.id)}>Assign</button>
                        </>
                      ) : (
                        <button onClick={() => setShowAssign(s.id)}>Assign</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>All assigned</p>
          )}
        </div>
      )}
    </div>
  );
}