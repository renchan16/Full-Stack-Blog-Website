# 🚀 Full Stack Blogsite  

A modern blog platform built using **FastAPI** (backend), **Next.js** (frontend), and **PostgreSQL** (database).

---

## 📦 Tech Stack

| Technology    | Role               |
|----------------|------------------|
| FastAPI        | Backend API      |
| Next.js        | Frontend UI      |
| PostgreSQL   | Database         |
| SQLAlchemy    | ORM (for FastAPI)  |

---


---

## ⚡ Requirements

- Python 3.11+
- Node.js 18+
- PostgreSQL 14+
- FastAPI
- SQLAlchemy
- Next.js

---

## 🔧 Setup

### Backend (FastAPI)

1. Create and activate virtual environment:
    ```bash
    python -m venv venv
    source venv/bin/activate  # or venv\Scripts\activate for Windows
    ```

2. Install dependencies:
    ```bash
    pip install fastapi uvicorn psycopg2-binary sqlalchemy python-dotenv
    ```

3. Configure `.env` (sample):
    ```
    DATABASE_URL=postgresql://username:password@localhost/dbname
    ```

4. Run FastAPI server:
    ```bash
    uvicorn backend.main:app --reload
    ```

---

### Frontend (Next.js)

1. Navigate to the frontend directory:
    ```bash
    cd client
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Configure `.env.local` (sample):
    ```
    NEXT_PUBLIC_API_URL=http://localhost:8000
    ```

4. Run Next.js development server:
    ```bash
    npm run dev
    ```

---

### Database (PostgreSQL)

1. Make sure PostgreSQL is running.
2. Create the database:
    ```sql
    CREATE DATABASE mydatabase;
    ```

---

## 📮 API Endpoints Example

| Method | Endpoint         | Description       |
|----|----------------|------------------|
| GET  | /posts            | Fetch all posts |
| POST | /posts            | Create a new post |
| GET  | /posts/{id}    | Get a single post |
| PUT  | /posts/{id}    | Update a post |
| DELETE | /posts/{id} | Delete a post |

---

## ✅ Features

- Fullstack blog site
- RESTful API with FastAPI
- PostgreSQL relational database
- Frontend UI with Next.js

---

## 📖 To-Do

- [ ] Add authentication (JWT)
- [ ] Add rich text/markdown editor
- [ ] Deploy to production


