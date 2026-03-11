"""
User model for Fleet1 - authentication and roles
"""
from datetime import datetime
from database.db import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50), nullable=False)  # manufacturer, transporter, operations, admin
    company_name = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    shipments_created = db.relationship("Shipment", back_populates="manufacturer", foreign_keys="Shipment.manufacturer_id")
    assignments_made = db.relationship("ShipmentAssignment", back_populates="assigned_by_user", foreign_keys="ShipmentAssignment.assigned_by")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "company_name": self.company_name,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
