/**
 * API helper - transforms backend response to frontend format
 */
import { API_BASE } from './config';

const statusToSnake = {
  Created: 'pending',
  Assigned: 'assigned',
  'Picked Up': 'picked_up',
  'In Transit': 'in_transit',
  'Arrived at Hub': 'at_hub',
  'Handed Over': 'handed_over',
  Delivered: 'delivered',
};

export const statusToBackend = {
  pending: 'Created',
  assigned: 'Assigned',
  picked_up: 'Picked Up',
  in_transit: 'In Transit',
  at_hub: 'Arrived at Hub',
  handed_over: 'Handed Over',
  delivered: 'Delivered',
};

export function mapShipment(api) {
  if (!api) return null;
  return {
    id: api.shipment_id || String(api.id),
    numericId: api.id,
    manufacturerId: api.manufacturer_id,
    pickup: {
      address: api.pickup_address,
      city: api.pickup_city,
      contactPerson: api.receiver_name || '',
    },
    delivery: {
      receiverName: api.receiver_name,
      address: api.delivery_address,
      city: api.destination_city,
      phone: api.phone,
    },
    goods: {
      description: api.goods_description || '',
      quantity: api.quantity || 1,
      weight: api.weight ? String(api.weight) : null,
    },
    status: statusToSnake[api.status] || api.status?.toLowerCase() || 'pending',
    assignedTransporter: api.assigned_transporter ?? null,
    currentTransporter: api.current_transporter ?? null,
    createdAt: api.created_at,
    timeline: (api.timeline || api.events || []).map((e) => ({
      event: e.status || e.event,
      time: e.timestamp || e.time,
      actor: e.transporter_name || 'System',
    })),
  };
}

export function mapTransporter(api) {
  if (!api) return null;
  return {
    id: api.id,
    name: api.transporter_name || api.name,
    city: api.operating_city || api.city,
    contact: api.contact,
    routes: api.route ? [api.route] : [],
    status: api.status || 'active',
  };
}
