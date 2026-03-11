"""
JWT utility for Fleet1 - token generation and validation
"""
import jwt
from datetime import datetime, timedelta
from flask import current_app


def generate_token(user_id: int, email: str, role: str) -> str:
    """Generate JWT access token for authenticated user"""
    payload = {
        "sub": user_id,
        "email": email,
        "role": role,
        "iat": datetime.utcnow(),
        "exp": datetime.utcnow() + timedelta(seconds=current_app.config.get("JWT_ACCESS_TOKEN_EXPIRES", 86400)),
    }
    secret = current_app.config.get("JWT_SECRET", current_app.config.get("SECRET_KEY", "secret"))
    algorithm = current_app.config.get("JWT_ALGORITHM", "HS256")
    return jwt.encode(payload, secret, algorithm=algorithm)


def decode_token(token: str) -> dict | None:
    """Decode and validate JWT token. Returns payload dict or None if invalid/expired."""
    try:
        secret = current_app.config.get("JWT_SECRET", current_app.config.get("SECRET_KEY", "secret"))
        algorithm = current_app.config.get("JWT_ALGORITHM", "HS256")
        payload = jwt.decode(token, secret, algorithms=[algorithm])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
