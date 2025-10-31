# Task List

#### Phase 1: Foundation - API Layer, Authentication, and State Management

This phase is critical. It replaces all mock data and establishes a secure connection to your production backend, setting the stage for all subsequent features.

-   [x] **1.1. Establish Authenticated API Layer**
    -   [x] **ASSUMPTION:** Your Next.js web application will expose API endpoints (e.g., in `pages/api` or as Route Handlers in `app/api`) for the mobile app to consume.
    -   [x] Open `lib/api.ts` and remove all mock functions and data.
    -   [x] Create a new `apiFetch` helper function within `lib/api.ts`. This function will:
        -   [x] Accept an endpoint and `RequestInit` options.
        -   [x] Use the `supabase` client from `lib/supabase.ts` to get the current session's JWT (`supabase.auth.getSession()`).
        -   [x] Automatically attach the JWT to the `Authorization: 'Bearer [token]'` header for all requests.
        -   [x] Prepend the production API URL (from `process/env.EXPO_PUBLIC_API_URL`) to the endpoint.
        -   [x] Handle JSON parsing, and throw a standardized error on non-ok HTTP responses.

-   [x] **1.2. Implement Real Authentication**
    -   [x] Open `app/(auth)/register.tsx`.
    -   [x] In the `handleRegister` function, replace the mock `register()` call with a direct call to `supabase.auth.signUp()`. Include the `role` in the `options.data` object.
    -   [x] Open `app/(auth)/login.tsx`.
    -   [x] In the `handleLogin` function, replace the mock `getMe()` call. Instead, after a successful `supabase.auth.signInWithPassword()`, call a new (real) `getMe()` function in `lib/api.ts` that makes an authenticated request to a `/api/auth/me` endpoint on your backend.
    -   [x] In the success callback for `handleLogin`, ensure the profile returned from your new `getMe` API call (which should include the user's `role`) is stored in the Zustand `authStore` by calling `setProfile(profile)`.

-   [x] **1.3. Refactor and Expand State Management (Zustand)**
    -   [x] Open `store/authStore.ts`. Ensure the `profile` state is typed to match the expected user profile structure from your backend.
    -   [x] Open `store/workoutStore.ts`. Refactor it to remove mock data and align its structure with the web app's `workoutStore.ts`. It should include states for `workoutSession`, `isLoading`, `error`, `sessionDuration`, `isResting`, etc., but with `null` or empty initial values.
    -   [x] Create new store files for managing distinct data domains, mirroring the web app's architecture:
        -   [x] `store/clientStore.ts` for managing a trainer's list of clients and the currently active client's detailed data.
        -   [x] `store/programStore.ts` for managing a trainer's workout programs and templates.
    -   [x] Create a root store or initializer hook that determines the user's role from `authStore` and calls the respective `init()` functions on the other stores (e.g., if role is 'trainer', initialize `clientStore` and `programStore`).

#### Phase 2: Core Client MVP

This phase focuses on delivering the primary value for client users: logging workouts and viewing their history.

-   [x] **2.1. Implement Workout Logging**
    -   [x] In `lib/api.ts`, create real API functions: `getActiveWorkoutSession`, `startWorkoutSession`, `logSet`, `finishWorkoutSession`, and `getAvailableExercises`. These will call the corresponding backend endpoints.
    -   [x] In `store/workoutStore.ts`, implement the actions (`startWorkout`, `finishWorkout`, etc.) to call the new API functions and update the state accordingly.
    -   [x] Open `app/(app)/(client)/(tabs)/log-workout.tsx`.
        -   [x] Replace the mock `handleStartWorkout` with a call to `workoutStore.getState().startWorkout()`.
        -   [x] The main view should render based on whether `workoutStore.workoutSession` is null.
        -   [x] If a session is active, render a list of exercises from the session. The `ActiveExerciseCard` should be used for each exercise.
    -   [x] Open `components/workout/ActiveExerciseCard.tsx`.
        -   [x] Wire up the "Save & Rest" button to call `workoutStore.getState().logSet()` with the form data.
        -   [x] Ensure it correctly displays reps and weight for previously logged sets within the same session.
    -   [x] Open `components/workout/InlineRestTimer.tsx`. Connect its state (e.g., `timeLeft`) to the `restTimerValue` and `isResting` state in `workoutStore`.

-   [x] **2.2. Implement Workout History**
    -   [x] In `lib/api.ts`, create a `getWorkoutHistory()` function that fetches completed sessions.
    -   [x] In `app/(app)/(client)/(tabs)/history.tsx`, replace the mock `fetchHistory` with a `useQuery` hook that calls the new `getWorkoutHistory()` API function.
    -   [x] In `app/(app)/(client)/session/[id].tsx`, use `useLocalSearchParams` to get the session ID, create a `getSessionDetails(id)` function in `lib/api.ts`, and use `useQuery` to fetch and display the detailed session data.

#### Phase 3: Core Trainer MVP

This phase builds the essential tools for trainers to manage their clients.

-   [x] **3.1. Implement Client List & Read-Only Details**
    -   [x] In `lib/api.ts`, implement the real `getClients()` and a new `getClientDetails(clientId)` function.
    -   [x] In `app/(app)/(trainer)/(tabs)/clients/index.tsx`, replace the mock `getClients` in the `useQuery` hook with the real API call.
    -   [x] In `app/(app)/(trainer)/client/[id]/index.tsx`, use `useLocalSearchParams` to get the `id` and fetch the client's workout history using `getClientDetails`.
    -   [x] Implement the UI for the `measurements.tsx` and `photos.tsx` tabs to display data fetched from `getClientDetails`.

-   [x] **3.2. Implement Live Workout Sync View**
    -   [x] Open `app/(app)/(trainer)/client/[id]/live.tsx`.
    -   [x] The `useEffect` hook that subscribes to the Supabase channel is correct. Ensure the channel name `client-log-stream-${clientId}` is the same one the client-side app will publish to.
    -   [x] Implement the UI: Use a `FlatList` to render the `logs` state.
    -   [x] When a new log is received from the Supabase channel, update the component's state to add the new log to the list, causing it to render at the top.

#### Phase 4: Feature Parity & Mobile Enhancements

This phase implements the remaining features from the web app, adapting them for a mobile experience.

-   [x] **4.1. Build Trainer Profile & Program Screens**
    -   [x] In `app/(app)/(trainer)/(tabs)/profile/index.tsx`, build a "Profile Settings" screen allowing trainers to view their current information. (Editing can be a separate step).
    -   [x] In `app/(app)/(trainer)/(tabs)/programs/index.tsx`, implement a view to list the trainer's existing workout programs and templates, fetched via a new API call.

-   [x] **4.2. Implement Calendar**
    -   [x] Open `app/(app)/(trainer)/(tabs)/calendar/index.tsx`.
    -   [x] Replace the mock `getCalendarEvents` in the `useQuery` hook with the real API call.
    -   [x] Enhance the `planSession` modal and API call to include all necessary fields (client select, template select, notes), mirroring the web app's functionality.

-   [x] **4.3. Integrate Push Notifications**
    -   [x] In `lib/api.ts`, implement the real `sendPushToken` function. This will call a backend endpoint that saves the Expo push token to the user's profile in the database.
    -   [x] The `usePushNotifications` hook correctly calls this. Ensure this hook is used at the top level of the authenticated app (e.g., in `app/(app)/_layout.tsx`).
    -   [x] On the backend, trigger push notifications for key events (e.g., when a client books a session, when a comment is made).

-   [x] **4.4. Testing and Validation**
    -   [x] **Unit/Integration Tests (Jest):**
        -   [x] In `store/authStore.test.ts`, write tests to ensure the `authenticationState` transitions correctly based on real session data.
        -   [x] Create `store/workoutStore.test.ts` to test the state transitions for starting, logging, and finishing a workout.
        -   [x] Add tests for any new utility functions or complex component logic.
    -   [x] **End-to-End Testing (Manual or Automated):**
        -   [x] Manually test the complete user registration and login flow for both a client and a trainer.
        -   [x] Perform a full client-side workout logging session and verify the data appears correctly in the history.
        -   [x] As a trainer, open the live workout view for a client, and on a separate device, log a set as that client. Verify the trainer's screen updates in real-time.

#### Phase 5: Clean-up & Polish

This phase addresses remaining mock data and placeholder screens to complete the application.

-   [x] **5.1. Implement Real Dashboard Data**
    -   [x] In `lib/api.ts`, create real functions for `getClientDashboard` and `getTrainerDashboard`.
    -   [x] Update `app/(app)/(client)/(tabs)/dashboard.tsx` to use `getClientDashboard`.
    -   [x] Update `app/(app)/(trainer)/(tabs)/dashboard/index.tsx` to use `getTrainerDashboard`.

-   [x] **5.2. Implement Progress Visualization**
    -   [x] Create an API endpoint and a corresponding `lib/api.ts` function to fetch progress data (e.g., weight changes over time, personal records).
    -   [x] In `app/(app)/(client)/(tabs)/my-progress.tsx`, implement a charting library (e.g., `react-native-svg-charts`) to display the fetched data.

-   [x] **5.3. Implement Real Payments**
    -   [x] In `lib/api.ts`, implement a real `createCheckoutSession` function that calls the backend to generate a Stripe session.
    -   [x] Update the button in `app/(app)/(client)/(tabs)/my-trainer.tsx` to use this function.

-   [x] **5.4. UI/UX Refinements**
    -   [x] Replace the basic `Pressable` lists in the Calendar modal with a more robust dropdown/selector component.
    -   [x] Implement a global toast/notification system for non-critical errors or success messages.
      