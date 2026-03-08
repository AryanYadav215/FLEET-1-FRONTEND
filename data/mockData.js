// Mock Data for Logistics Aggregator ERP

let shipmentIdCounter = 1006;

export const users = [
  { id: 1, name: 'Rajesh Kumar', email: 'rajesh@manufacturer.com', role: 'manufacturer', company: 'Kumar Industries', status: 'active' },
  { id: 2, name: 'Priya Sharma', email: 'priya@manufacturer.com', role: 'manufacturer', company: 'Sharma Exports', status: 'active' },
  { id: 3, name: 'Delhi Logistics Co', email: 'ops@delhilogistics.com', role: 'transporter', company: 'Delhi Logistics', status: 'active' },
  { id: 4, name: 'Jaipur Movers', email: 'ops@jaipurmovers.com', role: 'transporter', company: 'Jaipur Movers', status: 'active' },
  { id: 5, name: 'Indore Freight', email: 'ops@indorefreight.com', role: 'transporter', company: 'Indore Freight', status: 'active' },
  { id: 6, name: 'Amit Singh', email: 'amit@platform.com', role: 'operations', company: 'Platform Ops', status: 'active' },
  { id: 7, name: 'Admin User', email: 'admin@platform.com', role: 'admin', company: 'Platform', status: 'active' },
];

export const transporters = [
  { id: 1, name: 'Delhi Logistics Co', city: 'Delhi', routes: ['Delhi → Jaipur', 'Delhi → Chandigarh'], contact: '9876543210', status: 'active' },
  { id: 2, name: 'Jaipur Movers', city: 'Jaipur', routes: ['Jaipur → Indore', 'Jaipur → Ahmedabad'], contact: '9876543211', status: 'active' },
  { id: 3, name: 'Indore Freight', city: 'Indore', routes: ['Indore → Local Delivery'], contact: '9876543212', status: 'active' },
  { id: 4, name: 'Mumbai Express', city: 'Mumbai', routes: ['Mumbai → Pune', 'Mumbai → Ahmedabad'], contact: '9876543213', status: 'active' },
  { id: 5, name: 'Pune Carriers', city: 'Pune', routes: ['Pune → Local Delivery'], contact: '9876543214', status: 'active' },
];

export const shipments = [
  {
    id: 'SHP-1001',
    manufacturerId: 1,
    pickup: { address: '45 Industrial Area, Naraina', city: 'Delhi', contactPerson: 'Rajesh Kumar' },
    delivery: { receiverName: 'Vikram Traders', address: '12 Station Road, MI Road', city: 'Jaipur', phone: '9988776655' },
    goods: { description: 'Auto Parts - Brake Pads', quantity: 200, weight: '450 kg' },
    status: 'delivered',
    assignedTransporter: 1,
    currentTransporter: 2,
    createdAt: '2026-03-01T09:00:00',
    timeline: [
      { event: 'Shipment Created', time: '2026-03-01T09:00:00', actor: 'Rajesh Kumar' },
      { event: 'Assigned to Delhi Logistics Co', time: '2026-03-01T10:30:00', actor: 'Amit Singh' },
      { event: 'Picked Up', time: '2026-03-01T14:00:00', actor: 'Delhi Logistics Co' },
      { event: 'In Transit', time: '2026-03-01T15:00:00', actor: 'Delhi Logistics Co' },
      { event: 'Arrived at Jaipur Hub', time: '2026-03-02T06:00:00', actor: 'Delhi Logistics Co' },
      { event: 'Handed Over to Jaipur Movers', time: '2026-03-02T08:00:00', actor: 'Delhi Logistics Co' },
      { event: 'Out for Delivery', time: '2026-03-02T10:00:00', actor: 'Jaipur Movers' },
      { event: 'Delivered', time: '2026-03-02T14:00:00', actor: 'Jaipur Movers' },
    ]
  },
  {
    id: 'SHP-1002',
    manufacturerId: 1,
    pickup: { address: '45 Industrial Area, Naraina', city: 'Delhi', contactPerson: 'Rajesh Kumar' },
    delivery: { receiverName: 'Indore Distributors', address: '78 AB Road, Vijay Nagar', city: 'Indore', phone: '9977665544' },
    goods: { description: 'Electronic Components', quantity: 500, weight: '120 kg' },
    status: 'in_transit',
    assignedTransporter: 1,
    currentTransporter: 1,
    createdAt: '2026-03-05T11:00:00',
    timeline: [
      { event: 'Shipment Created', time: '2026-03-05T11:00:00', actor: 'Rajesh Kumar' },
      { event: 'Assigned to Delhi Logistics Co', time: '2026-03-05T12:00:00', actor: 'Amit Singh' },
      { event: 'Picked Up', time: '2026-03-05T16:00:00', actor: 'Delhi Logistics Co' },
      { event: 'In Transit', time: '2026-03-05T17:00:00', actor: 'Delhi Logistics Co' },
    ]
  },
  {
    id: 'SHP-1003',
    manufacturerId: 2,
    pickup: { address: '22 MIDC Complex, Andheri', city: 'Mumbai', contactPerson: 'Priya Sharma' },
    delivery: { receiverName: 'Pune Retail Hub', address: '5 Hinjawadi IT Park', city: 'Pune', phone: '9966554433' },
    goods: { description: 'Textile Raw Materials', quantity: 100, weight: '800 kg' },
    status: 'assigned',
    assignedTransporter: 4,
    currentTransporter: 4,
    createdAt: '2026-03-06T08:00:00',
    timeline: [
      { event: 'Shipment Created', time: '2026-03-06T08:00:00', actor: 'Priya Sharma' },
      { event: 'Assigned to Mumbai Express', time: '2026-03-06T09:30:00', actor: 'Amit Singh' },
    ]
  },
  {
    id: 'SHP-1004',
    manufacturerId: 2,
    pickup: { address: '22 MIDC Complex, Andheri', city: 'Mumbai', contactPerson: 'Priya Sharma' },
    delivery: { receiverName: 'Ahmedabad Warehouse', address: '99 Sarkhej Road', city: 'Ahmedabad', phone: '9955443322' },
    goods: { description: 'Machinery Parts', quantity: 50, weight: '1200 kg' },
    status: 'pending',
    assignedTransporter: null,
    currentTransporter: null,
    createdAt: '2026-03-07T07:00:00',
    timeline: [
      { event: 'Shipment Created', time: '2026-03-07T07:00:00', actor: 'Priya Sharma' },
    ]
  },
  {
    id: 'SHP-1005',
    manufacturerId: 1,
    pickup: { address: '45 Industrial Area, Naraina', city: 'Delhi', contactPerson: 'Rajesh Kumar' },
    delivery: { receiverName: 'Chandigarh Depot', address: '10 Sector 17, Industrial Area', city: 'Chandigarh', phone: '9944332211' },
    goods: { description: 'Packaging Materials', quantity: 1000, weight: '300 kg' },
    status: 'picked_up',
    assignedTransporter: 1,
    currentTransporter: 1,
    createdAt: '2026-03-06T15:00:00',
    timeline: [
      { event: 'Shipment Created', time: '2026-03-06T15:00:00', actor: 'Rajesh Kumar' },
      { event: 'Assigned to Delhi Logistics Co', time: '2026-03-06T16:00:00', actor: 'Amit Singh' },
      { event: 'Picked Up', time: '2026-03-07T09:00:00', actor: 'Delhi Logistics Co' },
    ]
  },
];

// Helper functions

export function getShipmentsByManufacturer(manufacturerId) {
  return shipments.filter(s => s.manufacturerId === manufacturerId);
}

export function getShipmentsByTransporter(transporterId) {
  return shipments.filter(s => s.currentTransporter === transporterId || s.assignedTransporter === transporterId);
}

export function getShipmentById(id) {
  return shipments.find(s => s.id === id);
}

export function createShipment(pickup, delivery, goods, manufacturerId) {
  shipmentIdCounter++;
  const newShipment = {
    id: `SHP-${shipmentIdCounter}`,
    manufacturerId,
    pickup,
    delivery,
    goods,
    status: 'pending',
    assignedTransporter: null,
    currentTransporter: null,
    createdAt: new Date().toISOString(),
    timeline: [
      { event: 'Shipment Created', time: new Date().toISOString(), actor: 'Manufacturer' }
    ]
  };
  shipments.unshift(newShipment);
  return newShipment;
}

export function assignTransporter(shipmentId, transporterId) {
  const shipment = shipments.find(s => s.id === shipmentId);
  const transporter = transporters.find(t => t.id === transporterId);
  if (shipment && transporter) {
    shipment.assignedTransporter = transporterId;
    shipment.currentTransporter = transporterId;
    shipment.status = 'assigned';
    shipment.timeline.push({
      event: `Assigned to ${transporter.name}`,
      time: new Date().toISOString(),
      actor: 'Operations Team'
    });
  }
  return shipment;
}

export function updateShipmentStatus(shipmentId, newStatus, actor) {
  const shipment = shipments.find(s => s.id === shipmentId);
  if (shipment) {
    shipment.status = newStatus;
    const statusLabels = {
      'picked_up': 'Picked Up',
      'in_transit': 'In Transit',
      'at_hub': 'Arrived at Hub',
      'handed_over': 'Handed Over',
      'delivered': 'Delivered',
    };
    shipment.timeline.push({
      event: statusLabels[newStatus] || newStatus,
      time: new Date().toISOString(),
      actor: actor || 'Transporter'
    });
  }
  return shipment;
}

export function handoverShipment(shipmentId, nextTransporterId, city) {
  const shipment = shipments.find(s => s.id === shipmentId);
  const prevTransporter = transporters.find(t => t.id === shipment?.currentTransporter);
  const nextTransporter = transporters.find(t => t.id === nextTransporterId);
  if (shipment && nextTransporter) {
    shipment.currentTransporter = nextTransporterId;
    shipment.status = 'handed_over';
    shipment.timeline.push({
      event: `Handed Over from ${prevTransporter?.name || 'Unknown'} to ${nextTransporter.name} at ${city}`,
      time: new Date().toISOString(),
      actor: 'Operations Team'
    });
  }
  return shipment;
}

export function addTransporter(data) {
  const newTransporter = {
    id: transporters.length + 1,
    ...data,
    status: 'active'
  };
  transporters.push(newTransporter);
  return newTransporter;
}

export function getStats(manufacturerId) {
  const mfgShipments = manufacturerId ? shipments.filter(s => s.manufacturerId === manufacturerId) : shipments;
  return {
    total: mfgShipments.length,
    pending: mfgShipments.filter(s => s.status === 'pending').length,
    assigned: mfgShipments.filter(s => s.status === 'assigned').length,
    inTransit: mfgShipments.filter(s => ['picked_up', 'in_transit', 'at_hub'].includes(s.status)).length,
    delivered: mfgShipments.filter(s => s.status === 'delivered').length,
  };
}
