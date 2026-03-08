import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getShipmentsByManufacturer } from '../../data/mockData';

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
  const { user } = useAuth();
  const shipments = getShipmentsByManufacturer(user.id);

  return (
    <div>
      <div className="page-header">
        <h2>My Shipments</h2>
        <Link to="/manufacturer/create-shipment" className="btn btn-primary">
          + Create Shipment
        </Link>
      </div>

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
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {shipments.map(s => (
              <tr key={s.id}>
                <td><strong>{s.id}</strong></td>
                <td>{s.pickup.city}</td>
                <td>{s.delivery.city}</td>
                <td>{s.goods.description}</td>
                <td>{s.goods.quantity}</td>
                <td><span className={`badge badge-${s.status}`}>{statusLabels[s.status]}</span></td>
                <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                <td>
                  <Link to={`/manufacturer/shipments/${s.id}`} className="btn btn-secondary btn-sm">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {shipments.length === 0 && (
          <div className="empty-state">
            <div className="emoji">📋</div>
            <p>No shipments found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
