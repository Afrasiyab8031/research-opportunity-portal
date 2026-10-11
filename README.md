# University Research Opportunity Portal

A web application that lets faculty members post, view, update, close and delete research opportunities in one place, replacing scattered emails, WhatsApp groups and noticeboards.


| | |
|---|---|
| **Student** | Afrasiyab khan |
| **Reg. No** | 24P-0011 |
| **Program** | BS (AI 5A), Fall-2026 |
| **Course** | CN, Assignment No. 1 |

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python, FastAPI, SQLAlchemy |
| Database | MySQL |
| Frontend | HTML, CSS, JavaScript (no frameworks) |
| API Testing | Postman |

## Features

- Full CRUD on research opportunities, stored in MySQL (no hard-coded data)
- Proper HTTP status codes: `200`, `201`, `400`, `404`, `500`
- Server-side input validation (Pydantic)
- Frontend to list, view details, create, edit, close (Open to Closed) and delete opportunities
- Client-side form validation with success and error messages

## Project Structure

```
24P-0011/
├── backend/            # FastAPI REST API
│   ├── app/            # application code
│   ├── schema.sql      # database schema
│   └── .env.example    # environment variable template
├── frontend/           # HTML, CSS, JS interface
│   ├── index.html
│   ├── style.css
│   └── script.js
├── postman/            # exported Postman collection
├── requirements.txt    # Python dependencies
└── README.md
```

## Prerequisites

- Python 3.10+
- MySQL Server 8+
- Git
- Postman (for testing)

## Setup and Run Instructions

### 1. Clone the repository

```bash
git clone https://github.com/israrkhan-cys/research-opportunity-portal.git
cd research-opportunity-portal
```

### 2. Create a virtual environment and install dependencies

```bash
python3 -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Set up the database

Start MySQL and open the MySQL shell:

```bash
sudo systemctl start mysql
sudo mysql
```

Create a database user (choose your own password):

```sql
CREATE USER 'portal_user'@'localhost' IDENTIFIED BY 'your_password_here';
GRANT ALL PRIVILEGES ON research_portal.* TO 'portal_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

Create the database and table from the schema file:

```bash
sudo mysql < backend/schema.sql
```

### 4. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` with your own values:

```env
DB_USER=portal_user
DB_PASSWORD=your_password_here
DB_HOST=localhost
DB_PORT=3306
DB_NAME=research_portal
```

> `.env` is listed in `.gitignore` and is never committed.

### 5. Run the backend

```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

- API base URL: `http://localhost:8000`
- Interactive docs (Swagger): `http://localhost:8000/docs`

### 6. Run the frontend

In a second terminal:

```bash
cd frontend
python3 -m http.server 5500
```

Open **http://localhost:5500** in your browser.

> The backend allows CORS from `http://localhost:5500`. If you serve the frontend on a different port, update the allowed origins in `backend/app/main.py` and the `API_URL` in `frontend/script.js`.

## API Documentation

Base URL: `http://localhost:8000/api/opportunities`

| Method | Endpoint | Description | Success Code |
|---|---|---|---|
| POST | `/api/opportunities` | Create a research opportunity | 201 Created |
| GET | `/api/opportunities` | Get all research opportunities | 200 OK |
| GET | `/api/opportunities/:id` | Get one opportunity by ID | 200 OK |
| PUT | `/api/opportunities/:id` | Update an opportunity | 200 OK |
| DELETE | `/api/opportunities/:id` | Delete an opportunity | 200 OK |

### Opportunity fields

| Field | Type | Notes |
|---|---|---|
| `id` | integer | Auto-generated unique ID |
| `title` | string | Required |
| `description` | string | Required |
| `research_area` | string | Required |
| `faculty_name` | string | Required |
| `department` | string | Required |
| `required_skills` | string | Required |
| `positions` | integer | Required, 0 or more |
| `deadline` | date (`YYYY-MM-DD`) | Required |
| `status` | `Open` or `Closed` | Defaults to `Open` |

### Example request

`POST /api/opportunities`

```json
{
  "title": "Deep Learning for Medical Imaging",
  "description": "Research on CNN-based tumor detection from MRI scans.",
  "research_area": "Artificial Intelligence",
  "faculty_name": "Dr. Ahmed Khan",
  "department": "Computer Science",
  "required_skills": "Python, PyTorch, Image Processing",
  "positions": 3,
  "deadline": "2026-12-31",
  "status": "Open"
}
```

### Error responses

| Code | Meaning | Example cause |
|---|---|---|
| 400 Bad Request | Invalid or missing input | Empty title, negative positions, invalid status |
| 404 Not Found | Record does not exist | Requesting a deleted or non-existent ID |
| 500 Internal Server Error | Unexpected server or database error | Database connection failure |


## Security Notes

- Database credentials are stored in `backend/.env`, which is excluded from Git.
- Only `backend/.env.example` (with placeholder values) is committed.
- No passwords, API keys or tokens are present in this repository.

