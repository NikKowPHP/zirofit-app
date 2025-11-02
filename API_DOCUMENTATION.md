# ZIRO.FIT Mobile API Documentation

This document outlines the API endpoints specifically created or adapted for the React Native mobile application.

## Authentication

All endpoints require authentication. The client must include an `Authorization` header with a valid Supabase JWT token.

**Format:**
```
Authorization: Bearer <your_supabase_jwt_token>
```

---

## Shared Endpoints

These endpoints can be accessed by both `client` and `trainer` roles.

### 1. Get Dashboard Data (Unified)

- **Path:** `GET /api/dashboard`
- **Description:** Retrieves the appropriate dashboard data for the authenticated user based on their role (`trainer` or `client`). This is the recommended endpoint for fetching initial dashboard data after login.
- **Auth:** `client` or `trainer` role required.
- **Success Response (200 OK):**
  - The structure of the `data` object will differ based on the user's role.
  - **For Trainers:**
    ```json
    {
      "data": {
        "businessPerformance": { /* ... */ },
        "clientEngagement": { /* ... */ },
        "servicePopularity": { /* ... */ },
        "upcomingSessions": [ /* ... */ ],
        "activityFeed": [ /* ... */ ],
        "profileChecklist": { /* ... */ }
      }
    }
    ```
  - **For Clients:**
    ```json
    {
      "data": {
        "clientData": {
          "id": "...",
          "name": "Test Client",
          "trainer": { /* ... */ },
          "workoutSessions": [ /* ... */ ],
          "measurements": [ /* ... */ ]
        },
        "weightUnit": "KG"
      }
    }
    ```

### 2. Get Exercise Library

- **Path:** `GET /api/exercises`
- **Description:** Fetches all system exercises plus custom exercises relevant to the user (their own if a trainer, their trainer's if a client).
- **Auth:** `client` or `trainer` role required.
- **Success Response (200 OK):**
  ```json
  {
    "data": {
      "exercises": [
        {
          "id": "...",
          "name": "Barbell Squat",
          "muscleGroup": "Legs",
          "createdById": null
        }
      ]
    }
  }
  ```

### 3. Get Active Workout Session

- **Path:** `GET /api/workout/session/active` (alias for `/api/workout-sessions/live`)
- **Description:** Retrieves the user's currently active workout session, if one exists.
- **Auth:** `client` or `trainer` role required.
- **Success Response (200 OK):**
  ```json
  {
    "data": {
      "session": {
        "id": "session-id-string",
        "status": "IN_PROGRESS",
        "startTime": "...",
        "exerciseLogs": [ /* ... */ ]
      }
    }
  }
  ```

### 4. Log an Exercise Set

- **Path:** `POST /api/workout/log`
- **Description:** Creates or updates a single exercise set log within a workout session.
- **Auth:** `client` or `trainer` role required.
- **Request Body:**
  ```json
  {
    "logId": "existing-log-id-for-updates", // Optional
    "workoutSessionId": "active-session-id",
    "exerciseId": "exercise-id-string",
    "reps": 10,
    "weight": 100
  }
  ```
- **Success Response (201 Created or 200 OK):**
  ```json
  {
    "data": {
      "log": { /* ... created/updated log object ... */ },
      "newRecords": [ /* ... any new personal records achieved ... */ ]
    }
  }
  ```

### 5. Register Push Notification Token

- **Path:** `POST /api/profile/me/push-token`
- **Description:** Registers a new push notification token for the authenticated user.
- **Auth:** `client` or `trainer` role required.
- **Request Body:**
  ```json
  {
    "token": "ExponentPushToken[...]"
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "data": {
      "message": "Push token registered successfully."
    }
  }
  ```

---

## Trainer Endpoints

### 1. Get Trainer Dashboard (**DEPRECATED**)

**Note:** Use the unified `GET /api/dashboard` endpoint instead.

- **Path:** `GET /api/trainer/dashboard`
- **Description:** Retrieves an aggregation of all data needed for the main trainer dashboard view.
- **Auth:** `trainer` role required.

### 2. Get Trainer Programs & Templates

- **Path:** `GET /api/trainer/programs`
- **Description:** Fetches all workout programs and templates, separating user-created ones from system defaults.
- **Auth:** `trainer` role required.
- **Success Response (200 OK):**
  ```json
  {
    "data": {
      "userPrograms": [ /* ... */ ],
      "systemPrograms": [ /* ... */ ],
      "userTemplates": [ /* ... */ ],
      "systemTemplates": [ /* ... */ ]
    }
  }
  ```

### 3. Get Calendar Events

- **Path:** `GET /api/trainer/calendar`
- **Description:** Retrieves all calendar events (bookings and planned sessions) for the trainer within a given date range.
- **Auth:** `trainer` role required.
- **Query Params:**
  - `startDate` (string, ISO 8601 format, e.g., `2025-10-01`)
  - `endDate` (string, ISO 8601 format, e.g., `2025-10-31`)
- **Success Response (200 OK):**
  ```json
  {
    "data": {
      "events": [
        {
          "id": "...",
          "title": "Workout: Client Name",
          "start": "2025-10-15T10:00:00.000Z",
          "end": "2025-10-15T11:00:00.000Z",
          "type": "session_planned",
          "clientId": "..."
        }
      ]
    }
  }
  ```

### 4. Plan a Workout Session

- **Path:** `POST /api/trainer/calendar`
- **Description:** Creates one or more planned workout sessions for a client.
- **Auth:** `trainer` role required.
- **Request Body:**
  ```json
  {
    "clientId": "client-id-string",
    "startTime": "2025-11-20T14:00:00",
    "endTime": "2025-11-20T15:00:00",
    "notes": "Focus on form.",
    "templateId": "template-id-string",
    "repeats": true,
    "repeatWeeks": 4
  }
  ```
- **Success Response (201 Created):**
  ```json
  {
    "data": {
      "message": "4 session(s) planned successfully."
    }
  }
  ```
- **Error Response (409 Conflict):**
  ```json
  {
    "error": {
      "message": "A conflict was detected for the session on..."
    }
  }
  ```

### 5. Alias Endpoints

For API path consistency, the following aliases exist:
- `GET /api/trainer/clients` -> `GET /api/clients`
- `POST /api/trainer/clients` -> `POST /api/clients`
- `GET /api/trainer/clients/[id]` -> `GET /api/clients/[id]`
- `GET /api/trainer/profile` -> `GET /api/profile/me`

---

## Client Endpoints

### 1. Get Client Dashboard (**DEPRECATED**)

**Note:** Use the unified `GET /api/dashboard` endpoint instead.

- **Path:** `GET /api/client/dashboard`
- **Description:** Retrieves an aggregation of all data needed for the main client dashboard view.
- **Auth:** `client` role required.

### 2. Get Client Progress Data

- **Path:** `GET /api/client/progress`
- **Description:** Fetches all historical measurements and workout sessions for the client to build progress charts.
- **Auth:** `client` role required.
- **Success Response (200 OK):**
  ```json
  {
    "data": {
      "measurements": [ /* ... */ ],
      "workoutSessions": [ /* ... */ ]
    }
  }
  ```

### 3. Get "My Trainer" Info

- **Path:** `GET /api/client/trainer`
- **Description:** Fetches the profile information for the client's linked trainer.
- **Auth:** `client` role required.
- **Success Response (200 OK):**
  ```json
  {
    "data": {
      "trainer": {
        "id": "...",
        "name": "Nik Kowalev",
        "username": "nik-kowalev",
        "email": "nik.kowalev@gmail.com",
        "profile": { /* ... */ }
      }
    }
  }
  ```
