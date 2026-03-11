"""
Transporter API routes for Fleet1
POST /transporters - Create transporter (admin)
GET /transporters - List transporters
"""
from flask import Blueprint, request, jsonify
from utils.auth_decorator import login_required, role_required
from services.transporter_service import create_transporter, get_transporters

transporter_routes = Blueprint("transporters", __name__)


@transporter_routes.route("/transporters", methods=["POST"])
@login_required
@role_required("admin", "operations")
def create_transporter_route(user):
    """POST /transporters - Create a new transporter (admin/operations)"""
    data = request.get_json()
    if not data:
        return jsonify({"message": "Invalid JSON"}), 400

    transporter_name = data.get("transporter_name")
    operating_city = data.get("operating_city")
    contact = data.get("contact")
    route = data.get("route")

    if not all([transporter_name, operating_city, contact]):
        return jsonify({"message": "transporter_name, operating_city, and contact required"}), 400

    transporter = create_transporter(
        transporter_name=transporter_name,
        operating_city=operating_city,
        contact=contact,
        route=route,
    )
    return jsonify(transporter.to_dict()), 201


@transporter_routes.route("/transporters", methods=["GET"])
@login_required
def list_transporters_route(user):
    """GET /transporters - List transporters"""
    operating_city = request.args.get("operating_city")
    transporters = get_transporters(operating_city=operating_city)
    return jsonify([t.to_dict() for t in transporters]), 200
