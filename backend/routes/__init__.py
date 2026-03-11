"""
Fleet1 API Routes
"""
from routes.auth_routes import auth_routes
from routes.shipment_routes import shipment_routes
from routes.transporter_routes import transporter_routes
from routes.operations_routes import operations_routes


def register_blueprints(app):
    """Register all API blueprints (routes at root: /signup, /shipments, etc.)"""
    app.register_blueprint(auth_routes)
    app.register_blueprint(shipment_routes)
    app.register_blueprint(transporter_routes)
    app.register_blueprint(operations_routes)
