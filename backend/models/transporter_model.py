"""
Transporter model for Fleet1 - Admin creates and lists transporters
"""
from datetime import datetime
from database.db import db


class Transporter(db.Model):
    __tablename__ = "transporters"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    transporter_name = db.Column(db.String(255), nullable=False)
    operating_city = db.Column(db.String(100), nullable=False)
    route = db.Column(db.String(500))
    contact = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    assignments = db.relationship("ShipmentAssignment", back_populates="transporter", cascade="all, delete-orphan")
    events = db.relationship("ShipmentEvent", back_populates="transporter", foreign_keys="ShipmentEvent.transporter_id")

    def to_dict(self):
        return {
            "id": self.id,
            "transporter_name": self.transporter_name,
            "operating_city": self.operating_city,
            "route": self.route,
            "contact": self.contact,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class HandoverEvent(db.Model):
    """handover_events table - When shipments move between cities and transporters"""
    __tablename__ = "handover_events"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    shipment_id = db.Column(db.Integer, db.ForeignKey("shipments.id"), nullable=False)
    from_transporter = db.Column(db.Integer, db.ForeignKey("transporters.id"))
    to_transporter = db.Column(db.Integer, db.ForeignKey("transporters.id"))
    city = db.Column(db.String(100))
    time = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "shipment_id": self.shipment_id,
            "from_transporter": self.from_transporter,
            "to_transporter": self.to_transporter,
            "city": self.city,
            "time": self.time.isoformat() if self.time else None,
        }
