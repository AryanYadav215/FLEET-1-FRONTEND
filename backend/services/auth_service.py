"""
Authentication service for Fleet1
Handles signup, login with bcrypt password hashing and JWT tokens
"""
import bcrypt
from utils.jwt_helper import generate_token
from database.db import db
from models.user_model import User

VALID_ROLES = {"manufacturer", "transporter", "operations", "admin"}


def hash_password(password: str) -> str:
    """Hash password using bcrypt"""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


def verify_password(password_hash: str, password: str) -> bool:
    """Verify password against bcrypt hash"""
    try:
        return bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8"))
    except (ValueError, AttributeError):
        return False


def signup(name: str, email: str, password: str, role: str, company_name: str = None) -> tuple[User | None, str]:
    """
    Register a new user.
    Returns (User, None) on success, (None, error_message) on failure.
    """
    if role not in VALID_ROLES:
        return None, f"Invalid role. Must be one of: {', '.join(sorted(VALID_ROLES))}"

    if User.query.filter_by(email=email).first():
        return None, "Email already registered"

    user = User(
        name=name,
        email=email,
        password=hash_password(password),
        role=role,
        company_name=company_name or "",
    )
    db.session.add(user)
    db.session.commit()
    return user, None


def login(email: str, password: str) -> tuple[dict | None, str]:
    """
    Authenticate user and return JWT token + user info.
    Returns (response_dict, None) on success, (None, error_message) on failure.
    """
    user = User.query.filter_by(email=email).first()
    if not user:
        return None, "Invalid email or password"

    if not verify_password(user.password, password):
        return None, "Invalid email or password"

    token = generate_token(user.id, user.email, user.role)
    return {
        "token": token,
        "user": user.to_dict(),
    }, None
