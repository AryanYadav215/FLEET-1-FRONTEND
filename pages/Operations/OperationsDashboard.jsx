import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE } from '../../src/config';
import { mapShipment, mapTransporter, statusToBackend } from '../../src/api';

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
        if (!shipRes.ok) throw new Error(shipData.message || 'Failed to load');
        const trans = Array.isArray(transData) ? transData : transData.transporters || [];
        const mappedShip = (Array.isArray(shipData) ? shipData : shipData.shipments || []).map(mapShipment);
        const mappedTrans = trans.map(mapTransporter);
        if (!cancelled) {
          setShipments(mappedShip);
          setTransporters(mappedTrans);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [refresh, getAuthHeaders]);

  const stats = {
    total: shipments.length,
    pending: shipments.filter(s => s.status === 'pending').length,
    assigned: shipments.filter(s => s.status === 'assigned').length,
    inTransit: shipments.filter(s => ['picked_up', 'in_transit', 'at_hub'].includes(s.status)).length,
    delivered: shipments.filter(s => s.status === 'delivered').length,
  };
  const pendingShipments = shipments.filter(s => s.status === 'pending');
  const activeShipments = shipments.filter(s => !['pending', 'delivered'].includes(s.status));
  const allShipments = shipments;

  const handleAssign = async (shipmentId) => {
    if (!selectedTransporter) return;
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
      if (!res.ok) throw new Error(data.message || 'Failed to assign');
      setShowAssign(null);
      setSelectedTransporter('');
      setRefresh(r => r + 1);
    } catch (err) {
      alert(err.message || 'Failed to assign');
    }
  };

  const handleHandover = async (shipmentId) => {
    if (!selectedTransporter || !handoverCity) return;
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
      if (!res.ok) throw new Error(data.message || 'Failed to handover');
      setShowHandover(null);
      setSelectedTransporter('');
      setHandoverCity('');
      setRefresh(r => r + 1);
    } catch (err) {
      alert(err.message || 'Failed to handover');
    }
  };

  if (loading) return <div className="empty-state"><p>Loading...</p></div>;

  return (
    <div>
      {error && <p style={{ color: 'var(--color-error, #c00)' }}>{error}</p>}
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
          <div className="stat-value">{stats.assigned + stats.inTransit}</div>
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

      {/* New Requests - Pending Assignment */}
      {activeTab === 'new' && (
        <div className="table-container">
          <div className="table-header">
            <h3>Shipments Pending Assignment</h3>
          </div>
          {pendingShipments.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Shipment ID</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Goods</th>
                  <th>Created</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingShipments.map(s => (
                  <tr key={s.id}>
                    <td><strong>{s.id}</strong></td>
                    <td>{s.pickup.city}</td>
                    <td>{s.delivery.city}</td>
                    <td>{s.goods.description}</td>
                    <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                    <td>
                      {showAssign === s.id ? (
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <select
                            value={selectedTransporter}
                            onChange={e => setSelectedTransporter(e.target.value)}
                            style={{ padding: '6px 8px', borderRadius: 'var(--radius)', border: '1px solid var(--color-border)', fontSize: '13px' }}
                          >
                            <option value="">Select Transporter</option>
                            {transporters.map(t => (
                              <option key={t.id} value={t.id}>{t.name} ({t.city})</option>
                            ))}
                          </select>
                          <button className="btn btn-success btn-sm" onClick={() => handleAssign(s.numericId ?? s.id)}>Assign</button>
                          <button className="btn btn-secondary btn-sm" onClick={() => setShowAssign(null)}>Cancel</button>
                        </div>
                      ) : (
                        <button className="btn btn-primary btn-sm" onClick={() => setShowAssign(s.id)}>
                          Assign Transporter
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <div className="emoji">✅</div>
              <p>All shipments have been assigned!</p>
            </div>
          )}
        </div>
      )}

      {/* Active Shipments */}
      {activeTab === 'active' && (
        <div className="table-container">
          <div className="table-header">
            <h3>Active Shipments</h3>
          </div>
          {activeShipments.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Shipment ID</th>
                  <th>From → To</th>
                  <th>Current Transporter</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {activeShipments.map(s => {
                  const currentT = transporters.find(t => t.id === s.currentTransporter);
                  return (
                    <tr key={s.id}>
                      <td><strong>{s.id}</strong></td>
                      <td>{s.pickup.city} → {s.delivery.city}</td>
                      <td>{currentT?.name || '—'}</td>
                      <td><span className={`badge badge-${s.status}`}>{statusLabels[s.status]}</span></td>
                      <td>
                        {s.status === 'at_hub' && showHandover !== s.id && (
                          <button className="btn btn-primary btn-sm" onClick={() => setShowHandover(s.id)}>
                            Handover
                          </button>
                        )}
                        {showHandover === s.id && (
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                            <select
                              value={selectedTransporter}
                              onChange={e => setSelectedTransporter(e.target.value)}
                              style={{ padding: '6px 8px', borderRadius: 'var(--radius)', border: '1px solid var(--color-border)', fontSize: '13px' }}
                            >
                              <option value="">Next Transporter</option>
                              {transporters.filter(t => t.id !== s.currentTransporter).map(t => (
                                <option key={t.id} value={t.id}>{t.name} ({t.city})</option>
                              ))}
                            </select>
                            <input
                              value={handoverCity}
                              onChange={e => setHandoverCity(e.target.value)}
                              placeholder="City"
                              style={{ padding: '6px 8px', borderRadius: 'var(--radius)', border: '1px solid var(--color-border)', fontSize: '13px', width: '100px' }}
                            />
                            <button className="btn btn-success btn-sm" onClick={() => handleHandover(s.numericId ?? s.id)}>Confirm</button>
                            <button className="btn btn-secondary btn-sm" onClick={() => setShowHandover(null)}>Cancel</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <div className="emoji">📋</div>
              <p>No active shipments right now.</p>
            </div>
          )}
        </div>
      )}

      {/* All Shipments */}
      {activeTab === 'all' && (
        <div className="table-container">
          <div className="table-header">
            <h3>All Shipments</h3>
          </div>
          <table>
            <thead>
              <tr>
                <th>Shipment ID</th>
                <th>From</th>
                <th>To</th>
                <th>Goods</th>
                <th>Transporter</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {allShipments.map(s => {
                const t = transporters.find(t => t.id === s.assignedTransporter);
                return (
                  <tr key={s.id}>
                    <td><strong>{s.id}</strong></td>
                    <td>{s.pickup.city}</td>
                    <td>{s.delivery.city}</td>
                    <td>{s.goods.description}</td>
                    <td>{t?.name || '—'}</td>
                    <td><span className={`badge badge-${s.status}`}>{statusLabels[s.status]}</span></td>
                    <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
