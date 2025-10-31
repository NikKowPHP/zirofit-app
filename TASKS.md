### Implementation Plan: ZIRO.FIT React Native MVP Completion

The application has made significant progress, moving from a static prototype to a data-driven foundation with centralized state management and a real API layer. This plan focuses on connecting the UI to this new foundation and implementing the core business logic.

#### Phase 1: Finalize Backend Integration & State Management

This phase completes the foundational data flow, ensuring all stores fetch, receive, and manage real data from your backend.

-   [x] **1.1. Implement API Endpoints**
    -   [x] **ASSUMPTION:** You have a Next.js backend. Create API Route Handlers (e.g., in `src/app/api/.../route.ts`) for every function defined in the mobile app's `lib/api.ts`.
    -   [x] Ensure every API route is protected and uses `getAuthContext` (from the web app's `lib/api/auth.ts`) to authorize requests using the JWT sent from the mobile app.

-   [x] **1.2. Make Data Stores Live**
    -   [x] Open `store/clientStore.ts`. In `fetchClients`, replace `console.log` with a real `apiFetch('/trainer/clients')` call and set the state with the response.
    -   [x] In `store/clientStore.ts`, implement `fetchClientDetails` to call `apiFetch(`/trainer/clients/${clientId}\`)`.
    -   [x] Open `store/programStore.ts`. In `fetchPrograms`, replace `console.log` with a real `apiFetch('/trainer/programs')` call.
    -   [x] Open `store/workoutStore.ts`. Ensure all actions (`checkActiveSession`, `startWorkout`, `logSet`, `finishWorkout`) are correctly calling their corresponding functions in `lib/api.ts`.

-   [x] **1.3. Refine Global State Initialization**
    -   [x] Open `app/(app)/_layout.tsx`. Confirm that `useInitializeStores()` is called within the main authenticated layout to trigger the data-fetching cascade on app launch.
    -   [x] In `app/(app)/index.tsx`, ensure the `getMe()` API call correctly populates `authStore.profile`, which is the trigger for `useInitializeStores`.

#### Phase 2: Implement Core Trainer Features (MVP)

With data flowing, this phase builds the essential views for trainers.

-   [x] **2.1. Implement Client Detail Views**
    -   [x] Open `app/(app)/(trainer)/client/[id]/measurements.tsx`.
        -   [x] Use the `useClientDetails(id)` hook to fetch client data.
        -   [x] Display an `<ActivityIndicator />` while `isLoading` is true.
        -   [x] Use a `<FlatList />` to render the `client.measurements` array.
        -   [x] Show an "empty state" component if the array is empty.
    -   [x] Open `app/(app)/(trainer)/client/[id]/photos.tsx`.
        -   [x] Use the `useClientDetails(id)` hook.
        -   [x] Use a `<FlatList numColumns={2} />` to render `client.photos`, using `<Image />` for each photo.
        -   [x] Show an "empty state" component if the array is empty.
    -   [x] Open `app/(app)/(trainer)/client/[id]/index.tsx`.
        -   [x] The existing `useClientDetails` hook is correct.
        -   [x] Use the `client.workouts` data to populate the `<FlatList />` instead of mock data.

-   [x] **2.2. Build Live Workout Sync UI**
    -   [x] Open `app/(app)/(trainer)/client/[id]/live.tsx`.
    -   [x] The `useEffect` hook for subscribing to Supabase channels is correctly set up.
    -   [x] Use a `<FlatList inverted />` to display the `logs` state, which will make new logs appear at the bottom (like a chat).
    -   [x] Style the `logItem` view to be more informative, showing reps, weight, and a timestamp.

-   [x] **2.3. Enhance Calendar Functionality**
    -   [x] In `app/(app)/(trainer)/(tabs)/calendar/index.tsx`, ensure the data from `useQuery({ queryKey: ['calendarEvents'] })` correctly formats events into the `markedDates` prop for `react-native-calendars`.
    -   [x] Enhance the "Plan Session" modal by adding `<Select>` components for choosing a client (from `clients` data) and a program/template (from `programs` data).
    -   [x] The `handlePlanSession` mutation should pass the selected IDs to the `planSession` API call.

#### Phase 3: Implement Core Client Features (MVP)

This phase focuses on the primary client experience: logging a workout and seeing progress.

-   [x] **3.1. Finalize Workout Logging Screen**
    -   [x] Open `app/(app)/(client)/(tabs)/log-workout.tsx`.
    -   [x] The `checkActiveSession()` call in `useEffect` is correct.
    -   [x] When `workoutSession` is active, use a `<FlatList />` to render an `<ActiveExerciseCard />` for each exercise in `workoutSession.exercises`.
    -   [x] Pass the logged sets for each exercise (`workoutSession.logs`) as a prop to `ActiveExerciseCard`.
    -   [x] In `components/workout/ActiveExerciseCard.tsx`, render the list of `loggedSets` passed from the parent.

-   [x] **3.2. Implement Data Visualization**
    -   [x] Open `app/(app)/(client)/(tabs)/my-progress.tsx`.
    -   [x] The `useQuery` hook for `getProgressData` is correct.
    -   [x] Use the `react-native-svg-charts` components (`LineChart`, `YAxis`, `Grid`) to plot the `data.weight` array.
    -   [x] Add a segmented control or buttons to switch between different metrics (e.g., weight, body fat) if the API provides them.

-   [x] **3.3. Connect "My Trainer" Page**
    -   [x] In `lib/api.ts`, create a `getMyTrainer()` function.
    -   [x] In `app/(app)/(client)/(tabs)/my-trainer.tsx`, use `useQuery` to call `getMyTrainer()`.
    -   [x] Render the trainer's details (avatar, name) from the query result. If no trainer is linked, show the `FindTrainerPrompt` component.

#### Phase 4: Feature Parity and Testing

This phase brings the app closer to the web version's functionality and ensures stability.

-   [ ] **4.1. Build Trainer CRUD operations**
    -   [ ] Create a "New Client" screen with a form that calls a `createClient` function in `lib/api.ts`.
    -   [ ] Add "Add Measurement" and "Upload Photo" forms within the respective client detail tabs, which call new API functions.

-   [ ] **4.2. Implement Program Builder UI**
    -   [ ] In `app/(app)/(trainer)/(tabs)/programs/index.tsx`, add UI for creating new programs and templates. This will involve creating modals similar to the Calendar screen.
    -   [ ] Create API functions (`createProgram`, `createTemplate`) and corresponding mutations.

-   [ ] **4.3. Full Push Notification Integration**
    -   [ ] On the backend, identify all key events that should trigger a push notification (e.g., new booking, session reminder, new comment).
    -   [ ] When these events occur, call a service that uses the stored Expo Push Token to send a notification.
    -   [ ] In the mobile app, handle incoming notifications (e.g., navigating to the relevant screen when a notification is tapped).

-   [ ] **4.4. Testing and Validation**
    -   [ ] **Unit/Integration Tests (Jest):**
        -   [ ] In `store/clientStore.test.ts`, write tests to verify that `fetchClients` and `fetchClientDetails` correctly update the state and handle loading/error states.
        -   [ ] In `store/workoutStore.test.ts`, expand tests to cover the full lifecycle, including optimistic updates and error rollbacks for `logSet`.
    -   [ ] **End-to-End Test (Manual):**
        -   [ ] **Scenario 1 (Client):** Log in as a client, start a workout, log several sets for different exercises, use the rest timer, and finish the workout. Verify the session appears correctly in the history.
        -   [ ] **Scenario 2 (Trainer):** Log in as a trainer, view the client list, navigate to a client's details, and see the workout that was just logged.
        -   [ ] **Scenario 3 (Live Sync):** With two devices (or simulators), log in as a trainer on one and a client on the other. As the trainer, navigate to the client's "Live Workout" screen. As the client, start a workout and log a set. Verify the new log appears on the trainer's screen within seconds.
      