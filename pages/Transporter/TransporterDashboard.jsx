import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getShipmentsByTransporter, transporters, updateShipmentStatus } from '../../data/mockData';

const statusLabels = {
  pending: 'Pending',
  assigned: 'Assigned',
  picked_up: 'Picked Up',
  in_transit: 'In Transit',
  at_hub: 'At Hub',
  handed_over: 'Handed Over',
  delivered: 'Delivered',
};

const statusFlow = ['assigned', 'picked_up', 'in_transit', 'at_hub', 'handed_over', 'delivered'];

function getNextStatus(current) {
  const idx = statusFlow.indexOf(current);
  if (idx >= 0 && idx < statusFlow.length - 1) {
    return statusFlow[idx + 1];
  }
  return null;
}

export default function TransporterDashboard() {
  const { user } = useAuth();
  const [refresh, setRefresh] = useState(0);

  // Find the transporter ID from mock data based on user
  const transporter = transporters.find(t => t.name === user.company || t.name === user.name) || transporters[0];
  const shipments = getShipmentsByTransporter(transporter.id);

  const handleStatusUpdate = (shipmentId, newStatus) => {
    updateShipmentStatus(shipmentId, newStatus, transporter.name);
    setRefresh(r => r + 1);
  };

  return (
    <div>
      <div className="page-header">
        <h2>Transporter Dashboard</h2>
        <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
          {transporter.name} — {transporter.city}
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
          <div className="stat-value">{shipments.filter(s => ['picked_up', 'in_transit'].includes(s.status)).length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-label">Delivered</div>
          <div className="stat-value">{shipments.filter(s => s.status === 'delivered').length}</div>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h3>Assigned Shipments</h3>
        </div>
        {shipments.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Shipment ID</th>
                <th>Pickup Address</th>
                <th>Delivery Location</th>
                <th>Goods</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {shipments.map(s => {
                const nextStatus = getNextStatus(s.status);
                return (
                  <tr key={s.id}>
                    <td><strong>{s.id}</strong></td>
                    <td>{s.pickup.address}, {s.pickup.city}</td>
                    <td>{s.delivery.address}, {s.delivery.city}</td>
                    <td>{s.goods.description} (Qty: {s.goods.quantity})</td>
                    <td><span className={`badge badge-${s.status}`}>{statusLabels[s.status]}</span></td>
                    <td>
                      {nextStatus ? (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleStatusUpdate(s.id, nextStatus)}
                        >
                          Mark {statusLabels[nextStatus]}
                        </button>
                      ) : (
                        <span style={{ color: 'var(--color-success)', fontWeight: 600, fontSize: '13px' }}>✓ Complete</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <div className="emoji">🚚</div>
            <p>No shipments assigned to you yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
