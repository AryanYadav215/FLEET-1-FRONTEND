import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// ✅ FIXED import
import { API_BASE } from '/src/config';

export default function CreateShipment() {
  const { user, getAuthHeaders } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    pickupAddress: '',
    pickupCity: '',
    pickupContact: user?.name || '',
    receiverName: '',
    receiverAddress: '',
    destinationCity: '',
    receiverPhone: '',
    goodsDescription: '',
    quantity: '',
    weight: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!user) {
      setError('You must be logged in');
      return;
    }

    setLoading(true);

    try {
      const headers = getAuthHeaders();

      const body = {
        pickup_address: form.pickupAddress,
        pickup_city: form.pickupCity,
        pickup_contact: form.pickupContact,
        receiver_name: form.receiverName,
        delivery_address: form.receiverAddress,
        destination_city: form.destinationCity,
        phone: form.receiverPhone,
        goods_description: form.goodsDescription,
        quantity: parseInt(form.quantity, 10) || 1,
        weight: form.weight || null,
      };

      const res = await fetch(`${API_BASE}/shipments`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to create shipment');
      }

      navigate('/manufacturer/shipments');

    } catch (err) {
      setError(err.message || 'Failed to create shipment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '700px' }}>
      <div className="page-header">
        <h2>Create Shipment</h2>
      </div>

      {error && (
        <p style={{ color: 'var(--color-error, #c00)', marginBottom: '12px' }}>
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>📍 Pickup Details</h3>

          <div className="form-group">
            <label>Pickup Address</label>
            <input
              name="pickupAddress"
              value={form.pickupAddress}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input
                name="pickupCity"
                value={form.pickupCity}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Contact Person</label>
              <input
                name="pickupContact"
                value={form.pickupContact}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>📦 Delivery Details</h3>

          <div className="form-row">
            <div className="form-group">
              <label>Receiver Name</label>
              <input
                name="receiverName"
                value={form.receiverName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Destination City</label>
              <input
                name="destinationCity"
                value={form.destinationCity}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Receiver Address</label>
            <input
              name="receiverAddress"
              value={form.receiverAddress}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              name="receiverPhone"
              value={form.receiverPhone}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h3>🏷️ Shipment Details</h3>

          <div className="form-group">
            <label>Goods Description</label>
            <input
              name="goodsDescription"
              value={form.goodsDescription}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Quantity</label>
              <input
                name="quantity"
                type="number"
                value={form.quantity}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Weight</label>
              <input
                name="weight"
                value={form.weight}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="action-bar">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Shipment'}
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}