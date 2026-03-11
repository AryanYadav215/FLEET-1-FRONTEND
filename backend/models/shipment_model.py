"""
Shipment model for Fleet1
Statuses: Created, Assigned, Picked Up, In Transit, Arrived at Hub, Handed Over, Delivered
"""
from datetime import datetime
from database.db import db


class Shipment(db.Model):
    __tablename__ = "shipments"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    shipment_id = db.Column(db.String(100), unique=True, nullable=False, index=True)
    manufacturer_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    pickup_address = db.Column(db.String(500), nullable=False)
    pickup_city = db.Column(db.String(100), nullable=False)
    receiver_name = db.Column(db.String(255), nullable=False)
    delivery_address = db.Column(db.String(500), nullable=False)
    destination_city = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(50), nullable=False)
    goods_description = db.Column(db.String(500))
    quantity = db.Column(db.Integer, default=1)
    weight = db.Column(db.Float)
    status = db.Column(db.String(50), default="Created")  # Created, Assigned, Picked Up, In Transit, Arrived at Hub, Handed Over, Delivered
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    manufacturer = db.relationship("User", back_populates="shipments_created", foreign_keys=[manufacturer_id])
    assignments = db.relationship("ShipmentAssignment", back_populates="shipment", cascade="all, delete-orphan")
    events = db.relationship("ShipmentEvent", back_populates="shipment", cascade="all, delete-orphan", order_by="ShipmentEvent.timestamp")

    def to_dict(self):
        return {
            "id": self.id,
            "shipment_id": self.shipment_id,
            "manufacturer_id": self.manufacturer_id,
            "pickup_address": self.pickup_address,
            "pickup_city": self.pickup_city,
            "receiver_name": self.receiver_name,
            "delivery_address": self.delivery_address,
            "destination_city": self.destination_city,
            "phone": self.phone,
            "goods_description": self.goods_description,
            "quantity": self.quantity,
            "weight": self.weight,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class ShipmentAssignment(db.Model):
    """shipment_assignments table - Operations assigns transporters to shipments"""
    __tablename__ = "shipment_assignments"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    shipment_id = db.Column(db.Integer, db.ForeignKey("shipments.id"), nullable=False)
    transporter_id = db.Column(db.Integer, db.ForeignKey("transporters.id"), nullable=False)
    assigned_by = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    assigned_at = db.Column(db.DateTime, default=datetime.utcnow)

    shipment = db.relationship("Shipment", back_populates="assignments")
    transporter = db.relationship("Transporter", back_populates="assignments")
    assigned_by_user = db.relationship("User", back_populates="assignments_made", foreign_keys=[assigned_by])

    def to_dict(self):
        return {
            "id": self.id,
            "shipment_id": self.shipment_id,
            "transporter_id": self.transporter_id,
            "assigned_by": self.assigned_by,
            "assigned_at": self.assigned_at.isoformat() if self.assigned_at else None,
        }
