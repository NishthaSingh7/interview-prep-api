# Interview Prep API

A REST API for interview preparation. Browse and manage coding problems organized by **algorithm pattern** (Two Pointers, Sliding Window, etc.) and **difficulty** (Easy, Medium, Hard).

## Overview

This API provides a structured catalog of interview-style coding problems. Each problem is linked to an algorithm pattern, making it easier to practice by topic and track coverage across difficulty levels.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js |
| Framework | Express 5 |
| Database | MongoDB (Atlas) |
| ODM | Mongoose |

## Project Structure

```
interview-prep-api/
├── server.js                 # Entry point
├── src/
│   ├── app.js                # Express app setup
│   ├── config/db.js          # MongoDB connection
│   ├── models/               # Pattern & Problem schemas
│   ├── routes/               # API routes
│   └── controllers/          # Request handlers
├── .env.example              # Environment variable template
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas cluster (or local MongoDB)

### Installation

```bash
git clone https://github.com/NishthaSingh7/interview-prep-api.git
cd interview-prep-api
npm install
```

### Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | Required |
| `PORT` | Server port | `6000` |

### Run Locally

```bash
npm run dev
```

Server starts at `http://localhost:6000`.

## API Reference

Base URL: `/api/v1`

### Patterns

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/patterns` | Create a new pattern |

**Create a pattern:**

```bash
curl -X POST http://localhost:6000/api/v1/patterns \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Two Pointers",
    "slug": "two-pointers",
    "description": "Use two indices to scan an array"
  }'
```

### Problems

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/problems` | Create a new problem |
| GET | `/problems` | List all problems (supports filters) |
| GET | `/problems/:slug` | Get one problem by slug |

**Query parameters for `GET /problems`:**

| Param | Example | Description |
|-------|---------|-------------|
| `difficulty` | `?difficulty=Easy` | Filter by Easy, Medium, or Hard |
| `patternId` | `?patternId=abc123` | Filter by pattern ObjectId |
| `search` | `?search=two` | Case-insensitive search on title |

**Create a problem:**

```bash
curl -X POST http://localhost:6000/api/v1/problems \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Two Sum",
    "slug": "two-sum",
    "difficulty": "Easy",
    "patternId": "<pattern-object-id>",
    "tags": ["array", "hashmap"],
    "leetcodeLink": "https://leetcode.com/problems/two-sum/"
  }'
```

**List problems:**

```bash
curl "http://localhost:6000/api/v1/problems?difficulty=Easy&search=sum"
```

### Response Format

Successful responses:

```json
{
  "success": true,
  "data": { }
}
```

List responses include a count:

```json
{
  "success": true,
  "count": 5,
  "data": [ ]
}
```

Error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

## Data Models

### Pattern

| Field | Type | Notes |
|-------|------|-------|
| name | String | Required, unique |
| slug | String | Required, unique |
| description | String | Optional |

### Problem

| Field | Type | Notes |
|-------|------|-------|
| title | String | Required |
| slug | String | Required, unique |
| difficulty | String | `Easy`, `Medium`, or `Hard` |
| patternId | ObjectId | References a Pattern |
| tags | [String] | Default: `[]` |
| leetcodeLink | String | Optional |

## License

ISC
