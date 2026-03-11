# Fleet1 Logistics ERP

Aggregator Logistics ERP platform with **Frontend + Backend API**.

## Tech Stack

Frontend:
- React
- Vite
- CSS

Backend:
- Python Flask
- Supabase PostgreSQL
- SQLAlchemy ORM
- JWT Authentication
- Flask-CORS

## Project Structure
Fleet1
├── frontend
│ ├── components
│ ├── pages
│ ├── assets
│ └── App.jsx
│
├── backend
│ ├── app.py
│ ├── routes
│ ├── models
│ ├── services
│ └── requirements.txt


## Backend Setup

### 1. Create Virtual Environment

```bash
python -m venv venv
venv\Scripts\activate   # Windows
# or
source venv/bin/activate   # Linux / Mac

2. Install Dependencies
pip install -r requirements.txt
3. Configure Environment Variables

Create a .env file and add:

DATABASE_URL=your_supabase_url
SECRET_KEY=your_secret_key
JWT_SECRET_KEY=your_jwt_secret_key

4. Run the Backend Server
python app.py

Backend will run at:

http://localhost:5000