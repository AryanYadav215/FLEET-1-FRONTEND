import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { createShipment } from '../../data/mockData';

export default function CreateShipment() {
  const { user } = useAuth();
  const navigate = useNavigate();
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const pickup = {
      address: form.pickupAddress,
      city: form.pickupCity,
      contactPerson: form.pickupContact,
    };
    const delivery = {
      receiverName: form.receiverName,
      address: form.receiverAddress,
      city: form.destinationCity,
      phone: form.receiverPhone,
    };
    const goods = {
      description: form.goodsDescription,
      quantity: parseInt(form.quantity),
      weight: form.weight || null,
    };
    const newShipment = createShipment(pickup, delivery, goods, user.id);
    alert(`Shipment ${newShipment.id} created successfully!`);
    navigate('/manufacturer/shipments');
  };

  return (
    <div style={{ maxWidth: '700px' }}>
      <div className="page-header">
        <h2>Create Shipment</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>📍 Pickup Details</h3>
          <div className="form-group">
            <label>Pickup Address</label>
            <input name="pickupAddress" value={form.pickupAddress} onChange={handleChange} placeholder="Enter full pickup address" required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input name="pickupCity" value={form.pickupCity} onChange={handleChange} placeholder="Pickup city" required />
            </div>
            <div className="form-group">
              <label>Contact Person</label>
              <input name="pickupContact" value={form.pickupContact} onChange={handleChange} placeholder="Contact name" required />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>📦 Delivery Details</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Receiver Name</label>
              <input name="receiverName" value={form.receiverName} onChange={handleChange} placeholder="Receiver / company name" required />
            </div>
            <div className="form-group">
              <label>Destination City</label>
              <input name="destinationCity" value={form.destinationCity} onChange={handleChange} placeholder="Delivery city" required />
            </div>
          </div>
          <div className="form-group">
            <label>Receiver Full Address</label>
            <input name="receiverAddress" value={form.receiverAddress} onChange={handleChange} placeholder="Enter full delivery address" required />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input name="receiverPhone" value={form.receiverPhone} onChange={handleChange} placeholder="Receiver phone number" required />
          </div>
        </div>

        <div className="form-section">
          <h3>🏷️ Shipment Details</h3>
          <div className="form-group">
            <label>Goods Description</label>
            <input name="goodsDescription" value={form.goodsDescription} onChange={handleChange} placeholder="Describe the goods" required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Quantity</label>
              <input name="quantity" type="number" value={form.quantity} onChange={handleChange} placeholder="Number of items" required />
            </div>
            <div className="form-group">
              <label>Weight (optional)</label>
              <input name="weight" value={form.weight} onChange={handleChange} placeholder="e.g. 450 kg" />
            </div>
          </div>
        </div>

        <div className="action-bar">
          <button type="submit" className="btn btn-primary">Create Shipment</button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
