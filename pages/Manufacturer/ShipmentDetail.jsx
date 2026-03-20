import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// ✅ FIXED IMPORTS (Vite-safe)
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
  }, [id]);

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

      {/* rest unchanged */}
    </div>
  );
}