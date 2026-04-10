# Backend Service

Express API for picks management.

## Quick Start

1. Install dependencies:
   npm install
2. Create environment file:
   cp .env.example .env
3. Update DB credentials in .env
4. Start server:
   npm start

## Health Check

- Endpoint: /healthz
- Returns app uptime, environment, DB readiness, and timestamp.

## Required Database Schema

Use a MySQL database with at least this table:

```sql
CREATE TABLE picks (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(100) NOT NULL,
  description TEXT NULL,
  date DATE NOT NULL DEFAULT (CURRENT_DATE),
  PRIMARY KEY (id)
);
```

## API Endpoints

- GET /api/picks
- POST /api/picks

POST payload example:

```json
{
  "title": "Scottie Scheffler Top 10",
  "description": "Strong strokes gained profile this week"
}
```
