"""
Operations API routes for Fleet1
POST /assign-transporter - Assign transporter to shipment
POST /update-status - Update shipment status (transporter/operations)
"""
from flask import Blueprint, request, jsonify
from utils.auth_decorator import login_required, role_required
from services.shipment_service import assign_transporter, update_shipment_status

operations_routes = Blueprint("operations", __name__)


@operations_routes.route("/assign-transporter", methods=["POST"])
@login_required
@role_required("operations", "admin")
def assign_transporter_route(user):
    """POST /assign-transporter - Assign transporter to shipment"""
    data = request.get_json()
    if not data:
        return jsonify({"message": "Invalid JSON"}), 400

    shipment_id = data.get("shipment_id")
    transporter_id = data.get("transporter_id")

    if not shipment_id or not transporter_id:
        return jsonify({"message": "shipment_id and transporter_id required"}), 400

    result, error = assign_transporter(shipment_id, transporter_id, user.id)
    if error:
        return jsonify({"message": error}), 400

    return jsonify({"message": "Transporter assigned", "assignment": result}), 200


@operations_routes.route("/update-status", methods=["POST"])
@login_required
@role_required("transporter", "operations", "admin")
def update_status_route(user):
    """POST /update-status - Update shipment status"""
    data = request.get_json()
    if not data:
        return jsonify({"message": "Invalid JSON"}), 400

    shipment_id = data.get("shipment_id")
    status = data.get("status")
    location = data.get("location")
    transporter_id = data.get("transporter_id")

    if not shipment_id or not status:
        return jsonify({"message": "shipment_id and status required"}), 400

    shipment, error = update_shipment_status(shipment_id, status, location, transporter_id)
    if error:
        return jsonify({"message": error}), 400

    return jsonify({"message": "Status updated", "shipment": shipment.to_dict()}), 200
