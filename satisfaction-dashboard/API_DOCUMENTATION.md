# SatisfyIQ API Documentation

> Base URL: `http://localhost:3000/api`

---

## Authentication

### `POST /api/auth`

Authenticate a user with demo credentials.

**Request Body:**
```json
{
  "userId": "ADMIN001",
  "password": "admin123",
  "role": "college_admin"
}
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "ADMIN001",
    "name": "Campus Admin",
    "role": "college_admin",
    "collegeId": "college-default-001"
  }
}
```

**Response (401):**
```json
{ "error": "Invalid credentials" }
```

**Demo Credentials:**
| Role | User ID | Password |
|------|---------|----------|
| Admin | `ADMIN001` | `admin123` |
| Student | `STU2024001` | `student123` |

---

## Feedback

### `GET /api/feedback`

Retrieve all feedback submissions.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `serviceId` | string | Filter by service (e.g., `cafeteria`, `library`) |

**Response (200):**
```json
[
  {
    "_id": "664f...",
    "studentId": "STU2024001",
    "studentName": "Aarav Sharma",
    "isAnonymous": false,
    "serviceId": "cafeteria",
    "serviceName": "Cafeteria",
    "collegeId": "college-default-001",
    "ratings": {
      "food_quality": 4,
      "hygiene": 5,
      "staff_behavior": 4,
      "waiting_time": 3,
      "menu_variety": 4
    },
    "overallSatisfaction": 4,
    "comment": "Great variety of dishes now!",
    "submittedAt": "2026-04-01T08:30:00.000Z"
  }
]
```

### `POST /api/feedback`

Submit new feedback.

**Request Body:**
```json
{
  "studentId": "STU2024001",
  "studentName": "Aarav Sharma",
  "isAnonymous": false,
  "serviceId": "cafeteria",
  "serviceName": "Cafeteria",
  "ratings": {
    "food_quality": 4,
    "hygiene": 5,
    "staff_behavior": 4,
    "waiting_time": 3,
    "menu_variety": 4
  },
  "overallSatisfaction": 4,
  "comment": "Great food, but long queues."
}
```

**Response (201):**
```json
{
  "success": true,
  "id": "664f..."
}
```

**Response (400):**
```json
{ "error": "Missing required fields" }
```

**Required Fields:** `serviceId`, `ratings`, `overallSatisfaction`

---

## Analytics

### `GET /api/analytics`

Retrieve aggregated analytics dashboard data.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `serviceId` | string | Filter analytics to a specific service |

**Response (200):**
```json
{
  "metrics": {
    "totalFeedback": 162,
    "avgSatisfaction": 3.85,
    "weeklyResponses": 42,
    "topServiceScore": 4.2,
    "totalFeedbackDelta": 12.5,
    "avgSatisfactionDelta": 0.3,
    "weeklyResponsesDelta": 8.2
  },
  "trends": [
    { "date": "03/15", "score": 4.1, "count": 8 }
  ],
  "ratingDistribution": [
    { "rating": 1, "count": 5 },
    { "rating": 2, "count": 12 },
    { "rating": 3, "count": 45 },
    { "rating": 4, "count": 58 },
    { "rating": 5, "count": 42 }
  ],
  "serviceBreakdown": [
    {
      "serviceId": "cafeteria",
      "serviceName": "Cafeteria",
      "avgScore": 3.9,
      "totalFeedback": 35,
      "trend": "up"
    }
  ]
}
```

---

## AI Chatbot

### `POST /api/chatbot`

Send a message to the Groq-powered AI assistant.

**Request Body:**
```json
{
  "message": "What services are tracked?",
  "history": [
    { "role": "user", "content": "Hello" },
    { "role": "assistant", "content": "Hi! How can I help?" }
  ]
}
```

**Response (200):**
```json
{
  "reply": "SatisfyIQ tracks 5 campus services:\n1. **Cafeteria**\n2. **Library**\n3. **Online Course Portal**\n4. **Hostel**\n5. **Campus Events**"
}
```

**Response (500):**
```json
{ "error": "Chatbot API error: ..." }
```

**Notes:**
- Requires `GROQ_API_KEY` in environment
- History is optional (used for conversation context)
- Model: `llama-3.3-70b-versatile`

---

## Database Connection Test

### `GET /api/db-test`

Test MongoDB connection status.

**Response (200):**
```json
{
  "status": "connected",
  "database": "satisfaction_dashboard"
}
```

---

## Services Reference

| Service ID | Service Name | Rating Categories |
|-----------|-------------|-------------------|
| `cafeteria` | Cafeteria | Food Quality, Hygiene, Staff Behavior, Waiting Time, Menu Variety |
| `library` | Library | Book Availability, Quietness, Seating Space, Staff Support |
| `online-course` | Online Course Portal | Content Quality, Platform Usability, Instructor Support, Video Quality |
| `hostel` | Hostel | Room Cleanliness, Facilities, Security, Warden Support, WiFi Connectivity |
| `campus-event` | Campus Events | Organization, Content Relevance, Venue Quality, Timing & Schedule |

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | Yes | MongoDB connection string |
| `NEXT_PUBLIC_USE_MOCK_DATA` | No | Set to `false` to use MongoDB (default: mock) |
| `GROQ_API_KEY` | Yes (for chatbot) | Groq API key for AI assistant |

## Seeder

Seed the database with 150+ sample feedback records:

```bash
node scripts/seed.mjs
```
