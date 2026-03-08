import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getShipmentsByManufacturer, getStats } from '../../data/mockData';

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
  const { user } = useAuth();
  const stats = getStats(user.id);
  const shipments = getShipmentsByManufacturer(user.id);
  const recentShipments = shipments.slice(0, 5);

  return (
    <div>
      <div className="page-header">
        <h2>Dashboard</h2>
        <Link to="/manufacturer/create-shipment" className="btn btn-primary">
          + Create Shipment
        </Link>
      </div>

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
          <Link to="/manufacturer/shipments" className="btn btn-secondary btn-sm">View All</Link>
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
              {recentShipments.map(s => (
                <tr key={s.id} className="clickable" onClick={() => window.location.href = `/manufacturer/shipments/${s.id}`}>
                  <td><strong>{s.id}</strong></td>
                  <td>{s.delivery.city}</td>
                  <td>{s.goods.description}</td>
                  <td><span className={`badge badge-${s.status}`}>{statusLabels[s.status]}</span></td>
                  <td>{new Date(s.createdAt).toLocaleDateString()}</td>
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
