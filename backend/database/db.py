"""
Database connection and initialization for Fleet1
Uses SQLAlchemy with Supabase PostgreSQL
"""
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """Base class for all SQLAlchemy models"""
    pass


db = SQLAlchemy(model_class=Base)


def init_db(app):
    """Initialize SQLAlchemy with Flask app and create tables"""
    db.init_app(app)
    with app.app_context():
        db.create_all()
