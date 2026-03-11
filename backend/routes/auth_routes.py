"""
Authentication API routes for Fleet1
POST /signup - Register new user
POST /login - Authenticate and get JWT token
"""
from flask import Blueprint, request, jsonify
from services.auth_service import signup, login

auth_routes = Blueprint("auth", __name__)


@auth_routes.route("/signup", methods=["POST"])
def signup_route():
    """POST /signup - Register a new user"""
    data = request.get_json()
    if not data:
        return jsonify({"message": "Invalid JSON"}), 400

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role")
    company_name = data.get("company_name") or data.get("company")

    if not all([name, email, password, role]):
        return jsonify({"message": "Missing required fields: name, email, password, role"}), 400

    user, error = signup(name, email, password, role, company_name)
    if error:
        return jsonify({"message": error}), 400

    return jsonify({
        "message": "User registered successfully",
        "user": user.to_dict(),
    }), 201


@auth_routes.route("/login", methods=["POST"])
def login_route():
    """POST /login - Authenticate and get JWT token"""
    data = request.get_json()
    if not data:
        return jsonify({"message": "Invalid JSON"}), 400

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Email and password required"}), 400

    result, error = login(email, password)
    if error:
        return jsonify({"message": error}), 401

    return jsonify(result), 200
