"""
Transporter service for Fleet1
Admin creates and lists transporters
"""
from database.db import db
from models.transporter_model import Transporter


def create_transporter(
    transporter_name: str,
    operating_city: str,
    contact: str,
    route: str = None,
) -> Transporter:
    """Create a new transporter - Admin users"""
    transporter = Transporter(
        transporter_name=transporter_name,
        operating_city=operating_city,
        route=route or "",
        contact=contact,
    )
    db.session.add(transporter)
    db.session.commit()
    return transporter


def get_transporters(operating_city: str = None):
    """Get transporters, optionally filtered by operating_city"""
    q = Transporter.query
    if operating_city:
        q = q.filter(Transporter.operating_city.ilike(f"%{operating_city}%"))
    return q.order_by(Transporter.transporter_name).all()
