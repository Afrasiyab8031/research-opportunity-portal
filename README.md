# University Research Opportunity Portal

A FastAPI, MySQL, HTML, CSS, and JavaScript application for managing faculty research opportunities. Authentication is intentionally not included because it is outside the assignment requirements.

## Requirements

- Python 3.10+
- MySQL running locally
- A database named `research_portal`

## Setup

1. Create the database and tables by running `backend/database_schema.sql` in MySQL.
2. Create a virtual environment and install dependencies:

	```bash
	python -m venv venv
	source venv/bin/activate
	pip install -r requirements.txt
	```

3. Copy `.env.example` to `.env` and enter your local MySQL values. The `.env` file is ignored by Git.
4. Start the application from the project root:

	```bash
	uvicorn backend.app:app --reload
	```

5. Open <http://127.0.0.1:8000> for the frontend or <http://127.0.0.1:8000/docs> for Swagger API testing.

## API endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/api/opportunities` | Create an opportunity |
| GET | `/api/opportunities` | List all opportunities |
| GET | `/api/opportunities/{id}` | View one opportunity |
| PUT | `/api/opportunities/{id}` | Update an opportunity |
| DELETE | `/api/opportunities/{id}` | Delete an opportunity |

The API validates required fields with `400 Bad Request`, accepts `Open` or `Closed` status values, returns `404` for missing records, and returns `201` after a successful create.

## Postman

Import `postman/research-opportunity-portal.postman_collection.json`. The collection includes three create requests, list and detail requests, update and close requests, deletion followed by a deleted-record `404`, and an invalid request for validation testing.

## Database

The SQL schema is included in `backend/database_schema.sql`. SQLAlchemy also calls `create_all` when the application starts, but creating the database itself and configuring `.env` is still required.

## Repository and demonstration

Add the final GitHub repository URL here before submission. Record the required one-minute demonstration after verifying the frontend, API, and Postman collection.
