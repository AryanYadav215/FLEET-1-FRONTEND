"""
Fleet1 - B2B Logistics ERP Backend
Flask API with Supabase PostgreSQL, JWT auth, CORS for Vercel frontend
"""
import os
from flask import Flask, jsonify
from flask_cors import CORS

from config import config
from database.db import init_db
from models import User, Shipment, Transporter, ShipmentAssignment, ShipmentEvent, HandoverEvent  # noqa: F401 - register models
from routes import register_blueprints


def create_app(config_name=None):
    config_name = config_name or os.getenv("FLASK_ENV", "development")
    app = Flask(__name__)
    app.config.from_object(config[config_name])

    # CORS - allow frontend (Vercel, localhost)
    cors_origins = os.getenv(
        "CORS_ORIGINS",
        "http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000,http://127.0.0.1:5173",
    )
    origins_list = [o.strip() for o in cors_origins.split(",") if o.strip()]
    CORS(
        app,
        origins=origins_list,
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    )

    init_db(app)
    register_blueprints(app)

    @app.route("/")
    def health():
        return jsonify({"status": "ok", "service": "Fleet1 API"}), 200

    @app.route("/health")
    def health_check():
        return jsonify({"status": "healthy"}), 200

    return app


app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=os.getenv("FLASK_ENV") == "development")
