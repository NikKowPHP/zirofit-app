#### **Phase 0: Project Setup & Foundation**

-   [x] Install all core dependencies: `npm install zustand react-navigation @react-navigation/native @react-navigation/bottom-tabs @react-navigation/native-stack tamagui @tamagui/config react-native-screens react-native-safe-area-context @tanstack/react-query @supabase/supabase-js @shopify/flash-list`
-   [x] Configure Tamagui by creating a `tamagui.config.ts` file and updating `babel.config.js` as per the official Tamagui documentation.
-   [x] Set up TypeScript path aliases in `tsconfig.json` to mirror your web app's structure (e.g., `@/components`, `@/stores`, `@/lib`).
-   [x] Create the project directory structure as outlined in the strategy document (`/app`, `/components`, `/hooks`, `/lib`, `/store`).
-   [x] Create the Supabase client configuration file at `/lib/supabase.ts`, initializing the client using environment variables.

#### **Phase 1: Core Infrastructure & Shared Components**

-   [x] **API Client:** Create a file at `/lib/api.ts` to house all `fetch` functions that will call your new Next.js REST API. It should include an interceptor to automatically add the Supabase JWT to the `Authorization` header.
-   [x] **Auth Store:** Create a Zustand store at `/store/authStore.ts` to manage the user session, profile, and authentication state (loading, authenticated, unauthenticated).
-   [x] **Root Navigator:** In `app/_layout.tsx`, implement a root `StackNavigator` that conditionally renders either the `(auth)` stack or the main app layout based on the authentication state from `authStore`.
-   [x] **Platform-Adaptive UI Components:**
    -   [x] Create `/components/ui/Button.tsx`. The component should check `Platform.OS` and render a button with a subtle press animation for iOS and a Material Design ripple effect for Android.
    -   [x] Create `/components/ui/Card.tsx`. For iOS, it should have subtle shadows and rounded corners. For Android, it should use elevation.
    -   [x] Create `/components/ui/Input.tsx`. For iOS, it should have a clean, minimal appearance. For Android, it should use the Material Design "filled" or "outlined" style.
    -   [x] Create `/components/ui/Modal.tsx`. For iOS, it should present as a sheet modal. For Android, a standard dialog.
-   [x] **Auth Guard Hook:** Create a hook at `/hooks/useAuthGuard.ts` that checks for a valid session and user role, protecting routes and redirecting if necessary.

#### **Phase 2: Authentication Flow**

-   [x] **Login Screen:**
    -   [x] Create the file `app/(auth)/login.tsx`.
    -   [x] Build the UI using the shared `<Input>` and `<Button>` components.
    -   [x] On submit, call the Supabase `signInWithPassword` function.
    -   [x] On success, fetch the user's role from `/api/auth/me`, update the `authStore`, and let the root navigator automatically redirect to the correct app layout (client or trainer).
    -   [x] Display errors using an alert or toast.
-   [x] **Registration Screen:**
    -   [x] Create the file `app/(auth)/register.tsx`.
    -   [x] Build the UI, including a Segmented Control (iOS) / Radio Buttons (Android) for selecting "Trainer" or "Client" role.
    -   [x] On submit, call your `POST /api/auth/register` endpoint.
    -   [x] On success, show a confirmation message and navigate the user to the login screen.
#### **Phase 3: Client App MVP**

-   [x] **Client Layout:** Create `app/(client)/_layout.tsx`. Implement a `BottomTabNavigator` with tabs for Dashboard, Log Workout, History, My Progress, and My Trainer. Apply platform-specific styling (frosted glass/blur for iOS, Material 3 style for Android).
-   [x] **Dashboard Tab:**
    -   [x] Create `app/(client)/(tabs)/dashboard.tsx`.
    -   [x] Use TanStack Query to fetch data from `/api/client/dashboard`.
    -   [x] Create and display the `<UpcomingSessions />` and `<FindTrainerPrompt />` components.
-   [x] **Log Workout Tab (Core Feature):**
    -   [x] Create `app/(client)/(tabs)/log-workout.tsx`.
    -   [x] **Zustand Store:** Create `store/workoutStore.ts` by adapting the web app's store. It will manage the active `workoutSession`, timers, and real-time updates.
    -   [x] **Pre-Workout UI:** If `workoutSession` is null, display template cards and a "Quick Start" button.
    -   [x] **Live Workout UI:** If `workoutSession` is active, display the live workout interface.
    -   [x] **`<ActiveExerciseCard />` Component:** Build the card for logging a single set, including inputs for reps/weight and a "Save & Rest" button. This component will call the `logSetOptimistic` action in the `workoutStore`.
    -   [x] **`<InlineRestTimer />` Component:** Build the animated rest timer that appears after saving a set.
    -   [x] **Real-time Sync:** In the store, use the Supabase client to subscribe to `WorkoutSession` and `ClientExerciseLog` table changes to receive real-time updates from a trainer.
-   [x] **History Tab:**
    -   [x] Create `app/(client)/(tabs)/history.tsx`.
    -   [x] Use TanStack Query and `<FlashList />` to display a list of completed sessions from `GET /api/sessions/history`.
    -   [x] Create the session detail screen `app/(client)/session/[id].tsx` to show exercises and comments.
-   [x] **My Progress & My Trainer Tabs:**
    -   [x] Create `app/(client)/(tabs)/my-progress.tsx` and `my-trainer.tsx`.
    -   [x] Build the UI to display charts and trainer information, fetching data as needed.
#### **Phase 4: Trainer App MVP**

-   [x] **Trainer Layout:** Create `app/(trainer)/_layout.tsx`. Implement a `BottomTabNavigator` for Dashboard, Clients, Calendar, Programs, and Profile.
-   [x] **Dashboard Tab:**
    -   [x] Create `app/(trainer)/(tabs)/dashboard.tsx`.
    -   [x] Fetch and display onboarding or established trainer data from `/api/dashboard/*`.
-   [x] **Clients Tab (Core Feature):**
    -   [x] Create `app/(trainer)/(tabs)/clients.tsx`.
    -   [x] Use TanStack Query and `<FlashList />` to display the client list from `GET /api/clients`.
    -   [x] Implement a nested `StackNavigator` for the client detail flow.
    -   [x] Create the client detail screen at `app/(trainer)/client/[id]/index.tsx`. Use a top tab navigator for Measurements, Photos, Workouts, etc.
    -   [x] **Live Workout Screen:** Create `app/(trainer)/client/[id]/live.tsx`. This screen mirrors the client's live workout UI but is non-interactive. It will subscribe to Supabase Realtime to see the client's logs appear instantly.
-   [x] **Calendar Tab:**
    -   [x] Create `app/(trainer)/(tabs)/calendar.tsx`.
    -   [x] Use a library like `react-native-calendars` to build the UI.
    -   [x] Fetch events from `GET /api/calendar/events` and display them.
    -   [x] Implement modal for creating new sessions which calls `POST /api/sessions/plan`.
#### **Phase 5: Payments & Advanced Features**

-   [x] **Package Purchase Flow:**
    -   [x] On the public trainer profile screen, add a "Buy Package" button.
    -   [x] On press, call the `POST /api/checkout/session` endpoint.
    -   [x] On receiving the Stripe Checkout URL, open it using Expo's `WebBrowser` module for a secure, in-app browser experience.
-   [x] **Push Notifications:**
    -   [x] Integrate **Expo Push Notifications**.
    -   [x] Create a backend endpoint (`POST /api/profile/me/push-token`) for the app to send its push token after login.
    -   [x] Modify backend services (e.g., `notificationService`) to send push notifications via Expo's service for events like session reminders and new comments.
#### **Phase 6: Polish, Optimization & Deployment**

-   [x] **Haptics:** Integrate `expo-haptics` to provide subtle feedback on button presses and successful actions on iOS.
-   [x] **Offline Support:** For a premium experience, use a library like `zustand-persist` with `AsyncStorage` or WatermelonDB to cache essential data for offline viewing (e.g., workout history, planned sessions).
-   [x] **Testing:** Write unit and integration tests for components and stores using Jest and React Native Testing Library.
-   [x] **Build & Deploy:**
    -   [x] Configure `app.json` for both iOS and Android (bundle identifiers, icons, splash screens).
    -   [x] Use **Expo Application Services (EAS)** to build the `.ipa` (iOS) and `.aab` (Android) files.
    -   [x] Submit the builds to Apple App Store Connect and Google Play Console.
      