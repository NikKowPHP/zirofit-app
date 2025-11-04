# API Documentation vs Codebase Implementation Discrepancies

This document compares the API endpoints documented in `API_DOCUMENTATION.md` (generated OpenAPI spec) against the actual API calls implemented in `lib/api.ts` in the zirofit-app codebase.

## Summary

The API documentation appears to be auto-generated from the backend route handlers, while `lib/api.ts` contains the client-side functions that make requests to these endpoints. There are several discrepancies, including missing endpoints, method mismatches, and unused documented endpoints.

## Endpoints Used in Code but Missing in Documentation

The following endpoints are called in `lib/api.ts` but not documented in `API_DOCUMENTATION.md`:

- `/workout/templates` (GET) - Used in `getWorkoutTemplates()`
- `/workout/history` (GET) - Used in `getWorkoutHistory()`
- `/workout/history/{sessionId}` (GET) - Used in `getSessionDetails(sessionId)`
- `/client/assessments` (GET) - Used in `getClientAssessments()`
- `/trainer/programs/{programId}` (GET) - Used in `getProgramDetails(programId)`
- `/trainer/programs/{programId}/templates` (POST) - Used in `createTemplate(programId, payload)`
- `/trainer/templates/{templateId}` (GET) - Used in `getTemplateDetails(templateId)`
- `/trainer/templates/{templateId}/exercises` (POST) - Used in `addExerciseToTemplate(templateId, payload)`
- `/trainer/templates/{templateId}/exercises/{exerciseId}` (DELETE) - Used in `removeExerciseFromTemplate(templateId, exerciseId)`
- `/clients/{clientId}/session/active` (GET) - Used in `getActiveClientWorkoutSession(clientId)`
- `/workout/session/{sessionId}/add-exercise` (POST) - Used in `addExerciseToLiveSession(sessionId, payload)`

## Endpoints in Documentation but Not Used in Code

Many documented endpoints in `API_DOCUMENTATION.md` are not called in `lib/api.ts`. This may indicate unused backend routes or incomplete client implementation. Key examples include:

### Authentication & User Management
- `/api/auth/sync-user` (POST)
- `/api/auth/signout` (POST)
- `/api/auth/register` (POST)
- `/api/auth/login` (POST)

### Notifications & Webhooks
- `/api/notifications` (GET)
- `/api/notifications/{id}` (PUT)
- `/api/webhooks/stripe` (POST)

### Trainer Profile Management
- `/api/trainer/profile` (GET) - Note: code uses `/profile/me` which is different
- `/api/trainer/assessments` (GET)
- `/api/trainer/clients/{id}` (GET, PUT, DELETE) - Partially covered, but specific client operations missing
- `/api/trainer/calendar/{sessionId}` (PUT, DELETE) - Calendar session updates not implemented

### Client Management
- `/api/clients/request-link` (POST)
- `/api/clients/{id}/photos` (GET, POST)
- `/api/clients/{id}/packages` (GET)
- `/api/clients/{id}/measurements` (GET, POST)
- `/api/clients/{id}/measurements/{measurementId}` (PUT, DELETE)
- `/api/clients/{id}/exercise-logs` (POST)
- `/api/clients/{id}/assessments` (GET, POST)
- `/api/clients/{id}/assessments/{resultId}` (PUT, DELETE)
- `/api/client/trainer/link` (POST, DELETE)

### Workout Sessions
- `/api/workout-sessions/{id}/summary` (GET)
- `/api/workout-sessions/{id}/save-as-template` (POST)
- `/api/workout-sessions/{id}/comments` (POST)
- `/api/workout-sessions/{id}/rest/start` (POST)
- `/api/workout-sessions/{id}/rest/end` (POST)
- `/api/workout-sessions/{id}/sessions/{sessionId}` (PUT, DELETE) - Appears to be incorrectly documented

### Trainer Public Profile
- `/api/trainers/{username}/testimonials` (GET)
- `/api/trainers/{username}/schedule` (GET)
- `/api/trainers/{username}/packages` (GET)

### Profile Management (Extensive)
- `/api/profile/me/text-content` (GET, PUT)
- `/api/profile/me/social-links` (GET, POST)
- `/api/profile/me/social-links/{linkId}` (PUT, DELETE)
- `/api/profile/me/external-links` (GET, POST)
- `/api/profile/me/external-links/{linkId}` (PUT, DELETE)
- `/api/profile/me/exercises` (GET, POST)
- `/api/profile/me/exercises/{exerciseId}` (PUT, DELETE)
- `/api/profile/me/core-info` (GET) - Only PUT is used in code
- `/api/profile/me/billing` (GET, POST)
- `/api/profile/me/benefits` (GET, POST)
- `/api/profile/me/benefits/order` (PUT)
- `/api/profile/me/benefits/{benefitId}` (PUT, DELETE)
- `/api/profile/me/availability` (GET, PUT)
- `/api/profile/me/assessments` (GET, POST)

### Public & Miscellaneous
- `/api/public/workout-summary/{sessionId}` (GET)
- `/api/bookings/{bookingId}/decline` (PUT)
- `/api/bookings/{bookingId}/confirm` (PUT)
- `/api/exercises/find-media` (GET)
- `/api/openapi` (GET)
- `/api/trainer/programs/templates` (POST) - Similar to existing but different path
- `/api/trainer/programs/templates/{templateId}/rest` (GET)
- `/api/trainer/programs/templates/{templateId}/exercises` (PUT)
- `/api/trainer/programs/templates/{templateId}/copy` (POST)
- `/api/trainer/calendar/sessions/{sessionId}/remind` (POST)

## Method Mismatches

- `/api/profile/me/transformation-photos`: Docs show POST and GET, code uses POST for upload and DELETE for specific photos, but no GET implementation in client.

## Parameter & Path Mismatches

- **Path Variations**: Some paths differ slightly:
  - Code uses `/trainer/calendar` with query params, docs match.
  - Code uses `/trainers/{trainerId}/packages`, docs use `/api/trainers/{username}/packages` - parameter name difference but same structure.
  - Code uses `/profile/me/transformations`, docs use `/api/profile/me/transformation-photos` - different naming.

- **Query Parameters**: 
  - `/api/trainer/calendar` GET: Docs specify `startDate` and `endDate` as query params, code implements this correctly.

- **Request Bodies**: 
  - Most POST/PUT bodies match between docs and code implementation.
  - `/api/trainer/calendar` POST: Both specify `clientId`, `startTime`, `endTime`, `notes`, `templateId`, `repeats`, `repeatWeeks`.

## Recommendations

1. **Update Documentation**: Add missing endpoints used in code to `API_DOCUMENTATION.md`.
2. **Implement Missing Client Calls**: Add client functions in `lib/api.ts` for documented but unused endpoints if they are intended for use.
3. **Standardize Paths**: Ensure consistent path naming (e.g., `transformations` vs `transformation-photos`).
4. **Verify Backend**: Confirm that all documented endpoints actually exist in the backend implementation.
5. **Remove Unused Routes**: Consider removing unused backend routes to reduce maintenance burden.
6. **Add Request/Response Schemas**: The current documentation lacks detailed request/response schemas, making it harder to catch mismatches.

## Auto-Generated Nature

The documentation appears to be auto-generated from Next.js route handlers, which explains why some client-used endpoints might be missing if the backend routes are not properly set up or if there are path discrepancies. This highlights the importance of keeping client and server implementations in sync.
