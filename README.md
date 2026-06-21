# Interview Prep API

A public REST API for interview preparation. Browse coding problems organized by **algorithm pattern** (Two Pointers, Sliding Window, etc.) and **difficulty** (Easy, Medium, Hard). Users can track which problems they have practiced and add their own questions tied to a pattern.

## What This Project Is For

Interview prep often means grinding LeetCode-style problems across many patterns. This API gives you:

- A **catalog of problems** grouped by pattern and difficulty
- **Personal progress tracking** (coming soon) — mark what you've done and see stats by pattern
- **User-contributed questions** (coming soon) — add problems to the catalog from your account

The catalog is public. Progress and personal data stay private per user.

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

## API Endpoints (Current)

Base URL: `/api/v1`

### Patterns

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/patterns` | Create a new pattern |

**Example — create a pattern:**

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
| GET | `/problems` | List all problems (with filters) |
| GET | `/problems/:slug` | Get one problem by slug |

**Query filters for `GET /problems`:**

| Param | Example | Description |
|-------|---------|-------------|
| `difficulty` | `?difficulty=Easy` | Filter by Easy, Medium, or Hard |
| `patternId` | `?patternId=abc123` | Filter by pattern ObjectId |
| `search` | `?search=two` | Case-insensitive search on title |

**Example — create a problem:**

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

**Example — list problems:**

```bash
curl "http://localhost:6000/api/v1/problems?difficulty=Easy&search=sum"
```

### Response Format

All responses follow this shape:

```json
{
  "success": true,
  "data": { }
}
```

List responses also include a count:

```json
{
  "success": true,
  "count": 5,
  "data": [ ]
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

## Roadmap

Work is planned in four phases to reach a fully public API:

### Phase 1 — Complete the catalog API

- List, update, and delete patterns
- Update and delete problems
- Pagination on problem list
- Seed script with sample data

### Phase 2 — User authentication

- Register and login with JWT
- Protected routes for user-specific actions

### Phase 3 — Progress tracking

- Mark problems as done or in progress
- View personal progress and stats by pattern/difficulty
- Only authenticated users can add problems

### Phase 4 — Production readiness

- CORS, global error handler
- Deploy to Render or Railway
- Full API documentation

## How It Will Be Used

Once complete, a typical flow will look like this:

1. **Browse** — Call `GET /problems` to explore the catalog by pattern and difficulty
2. **Sign up** — Create an account via `POST /auth/register`
3. **Track progress** — Mark problems done via `POST /progress`
4. **Review stats** — Check `GET /progress/stats` to see coverage by pattern before an interview
5. **Contribute** — Add your own problems tied to a pattern from your account

A frontend app (web or mobile) can consume this API. Postman or curl works for testing today.

## Current Status

| Feature | Status |
|---------|--------|
| Create patterns | Done |
| Create & read problems | Done |
| Filter problems | Done |
| Pattern list / update / delete | Planned |
| Problem update / delete | Planned |
| User accounts | Planned |
| Progress tracking | Planned |
| Public deployment | Planned |

## License

ISC
