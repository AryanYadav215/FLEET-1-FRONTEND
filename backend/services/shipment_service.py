"""
Shipment service for Fleet1
Manages shipments, assignments, status updates, timeline events
"""
from database.db import db
from models.shipment_model import Shipment, ShipmentAssignment
from models.shipment_event_model import ShipmentEvent
from models.transporter_model import Transporter
from utils.shipment_id_generator import generate_shipment_id

VALID_STATUSES = {
    "Created",
    "Assigned",
    "Picked Up",
    "In Transit",
    "Arrived at Hub",
    "Handed Over",
    "Delivered",
}


def create_shipment(
    manufacturer_id: int,
    pickup_address: str,
    pickup_city: str,
    receiver_name: str,
    delivery_address: str,
    destination_city: str,
    phone: str,
    goods_description: str = None,
    quantity: int = 1,
    weight: float = None,
) -> Shipment:
    """Create a new shipment - manufacturers create shipments"""
    shipment = Shipment(
        shipment_id=generate_shipment_id(),
        manufacturer_id=manufacturer_id,
        pickup_address=pickup_address,
        pickup_city=pickup_city,
        receiver_name=receiver_name,
        delivery_address=delivery_address,
        destination_city=destination_city,
        phone=phone,
        goods_description=goods_description or "",
        quantity=quantity,
        weight=weight,
        status="Created",
    )
    db.session.add(shipment)
    db.session.commit()

    event = ShipmentEvent(
        shipment_id=shipment.id,
        status="Created",
        location=pickup_address,
        transporter_id=None,
    )
    db.session.add(event)
    db.session.commit()

    return shipment


def get_shipments(manufacturer_id: int = None, status: str = None):
    """Get shipments, optionally filtered by manufacturer or status"""
    q = Shipment.query
    if manufacturer_id is not None:
        q = q.filter(Shipment.manufacturer_id == manufacturer_id)
    if status:
        q = q.filter(Shipment.status == status)
    return q.order_by(Shipment.created_at.desc()).all()


def get_shipment_by_id(shipment_id: int) -> Shipment | None:
    """Get shipment by primary key id"""
    return Shipment.query.get(shipment_id)


def assign_transporter(shipment_id: int, transporter_id: int, assigned_by: int) -> tuple[dict | None, str]:
    """
    Operations team assigns transporter to shipment.
    Returns (assignment_dict, None) on success, (None, error_message) on failure.
    """
    shipment = get_shipment_by_id(shipment_id)
    if not shipment:
        return None, "Shipment not found"

    if shipment.status == "Delivered":
        return None, "Cannot assign transporter to delivered shipment"

    transporter = Transporter.query.get(transporter_id)
    if not transporter:
        return None, "Transporter not found"

    assignment = ShipmentAssignment(
        shipment_id=shipment_id,
        transporter_id=transporter_id,
        assigned_by=assigned_by,
    )
    db.session.add(assignment)
    shipment.status = "Assigned"
    db.session.commit()

    event = ShipmentEvent(
        shipment_id=shipment_id,
        status="Assigned",
        location=shipment.pickup_address,
        transporter_id=transporter_id,
    )
    db.session.add(event)
    db.session.commit()

    return assignment.to_dict(), None


def update_shipment_status(
    shipment_id: int,
    status: str,
    location: str = None,
    transporter_id: int = None,
) -> tuple[Shipment | None, str]:
    """
    Update shipment status and add timeline event.
    Returns (shipment, None) on success, (None, error_message) on failure.
    """
    shipment = get_shipment_by_id(shipment_id)
    if not shipment:
        return None, "Shipment not found"

    if status not in VALID_STATUSES:
        return None, f"Invalid status. Must be one of: {', '.join(sorted(VALID_STATUSES))}"

    shipment.status = status
    event = ShipmentEvent(
        shipment_id=shipment_id,
        status=status,
        location=location or shipment.delivery_address,
        transporter_id=transporter_id,
    )
    db.session.add(event)
    db.session.commit()

    return shipment, None


def get_shipment_timeline(shipment_id: int) -> list:
    """Get timeline events for a shipment"""
    shipment = get_shipment_by_id(shipment_id)
    if not shipment:
        return []
    return [e.to_dict() for e in shipment.events]
