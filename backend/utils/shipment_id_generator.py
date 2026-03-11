"""
Shipment ID generator for Fleet1
Generates unique human-readable shipment identifiers
"""
import uuid


def generate_shipment_id() -> str:
    """Generate unique shipment ID (e.g. F1-A1B2C3D4E5)"""
    return f"F1-{uuid.uuid4().hex[:10].upper()}"
