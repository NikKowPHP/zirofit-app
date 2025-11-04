# API Alignment Refactor Todo List

This todo list outlines the steps needed to refactor the client-side API implementation in `lib/api.ts` to align with the backend API endpoints documented in `API_DOCUMENTATION.md`. The goal is to ensure full compatibility between frontend API calls and backend routes.

## High Priority - Critical Missing Endpoints

### Authentication & Core User Management
- [ ] **Add auth endpoints**: Implement client functions for `/api/auth/sync-user`, `/api/auth/signout`, `/api/auth/register`, `/api/auth/login`
- [ ] **Add GET /api/profile/me/core-info**: Currently only PUT is implemented, add GET method
- [ ] **Update profile endpoint**: Change `/profile/me` references to use documented paths where appropriate

### Workout Session Management
- [ ] **Add workout session summary**: Implement `getWorkoutSessionSummary(sessionId)` for `/api/workout-sessions/{id}/summary`
- [ ] **Add save as template**: Implement `saveWorkoutAsTemplate(sessionId)` for `/api/workout-sessions/{id}/save-as-template`
- [ ] **Add session comments**: Implement `addSessionComment(sessionId, comment)` for `/api/workout-sessions/{id}/comments`
- [ ] **Add rest timer endpoints**: Implement `startRestTimer(sessionId)` and `endRestTimer(sessionId)` for rest endpoints
- [ ] **Update workout history**: Verify `/workout/history` and `/workout/history/{sessionId}` match `/api/workout-sessions/history` and `/api/workout-sessions/{id}`

### Client Management
- [ ] **Add client request link**: Implement `requestClientLink()` for `/api/clients/request-link`
- [ ] **Add client photos management**: Implement functions for `/api/clients/{id}/photos` (GET, POST)
- [ ] **Add client measurements**: Implement functions for `/api/clients/{id}/measurements` (GET, POST, PUT, DELETE)
- [ ] **Add client exercise logs**: Implement `logClientExercise()` for `/api/clients/{id}/exercise-logs`
- [ ] **Add client assessments**: Implement functions for `/api/clients/{id}/assessments` (GET, POST, PUT, DELETE)
- [ ] **Add trainer link management**: Implement `linkToTrainer()` and `unlinkFromTrainer()` for `/api/client/trainer/link`

## Medium Priority - Existing Endpoint Updates

### Path Standardization
- [ ] **Standardize transformation photos**: Change `/profile/me/transformations` to `/profile/me/transformation-photos` to match docs
- [ ] **Update trainer packages**: Ensure `/trainers/{trainerId}/packages` uses `username` parameter consistently
- [ ] **Fix workout session paths**: Update paths from `/workout/session/*` to `/workout-sessions/*` where applicable

### Method Completion
- [ ] **Add missing GET methods**: Add GET implementations for endpoints that only have POST/PUT in client but docs show GET
- [ ] **Add transformation photos GET**: Implement `getTransformationPhotos()` for the documented GET method
- [ ] **Add testimonials GET**: Ensure GET method is properly implemented for testimonials

### Trainer Profile Management
- [ ] **Add trainer profile GET**: Implement `getTrainerProfile()` for `/api/trainer/profile` (separate from `/profile/me`)
- [ ] **Add trainer assessments**: Implement `getTrainerAssessments()` for `/api/trainer/assessments`
- [ ] **Add calendar session management**: Implement `updateCalendarSession()` and `deleteCalendarSession()` for `/api/trainer/calendar/{sessionId}`

## Low Priority - Additional Features

### Notifications & Webhooks
- [ ] **Add notifications**: Implement functions for `/api/notifications` and `/api/notifications/{id}`
- [ ] **Add webhook handling**: Implement `handleStripeWebhook()` for `/api/webhooks/stripe`

### Public Endpoints
- [ ] **Add public workout summary**: Implement `getPublicWorkoutSummary()` for `/api/public/workout-summary/{sessionId}`
- [ ] **Add trainer public profile**: Implement functions for `/api/trainers/{username}/testimonials`, `/schedule`, `/packages`

### Extended Profile Management
- [ ] **Add text content management**: Implement functions for `/api/profile/me/text-content`
- [ ] **Add social links**: Implement functions for `/api/profile/me/social-links` and sub-endpoints
- [ ] **Add external links**: Implement functions for `/api/profile/me/external-links`
- [ ] **Add billing management**: Implement functions for `/api/profile/me/billing`
- [ ] **Add benefits management**: Implement functions for `/api/profile/me/benefits` and ordering
- [ ] **Add availability**: Implement functions for `/api/profile/me/availability`
- [ ] **Add exercises management**: Implement functions for `/api/profile/me/exercises`

### Bookings & Miscellaneous
- [ ] **Add booking confirmations**: Implement `confirmBooking()` and `declineBooking()` for booking endpoints
- [ ] **Add exercise media search**: Implement `findExerciseMedia()` for `/api/exercises/find-media`
- [ ] **Add OpenAPI endpoint**: Implement `getOpenAPISpec()` for `/api/openapi`
- [ ] **Add template operations**: Implement functions for `/api/trainer/programs/templates/*` endpoints

## Implementation Tasks

### Code Structure Updates
- [ ] **Update apiFetch function**: Ensure all endpoints use the correct base path and parameter handling
- [ ] **Add TypeScript types**: Create proper TypeScript interfaces for all request/response bodies based on documented schemas
- [ ] **Update error handling**: Ensure consistent error handling for all new endpoints
- [ ] **Add query parameter handling**: Implement proper query parameter serialization for GET requests

### Testing & Validation
- [ ] **Add API tests**: Create unit tests for all new API functions
- [ ] **Update existing tests**: Modify tests to use updated endpoint paths and methods
- [ ] **Validate against backend**: Test all endpoints against actual backend to ensure compatibility

### Documentation Updates
- [ ] **Update API_DISCREPANCIES.md**: Mark completed items and update status
- [ ] **Add JSDoc comments**: Add comprehensive JSDoc comments to all API functions with parameter and return types
- [ ] **Create API usage guide**: Document how to use the updated API functions in the codebase

## Removal Tasks

### Deprecated Endpoints
- [ ] **Remove unused endpoints**: Remove client functions for endpoints that don't exist in backend docs if they're truly unused
- [ ] **Clean up imports**: Remove any unused imports related to removed endpoints
- [ ] **Update calling code**: Update all files that call removed or changed API functions

## Verification Steps

- [ ] **Run full test suite**: Ensure all API calls work with updated implementation
- [ ] **Check network requests**: Verify that all network requests match documented endpoints
- [ ] **Validate data flow**: Ensure request/response data matches documented schemas
- [ ] **Cross-platform testing**: Test on web, iOS, and Android to ensure consistency

## Notes

- Prioritize endpoints actually used in the current UI/UX flows
- Focus on authentication and core workout functionality first
- Consider implementing endpoints in batches to avoid breaking changes
- Update any hardcoded endpoint strings in components that bypass `lib/api.ts`
- Coordinate with backend team if any documented endpoints don't actually exist
