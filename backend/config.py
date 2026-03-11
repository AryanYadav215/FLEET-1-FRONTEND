"""
Fleet1 Backend Configuration
Uses Supabase PostgreSQL via SUPABASE_DB_URL
"""
import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    """Base configuration"""
    SECRET_KEY = os.getenv("SECRET_KEY", "fleet1-dev-secret-key-change-in-production")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {"pool_pre_ping": True, "pool_recycle": 300}

    # JWT settings - use JWT_SECRET as specified in env
    JWT_SECRET = os.getenv("JWT_SECRET", os.getenv("SECRET_KEY", "fleet1-jwt-secret-change-in-production"))
    JWT_ALGORITHM = "HS256"
    JWT_ACCESS_TOKEN_EXPIRES = 86400  # 24 hours in seconds

    # Supabase PostgreSQL - SUPABASE_DB_URL or fallback to DATABASE_URL
    SUPABASE_DB_URL = os.getenv(
        "SUPABASE_DB_URL",
        os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/postgres")
    )
    SQLALCHEMY_DATABASE_URI = SUPABASE_DB_URL


class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True


class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    SECRET_KEY = os.getenv("SECRET_KEY")
    JWT_SECRET = os.getenv("JWT_SECRET")


config = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "default": DevelopmentConfig,
}
