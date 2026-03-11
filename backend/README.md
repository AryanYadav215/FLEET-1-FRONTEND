# Fleet1 Backend

Flask REST API for the Fleet1 B2B logistics ERP platform. Integrates with Supabase PostgreSQL and the Vercel-deployed frontend.

## Tech Stack

- **Framework:** Flask
- **Database:** Supabase PostgreSQL
- **ORM:** SQLAlchemy
- **Auth:** JWT + bcrypt
- **CORS:** Enabled for frontend

## Setup

### 1. Create virtual environment

```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/macOS
source venv/bin/activate
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure environment

```bash
copy .env.example .env
```

Edit `.env` and set:

- `SUPABASE_DB_URL` – Supabase PostgreSQL connection string (Supabase Dashboard → Settings → Database)
- `JWT_SECRET` – Secret key for JWT (32+ characters)
- `FLASK_ENV` – `development` or `production`
- `CORS_ORIGINS` – Comma-separated frontend origins (e.g. your Vercel URL for production)

### 4. Run the server

```bash
python app.py
```

Server runs at **http://localhost:5000**

## API Endpoints

### Auth

| Method | Endpoint   | Description        |
|--------|------------|--------------------|
| POST   | /signup    | Register new user  |
| POST   | /login     | Login, returns JWT |

### Shipments

| Method | Endpoint                 | Description                |
|--------|--------------------------|----------------------------|
| POST   | /shipments               | Create shipment (auth)     |
| GET    | /shipments               | List shipments (auth)      |
| GET    | /shipments/<id>          | Get shipment (auth)        |
| GET    | /shipments/<id>/timeline | Get shipment timeline      |

### Transporters

| Method | Endpoint    | Description           |
|--------|-------------|-----------------------|
| POST   | /transporters | Create transporter (admin) |
| GET    | /transporters | List transporters (auth)  |

### Operations

| Method | Endpoint          | Description                  |
|--------|-------------------|------------------------------|
| POST   | /assign-transporter | Assign transporter to shipment |
| POST   | /update-status    | Update shipment status       |

## Authentication

All endpoints except `/signup` and `/login` require a Bearer token:

```
Authorization: Bearer <JWT_TOKEN>
```

Include the token returned by `/login` in the `Authorization` header for protected requests.

## Example requests

**Signup:**
```json
POST /signup
{
  "name": "John Doe",
  "email": "john@company.com",
  "password": "securepass",
  "role": "manufacturer",
  "company_name": "Acme Corp"
}
```

**Login:**
```json
POST /login
{
  "email": "john@company.com",
  "password": "securepass"
}
```

**Create shipment (requires JWT):**
```json
POST /shipments
Authorization: Bearer <token>
{
  "pickup_address": "123 Main St",
  "pickup_city": "Mumbai",
  "receiver_name": "Jane Smith",
  "delivery_address": "456 Oak Ave",
  "destination_city": "Delhi",
  "phone": "+91 9876543210",
  "goods_description": "Electronics",
  "quantity": 1,
  "weight": 5.5
}
```
