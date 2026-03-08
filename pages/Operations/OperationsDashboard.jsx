import { useState } from 'react';
import { shipments, transporters, assignTransporter, handoverShipment, getStats } from '../../data/mockData';

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
  const [activeTab, setActiveTab] = useState('new');
  const [refresh, setRefresh] = useState(0);
  const [showAssign, setShowAssign] = useState(null);
  const [showHandover, setShowHandover] = useState(null);
  const [selectedTransporter, setSelectedTransporter] = useState('');
  const [handoverCity, setHandoverCity] = useState('');

  const stats = getStats();
  const pendingShipments = shipments.filter(s => s.status === 'pending');
  const activeShipments = shipments.filter(s => !['pending', 'delivered'].includes(s.status));
  const allShipments = shipments;

  const handleAssign = (shipmentId) => {
    if (!selectedTransporter) return;
    assignTransporter(shipmentId, parseInt(selectedTransporter));
    setShowAssign(null);
    setSelectedTransporter('');
    setRefresh(r => r + 1);
  };

  const handleHandover = (shipmentId) => {
    if (!selectedTransporter || !handoverCity) return;
    handoverShipment(shipmentId, parseInt(selectedTransporter), handoverCity);
    setShowHandover(null);
    setSelectedTransporter('');
    setHandoverCity('');
    setRefresh(r => r + 1);
  };

  return (
    <div>
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
                          <button className="btn btn-success btn-sm" onClick={() => handleAssign(s.id)}>Assign</button>
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
                            <button className="btn btn-success btn-sm" onClick={() => handleHandover(s.id)}>Confirm</button>
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
