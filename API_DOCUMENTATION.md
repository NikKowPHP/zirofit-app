{
  "openapi": "3.1.0",
  "info": {
    "title": "zirofit-next Documentation",
    "description": "Automatically generated documentation based on available route handlers.",
    "version": "1.0.0"
  },
  "servers": [
    {
      "url": "http://localhost:3000",
      "description": "Configured application URL."
    }
  ],
  "paths": {
    "/api/trainers": {
      "get": {
        "summary": "GET /api/trainers",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "trainers"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/openapi": {
      "get": {
        "summary": "GET /api/openapi",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "openapi"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/notifications": {
      "get": {
        "summary": "GET /api/notifications",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "notifications"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/exercises": {
      "get": {
        "summary": "GET /api/exercises",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "exercises"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/dashboard": {
      "get": {
        "summary": "GET /api/dashboard",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "dashboard"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/clients": {
      "get": {
        "summary": "GET /api/clients",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "clients"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      },
      "post": {
        "summary": "POST /api/clients",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "clients"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/bookings": {
      "get": {
        "summary": "GET /api/bookings",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "bookings"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      },
      "post": {
        "summary": "POST /api/bookings",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "bookings"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/workout-sessions/start": {
      "post": {
        "summary": "POST /api/workout-sessions/start",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "workout-sessions"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/workout-sessions/live": {
      "get": {
        "summary": "GET /api/workout-sessions/live",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "workout-sessions"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      },
      "post": {
        "summary": "POST /api/workout-sessions/live",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "workout-sessions"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/workout-sessions/history": {
      "get": {
        "summary": "GET /api/workout-sessions/history",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "workout-sessions"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/workout-sessions/finish": {
      "post": {
        "summary": "POST /api/workout-sessions/finish",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "workout-sessions"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/workout-sessions/{id}": {
      "get": {
        "summary": "GET /api/workout-sessions/{id}",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "workout-sessions"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      },
      "put": {
        "summary": "PUT /api/workout-sessions/{id}",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "workout-sessions"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/workout/log": {
      "post": {
        "summary": "POST /api/workout/log",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "workout"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/webhooks/stripe": {
      "post": {
        "summary": "POST /api/webhooks/stripe",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "webhooks"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/trainers/{username}": {
      "get": {
        "summary": "GET /api/trainers/{username}",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "trainers"
        ],
        "parameters": [
          {
            "name": "username",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/trainer/profile": {
      "get": {
        "summary": "GET /api/trainer/profile",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "trainer"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/trainer/clients": {
      "get": {
        "summary": "GET /api/trainer/clients",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "trainer"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      },
      "post": {
        "summary": "POST /api/trainer/clients",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "trainer"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/trainer/programs": {
      "get": {
        "summary": "GET /api/trainer/programs",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "trainer"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      },
      "post": {
        "summary": "POST /api/trainer/programs",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "trainer"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/trainer/calendar": {
      "get": {
        "summary": "GET /api/trainer/calendar",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "trainer"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      },
      "post": {
        "summary": "POST /api/trainer/calendar",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "trainer"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/trainer/assessments": {
      "get": {
        "summary": "GET /api/trainer/assessments",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "trainer"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/profile/me": {
      "get": {
        "summary": "GET /api/profile/me",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "profile"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/notifications/{id}": {
      "put": {
        "summary": "PUT /api/notifications/{id}",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "notifications"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/exercises/find-media": {
      "get": {
        "summary": "GET /api/exercises/find-media",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "exercises"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/dashboard/upcoming-sessions": {
      "get": {
        "summary": "GET /api/dashboard/upcoming-sessions",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "dashboard"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/dashboard/service-popularity": {
      "get": {
        "summary": "GET /api/dashboard/service-popularity",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "dashboard"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/dashboard/profile-checklist": {
      "get": {
        "summary": "GET /api/dashboard/profile-checklist",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "dashboard"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/dashboard/client-engagement": {
      "get": {
        "summary": "GET /api/dashboard/client-engagement",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "dashboard"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/dashboard/business-performance": {
      "get": {
        "summary": "GET /api/dashboard/business-performance",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "dashboard"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/dashboard/activity-feed": {
      "get": {
        "summary": "GET /api/dashboard/activity-feed",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "dashboard"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/clients/request-link": {
      "post": {
        "summary": "POST /api/clients/request-link",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "clients"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/clients/{id}": {
      "get": {
        "summary": "GET /api/clients/{id}",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "clients"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      },
      "put": {
        "summary": "PUT /api/clients/{id}",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "clients"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      },
      "delete": {
        "summary": "DELETE /api/clients/{id}",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "clients"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/client/trainer": {
      "get": {
        "summary": "GET /api/client/trainer",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "client"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/client/progress": {
      "get": {
        "summary": "GET /api/client/progress",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "client"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/client/dashboard": {
      "get": {
        "summary": "GET /api/client/dashboard",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "client"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/checkout/session": {
      "post": {
        "summary": "POST /api/checkout/session",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "checkout"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/auth/sync-user": {
      "post": {
        "summary": "POST /api/auth/sync-user",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "auth"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/auth/signout": {
      "post": {
        "summary": "POST /api/auth/signout",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "auth"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/auth/register": {
      "post": {
        "summary": "POST /api/auth/register",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "auth"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/auth/me": {
      "get": {
        "summary": "GET /api/auth/me",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "auth"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/auth/login": {
      "post": {
        "summary": "POST /api/auth/login",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "auth"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/workout-sessions/{id}/summary": {
      "get": {
        "summary": "GET /api/workout-sessions/{id}/summary",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "workout-sessions"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/workout-sessions/{id}/save-as-template": {
      "post": {
        "summary": "POST /api/workout-sessions/{id}/save-as-template",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "workout-sessions"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/workout-sessions/{id}/comments": {
      "post": {
        "summary": "POST /api/workout-sessions/{id}/comments",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "workout-sessions"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/workout/session/active": {
      "get": {
        "summary": "GET /api/workout/session/active",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "workout"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/trainers/{username}/testimonials": {
      "get": {
        "summary": "GET /api/trainers/{username}/testimonials",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "trainers"
        ],
        "parameters": [
          {
            "name": "username",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/trainers/{username}/schedule": {
      "get": {
        "summary": "GET /api/trainers/{username}/schedule",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "trainers"
        ],
        "parameters": [
          {
            "name": "username",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/trainers/{username}/packages": {
      "get": {
        "summary": "GET /api/trainers/{username}/packages",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "trainers"
        ],
        "parameters": [
          {
            "name": "username",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/trainer/clients/{id}": {
      "get": {
        "summary": "GET /api/trainer/clients/{id}",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "trainer"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      },
      "put": {
        "summary": "PUT /api/trainer/clients/{id}",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "trainer"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      },
      "delete": {
        "summary": "DELETE /api/trainer/clients/{id}",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "trainer"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/trainer/programs/templates": {
      "post": {
        "summary": "POST /api/trainer/programs/templates",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "trainer"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/trainer/calendar/{sessionId}": {
      "put": {
        "summary": "PUT /api/trainer/calendar/{sessionId}",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "trainer"
        ],
        "parameters": [
          {
            "name": "sessionId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      },
      "delete": {
        "summary": "DELETE /api/trainer/calendar/{sessionId}",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "trainer"
        ],
        "parameters": [
          {
            "name": "sessionId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/public/workout-summary/{sessionId}": {
      "get": {
        "summary": "GET /api/public/workout-summary/{sessionId}",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "public"
        ],
        "parameters": [
          {
            "name": "sessionId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/profile/me/transformation-photos": {
      "post": {
        "summary": "POST /api/profile/me/transformation-photos",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "profile"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      },
      "get": {
        "summary": "GET /api/profile/me/transformation-photos",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "profile"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/profile/me/text-content": {
      "get": {
        "summary": "GET /api/profile/me/text-content",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "profile"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      },
      "put": {
        "summary": "PUT /api/profile/me/text-content",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "profile"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/profile/me/testimonials": {
      "get": {
        "summary": "GET /api/profile/me/testimonials",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "profile"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      },
      "post": {
        "summary": "POST /api/profile/me/testimonials",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "profile"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/profile/me/social-links": {
      "get": {
        "summary": "GET /api/profile/me/social-links",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "profile"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      },
      "post": {
        "summary": "POST /api/profile/me/social-links",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "profile"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/profile/me/services": {
      "get": {
        "summary": "GET /api/profile/me/services",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "profile"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      },
      "post": {
        "summary": "POST /api/profile/me/services",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "profile"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/profile/me/push-token": {
      "post": {
        "summary": "POST /api/profile/me/push-token",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "profile"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/profile/me/packages": {
      "get": {
        "summary": "GET /api/profile/me/packages",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "profile"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      },
      "post": {
        "summary": "POST /api/profile/me/packages",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "profile"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/profile/me/external-links": {
      "get": {
        "summary": "GET /api/profile/me/external-links",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "profile"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      },
      "post": {
        "summary": "POST /api/profile/me/external-links",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "profile"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/profile/me/exercises": {
      "get": {
        "summary": "GET /api/profile/me/exercises",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "profile"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      },
      "post": {
        "summary": "POST /api/profile/me/exercises",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "profile"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/profile/me/core-info": {
      "get": {
        "summary": "GET /api/profile/me/core-info",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "profile"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      },
      "put": {
        "summary": "PUT /api/profile/me/core-info",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "profile"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/profile/me/billing": {
      "get": {
        "summary": "GET /api/profile/me/billing",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "profile"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      },
      "post": {
        "summary": "POST /api/profile/me/billing",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "profile"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/profile/me/availability": {
      "get": {
        "summary": "GET /api/profile/me/availability",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "profile"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      },
      "put": {
        "summary": "PUT /api/profile/me/availability",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "profile"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/profile/me/benefits": {
      "get": {
        "summary": "GET /api/profile/me/benefits",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "profile"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      },
      "post": {
        "summary": "POST /api/profile/me/benefits",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "profile"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/profile/me/assessments": {
      "get": {
        "summary": "GET /api/profile/me/assessments",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "profile"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      },
      "post": {
        "summary": "POST /api/profile/me/assessments",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "profile"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/clients/{id}/photos": {
      "get": {
        "summary": "GET /api/clients/{id}/photos",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "clients"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      },
      "post": {
        "summary": "POST /api/clients/{id}/photos",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "clients"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/clients/{id}/measurements": {
      "get": {
        "summary": "GET /api/clients/{id}/measurements",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "clients"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      },
      "post": {
        "summary": "POST /api/clients/{id}/measurements",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "clients"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/clients/{id}/packages": {
      "get": {
        "summary": "GET /api/clients/{id}/packages",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "clients"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/clients/{id}/exercise-logs": {
      "post": {
        "summary": "POST /api/clients/{id}/exercise-logs",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "clients"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/clients/{id}/assessments": {
      "get": {
        "summary": "GET /api/clients/{id}/assessments",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "clients"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      },
      "post": {
        "summary": "POST /api/clients/{id}/assessments",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "clients"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/client/trainer/link": {
      "post": {
        "summary": "POST /api/client/trainer/link",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "client"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      },
      "delete": {
        "summary": "DELETE /api/client/trainer/link",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "client"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/bookings/{bookingId}/decline": {
      "put": {
        "summary": "PUT /api/bookings/{bookingId}/decline",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "bookings"
        ],
        "parameters": [
          {
            "name": "bookingId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/bookings/{bookingId}/confirm": {
      "put": {
        "summary": "PUT /api/bookings/{bookingId}/confirm",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "bookings"
        ],
        "parameters": [
          {
            "name": "bookingId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/workout-sessions/{id}/rest/start": {
      "post": {
        "summary": "POST /api/workout-sessions/{id}/rest/start",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "workout-sessions"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/workout-sessions/{id}/rest/end": {
      "post": {
        "summary": "POST /api/workout-sessions/{id}/rest/end",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "workout-sessions"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/profile/me/transformation-photos/{photoId}": {
      "delete": {
        "summary": "DELETE /api/profile/me/transformation-photos/{photoId}",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "profile"
        ],
        "parameters": [
          {
            "name": "photoId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/profile/me/testimonials/{testimonialId}": {
      "put": {
        "summary": "PUT /api/profile/me/testimonials/{testimonialId}",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "profile"
        ],
        "parameters": [
          {
            "name": "testimonialId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      },
      "delete": {
        "summary": "DELETE /api/profile/me/testimonials/{testimonialId}",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "profile"
        ],
        "parameters": [
          {
            "name": "testimonialId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/profile/me/social-links/{linkId}": {
      "put": {
        "summary": "PUT /api/profile/me/social-links/{linkId}",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "profile"
        ],
        "parameters": [
          {
            "name": "linkId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      },
      "delete": {
        "summary": "DELETE /api/profile/me/social-links/{linkId}",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "profile"
        ],
        "parameters": [
          {
            "name": "linkId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/profile/me/services/{serviceId}": {
      "put": {
        "summary": "PUT /api/profile/me/services/{serviceId}",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "profile"
        ],
        "parameters": [
          {
            "name": "serviceId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      },
      "delete": {
        "summary": "DELETE /api/profile/me/services/{serviceId}",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "profile"
        ],
        "parameters": [
          {
            "name": "serviceId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/profile/me/packages/{packageId}": {
      "put": {
        "summary": "PUT /api/profile/me/packages/{packageId}",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "profile"
        ],
        "parameters": [
          {
            "name": "packageId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      },
      "delete": {
        "summary": "DELETE /api/profile/me/packages/{packageId}",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "profile"
        ],
        "parameters": [
          {
            "name": "packageId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/profile/me/external-links/{linkId}": {
      "put": {
        "summary": "PUT /api/profile/me/external-links/{linkId}",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "profile"
        ],
        "parameters": [
          {
            "name": "linkId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      },
      "delete": {
        "summary": "DELETE /api/profile/me/external-links/{linkId}",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "profile"
        ],
        "parameters": [
          {
            "name": "linkId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/profile/me/exercises/{exerciseId}": {
      "put": {
        "summary": "PUT /api/profile/me/exercises/{exerciseId}",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "profile"
        ],
        "parameters": [
          {
            "name": "exerciseId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      },
      "delete": {
        "summary": "DELETE /api/profile/me/exercises/{exerciseId}",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "profile"
        ],
        "parameters": [
          {
            "name": "exerciseId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/profile/me/benefits/order": {
      "put": {
        "summary": "PUT /api/profile/me/benefits/order",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "profile"
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/profile/me/benefits/{benefitId}": {
      "put": {
        "summary": "PUT /api/profile/me/benefits/{benefitId}",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "profile"
        ],
        "parameters": [
          {
            "name": "benefitId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      },
      "delete": {
        "summary": "DELETE /api/profile/me/benefits/{benefitId}",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "profile"
        ],
        "parameters": [
          {
            "name": "benefitId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/clients/{id}/sessions/{sessionId}": {
      "put": {
        "summary": "PUT /api/clients/{id}/sessions/{sessionId}",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "clients"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "sessionId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      },
      "delete": {
        "summary": "DELETE /api/clients/{id}/sessions/{sessionId}",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "clients"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "sessionId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/clients/{id}/photos/{photoId}": {
      "delete": {
        "summary": "DELETE /api/clients/{id}/photos/{photoId}",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "clients"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "photoId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/clients/{id}/measurements/{measurementId}": {
      "put": {
        "summary": "PUT /api/clients/{id}/measurements/{measurementId}",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "clients"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "measurementId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      },
      "delete": {
        "summary": "DELETE /api/clients/{id}/measurements/{measurementId}",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "clients"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "measurementId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/clients/{id}/assessments/{resultId}": {
      "put": {
        "summary": "PUT /api/clients/{id}/assessments/{resultId}",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "clients"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "resultId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      },
      "delete": {
        "summary": "DELETE /api/clients/{id}/assessments/{resultId}",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "clients"
        ],
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "resultId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/trainer/programs/templates/{templateId}/rest": {
      "get": {
        "summary": "GET /api/trainer/programs/templates/{templateId}/rest",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "trainer"
        ],
        "parameters": [
          {
            "name": "templateId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/trainer/programs/templates/{templateId}/exercises": {
      "put": {
        "summary": "PUT /api/trainer/programs/templates/{templateId}/exercises",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "trainer"
        ],
        "parameters": [
          {
            "name": "templateId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/trainer/programs/templates/{templateId}/copy": {
      "post": {
        "summary": "POST /api/trainer/programs/templates/{templateId}/copy",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "trainer"
        ],
        "parameters": [
          {
            "name": "templateId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    },
    "/api/trainer/calendar/sessions/{sessionId}/remind": {
      "post": {
        "summary": "POST /api/trainer/calendar/sessions/{sessionId}/remind",
        "description": "Auto-generated from Next.js route handler.",
        "tags": [
          "trainer"
        ],
        "parameters": [
          {
            "name": "sessionId",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successful response."
          }
        }
      }
    }
  },
  "tags": [
    {
      "name": "trainers",
      "description": "Trainers endpoints."
    },
    {
      "name": "openapi",
      "description": "Openapi endpoints."
    },
    {
      "name": "notifications",
      "description": "Notifications endpoints."
    },
    {
      "name": "exercises",
      "description": "Exercises endpoints."
    },
    {
      "name": "dashboard",
      "description": "Dashboard endpoints."
    },
    {
      "name": "clients",
      "description": "Clients endpoints."
    },
    {
      "name": "bookings",
      "description": "Bookings endpoints."
    },
    {
      "name": "workout-sessions",
      "description": "Workout-sessions endpoints."
    },
    {
      "name": "workout",
      "description": "Workout endpoints."
    },
    {
      "name": "webhooks",
      "description": "Webhooks endpoints."
    },
    {
      "name": "trainer",
      "description": "Trainer endpoints."
    },
    {
      "name": "profile",
      "description": "Profile endpoints."
    },
    {
      "name": "client",
      "description": "Client endpoints."
    },
    {
      "name": "checkout",
      "description": "Checkout endpoints."
    },
    {
      "name": "auth",
      "description": "Auth endpoints."
    },
    {
      "name": "public",
      "description": "Public endpoints."
    }
  ],
  "x-generated-at": "2025-11-05T13:27:35.445Z"
}
