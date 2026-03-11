"""
JWT authentication decorator for Fleet1 - protects routes with login/role checks
"""
from functools import wraps
from flask import request, jsonify
from utils.jwt_helper import decode_token
from models.user_model import User


def get_current_user():
    """
    Extract and validate JWT from Authorization header.
    Returns (user, None) on success, (None, error_response_tuple) on failure.
    """
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return None, (jsonify({"message": "Missing or invalid authorization header"}), 401)

    token = auth_header.split(" ")[1]
    payload = decode_token(token)
    if not payload:
        return None, (jsonify({"message": "Invalid or expired token"}), 401)

    user_id = payload.get("sub")
    user = User.query.get(user_id)
    if not user:
        return None, (jsonify({"message": "User not found"}), 401)

    return user, None


def login_required(f):
    """Decorator: require valid JWT. Injects current user as first arg."""
    @wraps(f)
    def decorated(*args, **kwargs):
        user, err = get_current_user()
        if err:
            return err
        return f(user, *args, **kwargs)
    return decorated


def role_required(*roles):
    """Decorator: require login + one of the given roles."""
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            user, err = get_current_user()
            if err:
                return err
            if user.role not in roles:
                return jsonify({"message": "Insufficient permissions"}), 403
            return f(user, *args, **kwargs)
        return decorated
    return decorator
