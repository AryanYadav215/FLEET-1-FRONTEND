import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { API_BASE } from '../../config';
import { mapShipment, mapTransporter } from '../../api';

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
  const { getAuthHeaders } = useAuth();

  const [shipment, setShipment] = useState(null);
  const [transporters, setTransporters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const headers = getAuthHeaders();

        const [shipRes, timelineRes, transRes] = await Promise.all([
          fetch(`${API_BASE}/shipments/${id}`, { headers }),
          fetch(`${API_BASE}/shipments/${id}/timeline`, { headers }).catch(() => null),
          fetch(`${API_BASE}/transporters`, { headers }).catch(() => null),
        ]);

        const shipData = await shipRes.json();

        if (!shipRes.ok) {
          throw new Error(shipData.message || 'Shipment not found');
        }

        let timeline = [];
        if (timelineRes?.ok) {
          const tlData = await timelineRes.json();
          timeline = tlData.timeline || [];
        }

        let trans = [];
        if (transRes?.ok) {
          const tData = await transRes.json();
          trans = Array.isArray(tData) ? tData : tData.transporters || [];
        }

        if (!cancelled) {
          const mapped = mapShipment({ ...shipData, timeline });
          setShipment(mapped);
          setTransporters(trans.map(mapTransporter));
        }

      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to load shipment');
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
  }, [id]); // ✅ removed getAuthHeaders (important fix)

  const transporter =
    shipment &&
    transporters.find(
      (t) =>
        t.id ===
        (shipment.assignedTransporter ?? shipment.currentTransporter)
    );

  if (loading) {
    return (
      <div className="empty-state">
        <p>Loading...</p>
      </div>
    );
  }

  if (error || !shipment) {
    return (
      <div className="empty-state">
        <div className="emoji">🔍</div>
        <p>{error || 'Shipment not found.'}</p>
      </div>
    );
  }

  return (
    <div className="detail-page">
      <div className="back-link" onClick={() => navigate(-1)}>
        ← Back to Shipments
      </div>

      <div className="page-header">
        <h2>Shipment {shipment.id}</h2>
        <span className={`badge badge-${shipment.status}`}>
          {statusLabels[shipment.status] || shipment.status}
        </span>
      </div>

      <div className="detail-section">
        <h3>📍 Pickup Details</h3>
        <div className="detail-grid">
          <div className="detail-item">
            <div className="label">Address</div>
            <div className="value">{shipment.pickup?.address || '-'}</div>
          </div>
          <div className="detail-item">
            <div className="label">City</div>
            <div className="value">{shipment.pickup?.city || '-'}</div>
          </div>
          <div className="detail-item">
            <div className="label">Contact Person</div>
            <div className="value">{shipment.pickup?.contactPerson || '-'}</div>
          </div>
        </div>
      </div>

      <div className="detail-section">
        <h3>📦 Delivery Details</h3>
        <div className="detail-grid">
          <div className="detail-item">
            <div className="label">Receiver</div>
            <div className="value">{shipment.delivery?.receiverName || '-'}</div>
          </div>
          <div className="detail-item">
            <div className="label">Destination City</div>
            <div className="value">{shipment.delivery?.city || '-'}</div>
          </div>
          <div className="detail-item">
            <div className="label">Address</div>
            <div className="value">{shipment.delivery?.address || '-'}</div>
          </div>
          <div className="detail-item">
            <div className="label">Phone</div>
            <div className="value">{shipment.delivery?.phone || '-'}</div>
          </div>
        </div>
      </div>

      <div className="detail-section">
        <h3>🏷️ Goods Information</h3>
        <div className="detail-grid">
          <div className="detail-item">
            <div className="label">Description</div>
            <div className="value">{shipment.goods?.description || '-'}</div>
          </div>
          <div className="detail-item">
            <div className="label">Quantity</div>
            <div className="value">{shipment.goods?.quantity || '-'}</div>
          </div>
          {shipment.goods?.weight && (
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
          {(shipment.timeline || []).map((event, i) => (
            <div className="timeline-item" key={i}>
              <div className="timeline-event">{event.event}</div>
              <div className="timeline-meta">
                {event.time
                  ? new Date(event.time).toLocaleString()
                  : '-'}{' '}
                — {event.actor || 'System'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}