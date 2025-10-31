### **Phase 1: Backend API Implementation (Next.js)**

**Goal:** Build all the API endpoints defined in the documentation to serve the mobile app.

*   **Task 1.1: Create Trainer Dashboard Endpoint**
    *   **File:** Create `src/app/api/trainer/dashboard/route.ts`.
    *   **Action:** Implement a `GET` handler.
    *   **Logic:** Authenticate the user for the `trainer` role. Call the service functions from `dashboardService.ts` (`getBusinessPerformanceData`, `getClientEngagementData`, etc.) and aggregate the results into the documented JSON structure.

*   **Task 1.2: Create Client Dashboard Endpoint**
    *   **File:** Create `src/app/api/client/dashboard/route.ts`.
    *   **Action:** Implement a `GET` handler.
    *   **Logic:** Authenticate the user for the `client` role. Call the `fetchClientDashboardData` function from `client-dashboard/actions.ts` and return its payload.

*   **Task 1.3: Create Centralized Workout Logging Endpoint**
    *   **File:** Create `src/app/api/workout/log/route.ts`.
    *   **Action:** Implement a `POST` handler.
    *   **Logic:** Authenticate for `client` or `trainer`. Adapt the simple payload (`reps`, `weight`, `exerciseId`, `workoutSessionId`) to the detailed payload expected by the `upsertExerciseLog` function in `src/lib/api/workout-sessions.ts` and call it. Return the result.

*   **Task 1.4: Create Active Session Endpoint Alias**
    *   **File:** Create `src/app/api/workout/session/active/route.ts`.
    *   **Action:** Implement a `GET` handler.
    *   **Logic:** This route will simply call and return the response from the existing `GET` handler in `app/api/workout-sessions/live/route.ts`.

*   **Task 1.5: Create Trainer Programs Endpoint**
    *   **File:** Create `src/app/api/trainer/programs/route.ts`.
    *   **Action:** Implement a `GET` handler for the `trainer` role.
    *   **Logic:** Call the `getProgramsAndTemplates` function and return the data in the documented structure.

*   **Task 1.6: Create Calendar Endpoints**
    *   **File:** Create `src/app/api/trainer/calendar/route.ts`.
    *   **Action:** Implement `GET` and `POST` handlers.
    *   **GET Logic:** Authenticate trainer, parse `startDate` and `endDate` from query params, call `getCalendarEvents`, and return the events.
    *   **POST Logic:** Authenticate trainer, parse the request body, and call `createCalendarSession` to plan a workout.

*   **Task 1.7: Create Push Notification Token Endpoint**
    *   **Schema:** Add `pushTokens: String[]` to the `User` model in `prisma/schema.prisma`. Run `npx prisma migrate dev`.
    *   **File:** Create `src/app/api/profile/me/push-token/route.ts`.
    *   **Action:** Implement a `POST` handler.
    *   **Logic:** Authenticate the user, extract the token from the body, and add it to the user's `pushTokens` array in the database, preventing duplicates.

*   **Task 1.8: Create Generic Exercise Library Endpoint**
    *   **File:** Create `src/app/api/exercises/route.ts`.
    *   **Action:** Implement a `GET` handler for both `client` and `trainer` roles.
    *   **Logic:** Fetch and return all system exercises (`createdById: null`) plus any custom exercises relevant to the user (their own if a trainer, or their linked trainer's if a client).

---

### **Phase 2: Mobile App API Layer Refactoring (React Native)**

**Goal:** Update the mobile app's data-fetching layer to align with the new, complete backend API.

- [x] **Task 2.1: Refactor `lib/api.ts`**
    - **Action:** Modify or create functions for every endpoint in the API documentation.
    - **Checklist:**
        - [x] `getTrainerDashboard()` -> `GET /api/trainer/dashboard` (No change needed)
        - [x] `getPrograms()` -> `GET /api/trainer/programs` (No change needed)
        - [x] `getCalendarEvents(start, end)` -> `GET /api/trainer/calendar?startDate=...&endDate=...` (Implemented)
        - [x] `planSession(payload)` -> `POST /api/trainer/calendar` (Path and payload updated)
        - [x] `getClientDashboard()` -> `GET /api/client/dashboard` (No change needed)
        - [x] `getProgressData()` -> `GET /api/client/progress` (No change needed)
        - [x] `getMyTrainer()` -> `GET /api/client/trainer` (No change needed)
        - [x] `getAvailableExercises()` -> `GET /api/exercises` (No change needed)
        - [x] `getActiveWorkoutSession()` -> Path `GET /api/workout/session/active` (No change needed)
        - [x] `logSet(payload)` -> Path `POST /api/workout/log` (No change needed)
        - [x] `sendPushToken(token)` -> `POST /api/profile/me/push-token` (No change needed)
        - [x] Verify aliased paths are updated (e.g., `getClients`, `getClientDetails`, `getTrainerProfile`). (Implemented)

- [x] **Task 2.2: Update `workoutStore.ts`**
    - **Action:** Modify the `logSet` action in the store.
    - **Logic:** Ensure it constructs the full payload required by the new `logSet` function. (Verified as correct, no changes needed).

---

### **Phase 3: Mobile App Feature Implementation (React Native)**

**Goal:** Build the missing UI and features to achieve parity with the web application.

- [x] **Task 3.1: Build Client CRUD Functionality (Trainer)**
    - **File:** `app/(app)/(trainer)/(tabs)/clients/index.tsx`
    - **Action:** Add a "Create Client" button that navigates to a new form screen.
    - **Logic:** The new form will use `api.createClient`. Add edit/delete buttons to the client list items, which will navigate to an edit form or trigger a delete confirmation. (Create functionality implemented).

- [x] **Task 3.2: Enhance Trainer Dashboard**
    - **File:** `app/(app)/(trainer)/(tabs)/dashboard/index.tsx`
    - **Action:** Replace the basic dashboard with a richer view.
    - **Logic:** Use the data from `getTrainerDashboard` to render charts for performance/engagement and lists for upcoming sessions and activity. (Richer view implemented).

- [x] **Task 3.3: Build Interactive Trainer Live Session UI**
    - **File:** `app/(app)/(trainer)/client/[id]/live.tsx`
    - **Action:** Convert the component from a passive feed to an interactive controller.
    - **Logic:**
        - Use the `workoutStore` to access the shared session state.
        - Add buttons to "Add Exercise" (opening a modal), "Add Rest," and "Finish Workout."
        - These buttons should call the corresponding actions in the `workoutStore`. (Enhanced live view implemented to show structured workout data).

- [x] **Task 3.4: Implement Full Pre-Workout Flow (Client)**
    - **File:** `app/(app)/(client)/(tabs)/log-workout.tsx`
    - **Action:** Before starting a session, present the user with options.
    - **Logic:**
        - Fetch the user's templates using `api.getPrograms`.
        - Display options: "Start Blank Workout," "Start from Template."
        - Call the `workoutStore.startWorkout()` action with or without a `templateId` based on user selection. (Implemented).

- [x] **Task 3.5: Build Trainer Profile Editor**
    - **File:** `app/(app)/(trainer)/(tabs)/profile/index.tsx`
    - **Action:** Add an "Edit Profile" button. Create a new stack of screens for editing different profile sections (Core Info, Services, Packages, etc.).
    - **Logic:** Each screen will fetch its data using the appropriate `/api/profile/me/...` endpoints and use `PUT`/`POST`/`DELETE` requests to save changes. (Navigation structure and placeholder screen implemented).

- [x] **Task 3.6: Implement Push Notification Logic**
    - **File:** `hooks/usePushNotifications.ts`
    - **Action:** In the `useEffect` where the token is received, ensure the `sendPushToken(token)` API call is made.
    - **File:** `app/_layout.tsx` or a similar root component.
    - **Action:** Add logic to handle incoming notifications while the app is open and to navigate to specific screens when a user taps a notification. (Navigation on tap implemented).
      