"""
Shipment API routes for Fleet1
POST /shipments - Create shipment (manufacturer)
GET /shipments - List shipments
GET /shipments/<id> - Get shipment by id
GET /shipments/<id>/timeline - Get shipment timeline
"""
from flask import Blueprint, request, jsonify
from utils.auth_decorator import login_required, role_required
from services.shipment_service import (
    create_shipment,
    get_shipments,
    get_shipment_by_id,
    get_shipment_timeline,
)

shipment_routes = Blueprint("shipments", __name__)


@shipment_routes.route("/shipments", methods=["POST"])
@login_required
@role_required("manufacturer", "admin")
def create_shipment_route(user):
    """POST /shipments - Create a new shipment (manufacturer/admin)"""
    data = request.get_json()
    if not data:
        return jsonify({"message": "Invalid JSON"}), 400

    manufacturer_id = user.id if user.role == "manufacturer" else data.get("manufacturer_id", user.id)
    if user.role == "admin" and data.get("manufacturer_id"):
        manufacturer_id = data["manufacturer_id"]

    required = ["pickup_address", "pickup_city", "receiver_name", "delivery_address", "destination_city", "phone"]
    missing = [f for f in required if not data.get(f)]
    if missing:
        return jsonify({"message": f"Missing required fields: {', '.join(missing)}"}), 400

    shipment = create_shipment(
        manufacturer_id=manufacturer_id,
        pickup_address=data["pickup_address"],
        pickup_city=data["pickup_city"],
        receiver_name=data["receiver_name"],
        delivery_address=data["delivery_address"],
        destination_city=data["destination_city"],
        phone=data["phone"],
        goods_description=data.get("goods_description"),
        quantity=data.get("quantity", 1),
        weight=data.get("weight"),
    )
    return jsonify(shipment.to_dict()), 201


@shipment_routes.route("/shipments", methods=["GET"])
@login_required
def list_shipments_route(user):
    """GET /shipments - List shipments (filtered by manufacturer for manufacturer role)"""
    manufacturer_id = request.args.get("manufacturer_id", type=int)
    status = request.args.get("status")

    if user.role == "manufacturer":
        manufacturer_id = user.id

    shipments = get_shipments(manufacturer_id=manufacturer_id, status=status)
    return jsonify([s.to_dict() for s in shipments]), 200


@shipment_routes.route("/shipments/<int:shipment_id>", methods=["GET"])
@login_required
def get_shipment_route(user, shipment_id):
    """GET /shipments/<id> - Get shipment by ID"""
    shipment = get_shipment_by_id(shipment_id)
    if not shipment:
        return jsonify({"message": "Shipment not found"}), 404

    if user.role == "manufacturer" and shipment.manufacturer_id != user.id:
        return jsonify({"message": "Shipment not found"}), 404

    return jsonify(shipment.to_dict()), 200


@shipment_routes.route("/shipments/<int:shipment_id>/timeline", methods=["GET"])
@login_required
def get_timeline_route(user, shipment_id):
    """GET /shipments/<id>/timeline - Get shipment timeline"""
    shipment = get_shipment_by_id(shipment_id)
    if not shipment:
        return jsonify({"message": "Shipment not found"}), 404

    if user.role == "manufacturer" and shipment.manufacturer_id != user.id:
        return jsonify({"message": "Shipment not found"}), 404

    timeline = get_shipment_timeline(shipment_id)
    return jsonify({"timeline": timeline}), 200
