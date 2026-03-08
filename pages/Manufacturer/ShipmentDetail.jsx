import { useParams, useNavigate } from 'react-router-dom';
import { getShipmentById, transporters } from '../../data/mockData';

const statusLabels = {
  pending: 'Pending',
  assigned: 'Assigned',
  picked_up: 'Picked Up',
  in_transit: 'In Transit',
  at_hub: 'At Hub',
  handed_over: 'Handed Over',
  delivered: 'Delivered',
};

export default function ShipmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const shipment = getShipmentById(id);

  if (!shipment) {
    return (
      <div className="empty-state">
        <div className="emoji">🔍</div>
        <p>Shipment not found.</p>
      </div>
    );
  }

  const transporter = transporters.find(t => t.id === shipment.assignedTransporter);

  return (
    <div className="detail-page">
      <div className="back-link" onClick={() => navigate(-1)}>← Back to Shipments</div>

      <div className="page-header">
        <h2>Shipment {shipment.id}</h2>
        <span className={`badge badge-${shipment.status}`}>{statusLabels[shipment.status]}</span>
      </div>

      <div className="detail-section">
        <h3>📍 Pickup Details</h3>
        <div className="detail-grid">
          <div className="detail-item">
            <div className="label">Address</div>
            <div className="value">{shipment.pickup.address}</div>
          </div>
          <div className="detail-item">
            <div className="label">City</div>
            <div className="value">{shipment.pickup.city}</div>
          </div>
          <div className="detail-item">
            <div className="label">Contact Person</div>
            <div className="value">{shipment.pickup.contactPerson}</div>
          </div>
        </div>
      </div>

      <div className="detail-section">
        <h3>📦 Delivery Details</h3>
        <div className="detail-grid">
          <div className="detail-item">
            <div className="label">Receiver</div>
            <div className="value">{shipment.delivery.receiverName}</div>
          </div>
          <div className="detail-item">
            <div className="label">Destination City</div>
            <div className="value">{shipment.delivery.city}</div>
          </div>
          <div className="detail-item">
            <div className="label">Address</div>
            <div className="value">{shipment.delivery.address}</div>
          </div>
          <div className="detail-item">
            <div className="label">Phone</div>
            <div className="value">{shipment.delivery.phone}</div>
          </div>
        </div>
      </div>

      <div className="detail-section">
        <h3>🏷️ Goods Information</h3>
        <div className="detail-grid">
          <div className="detail-item">
            <div className="label">Description</div>
            <div className="value">{shipment.goods.description}</div>
          </div>
          <div className="detail-item">
            <div className="label">Quantity</div>
            <div className="value">{shipment.goods.quantity}</div>
          </div>
          {shipment.goods.weight && (
            <div className="detail-item">
              <div className="label">Weight</div>
              <div className="value">{shipment.goods.weight}</div>
            </div>
          )}
        </div>
      </div>

      {transporter && (
        <div className="detail-section">
          <h3>🚚 Assigned Transporter</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <div className="label">Name</div>
              <div className="value">{transporter.name}</div>
            </div>
            <div className="detail-item">
              <div className="label">City</div>
              <div className="value">{transporter.city}</div>
            </div>
            <div className="detail-item">
              <div className="label">Contact</div>
              <div className="value">{transporter.contact}</div>
            </div>
          </div>
        </div>
      )}

      <div className="detail-section">
        <h3>📜 Shipment Timeline</h3>
        <div className="timeline">
          {shipment.timeline.map((event, i) => (
            <div className="timeline-item" key={i}>
              <div className="timeline-event">{event.event}</div>
              <div className="timeline-meta">
                {new Date(event.time).toLocaleString()} — {event.actor}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
