"""
ShipmentEvent model for Fleet1 - shipment timeline
Every shipment status update creates a timeline event
"""
from datetime import datetime
from database.db import db


class ShipmentEvent(db.Model):
    __tablename__ = "shipment_events"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    shipment_id = db.Column(db.Integer, db.ForeignKey("shipments.id"), nullable=False)
    status = db.Column(db.String(50), nullable=False)
    location = db.Column(db.String(255))
    transporter_id = db.Column(db.Integer, db.ForeignKey("transporters.id"))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    shipment = db.relationship("Shipment", back_populates="events")
    transporter = db.relationship("Transporter", back_populates="events", foreign_keys=[transporter_id])

    def to_dict(self):
        return {
            "id": self.id,
            "shipment_id": self.shipment_id,
            "status": self.status,
            "location": self.location,
            "transporter_id": self.transporter_id,
            "timestamp": self.timestamp.isoformat() if self.timestamp else None,
        }
