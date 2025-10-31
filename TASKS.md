

### **Part 2 (Expanded): React Native App Development Plan**

This plan outlines the creation of a single, role-based mobile application using a modern, performant technology stack.

#### **Core Technology Stack**

*   **Framework:** **React Native with Expo SDK**. Provides a robust development environment, simplified native builds (EAS), and OTA updates.
*   **Language:** **TypeScript**. For type safety and consistency with your web codebase.
*   **JavaScript Engine:** **Hermes**. Enabled by default in Expo for faster startup and better performance.
*   **Navigation:** **React Navigation**. For creating native navigation patterns (`BottomTabNavigator`, `StackNavigator`).
*   **State Management:** **Zustand**. Reusing the same state management library as your web app for seamless logic sharing and minimal learning curve.
*   **Styling:** **Tamagui**. A high-performance, universal UI kit that can generate platform-specific styles at compile time and supports a Tailwind-like syntax. This is the best choice for achieving both performance and distinct platform aesthetics.
*   **Data Fetching:** **TanStack Query (React Query)**. For managing server state, caching, and handling API mutations gracefully.
*   **Real-time Sync:** **Supabase JS Client**. To subscribe to database changes for the live workout feature, exactly as your web app does.
*   **Lists:** **Shopify FlashList**. A high-performance replacement for `FlatList` to ensure smooth scrolling in long lists (workout history, client lists).

---

### **Atomic To-Do List for Implementation**

Here is the step-by-step implementation plan in a format ready for a code agent.

#### **Phase 0: Project Setup & Foundation**

-  
-   [ ] Install all core dependencies: `npm install zustand react-navigation @react-navigation/native @react-navigation/bottom-tabs @react-navigation/native-stack tamagui @tamagui/config react-native-screens react-native-safe-area-context @tanstack/react-query @supabase/supabase-js @shopify/flash-list`
-   [ ] Configure Tamagui by creating a `tamagui.config.ts` file and updating `babel.config.js` as per the official Tamagui documentation.
-   [ ] Set up TypeScript path aliases in `tsconfig.json` to mirror your web app's structure (e.g., `@/components`, `@/stores`, `@/lib`).
-   [ ] Create the project directory structure as outlined in the strategy document (`/app`, `/components`, `/hooks`, `/lib`, `/store`).
-   [ ] Create the Supabase client configuration file at `/lib/supabase.ts`, initializing the client using environment variables.

#### **Phase 1: Core Infrastructure & Shared Components**

-   [ ] **API Client:** Create a file at `/lib/api.ts` to house all `fetch` functions that will call your new Next.js REST API. It should include an interceptor to automatically add the Supabase JWT to the `Authorization` header.
-   [ ] **Auth Store:** Create a Zustand store at `/store/authStore.ts` to manage the user session, profile, and authentication state (loading, authenticated, unauthenticated).
-   [ ] **Root Navigator:** In `app/_layout.tsx`, implement a root `StackNavigator` that conditionally renders either the `(auth)` stack or the main app layout based on the authentication state from `authStore`.
-   [ ] **Platform-Adaptive UI Components:**
    -   [ ] Create `/components/ui/Button.tsx`. The component should check `Platform.OS` and render a button with a subtle press animation for iOS and a Material Design ripple effect for Android.
    -   [ ] Create `/components/ui/Card.tsx`. For iOS, it should have subtle shadows and rounded corners. For Android, it should use elevation.
    -   [ ] Create `/components/ui/Input.tsx`. For iOS, it should have a clean, minimal appearance. For Android, it should use the Material Design "filled" or "outlined" style.
    -   [ ] Create `/components/ui/Modal.tsx`. For iOS, it should present as a sheet modal. For Android, a standard dialog.
-   [ ] **Auth Guard Hook:** Create a hook at `/hooks/useAuthGuard.ts` that checks for a valid session and user role, protecting routes and redirecting if necessary.

#### **Phase 2: Authentication Flow**

-   [ ] **Login Screen:**
    -   [ ] Create the file `app/(auth)/login.tsx`.
    -   [ ] Build the UI using the shared `<Input>` and `<Button>` components.
    -   [ ] On submit, call the Supabase `signInWithPassword` function.
    -   [ ] On success, fetch the user's role from `/api/auth/me`, update the `authStore`, and let the root navigator automatically redirect to the correct app layout (client or trainer).
    -   [ ] Display errors using an alert or toast.
-   [ ] **Registration Screen:**
    -   [ ] Create the file `app/(auth)/register.tsx`.
    *   [ ] Build the UI, including a Segmented Control (iOS) / Radio Buttons (Android) for selecting "Trainer" or "Client" role.
    *   [ ] On submit, call your `POST /api/auth/register` endpoint.
    *   [ ] On success, show a confirmation message and navigate the user to the login screen.

#### **Phase 3: Client App MVP**

-   [ ] **Client Layout:** Create `app/(client)/_layout.tsx`. Implement a `BottomTabNavigator` with tabs for Dashboard, Log Workout, History, My Progress, and My Trainer. Apply platform-specific styling (frosted glass/blur for iOS, Material 3 style for Android).
-   [ ] **Dashboard Tab:**
    -   [ ] Create `app/(client)/(tabs)/dashboard.tsx`.
    -   [ ] Use TanStack Query to fetch data from `/api/client/dashboard`.
    -   [ ] Create and display the `<UpcomingSessions />` and `<FindTrainerPrompt />` components.
-   [ ] **Log Workout Tab (Core Feature):**
    -   [ ] Create `app/(client)/(tabs)/log-workout.tsx`.
    -   [ ] **Zustand Store:** Create `store/workoutStore.ts` by adapting the web app's store. It will manage the active `workoutSession`, timers, and real-time updates.
    -   [ ] **Pre-Workout UI:** If `workoutSession` is null, display template cards and a "Quick Start" button.
    -   [ ] **Live Workout UI:** If `workoutSession` is active, display the live workout interface.
    -   [ ] **`<ActiveExerciseCard />` Component:** Build the card for logging a single set, including inputs for reps/weight and a "Save & Rest" button. This component will call the `logSetOptimistic` action in the `workoutStore`.
    -   [ ] **`<InlineRestTimer />` Component:** Build the animated rest timer that appears after saving a set.
    -   [ ] **Real-time Sync:** In the store, use the Supabase client to subscribe to `WorkoutSession` and `ClientExerciseLog` table changes to receive real-time updates from a trainer.
-   [ ] **History Tab:**
    -   [ ] Create `app/(client)/(tabs)/history.tsx`.
    -   [ ] Use TanStack Query and `<FlashList />` to display a list of completed sessions from `GET /api/sessions/history`.
    -   [ ] Create the session detail screen `app/(client)/session/[id].tsx` to show exercises and comments.
-   [ ] **My Progress & My Trainer Tabs:**
    -   [ ] Create `app/(client)/(tabs)/my-progress.tsx` and `my-trainer.tsx`.
    -   [ ] Build the UI to display charts and trainer information, fetching data as needed.

#### **Phase 4: Trainer App MVP**

-   [ ] **Trainer Layout:** Create `app/(trainer)/_layout.tsx`. Implement a `BottomTabNavigator` for Dashboard, Clients, Calendar, Programs, and Profile.
-   [ ] **Dashboard Tab:**
    -   [ ] Create `app/(trainer)/(tabs)/dashboard.tsx`.
    -   [ ] Fetch and display onboarding or established trainer data from `/api/dashboard/*`.
-   [ ] **Clients Tab (Core Feature):**
    -   [ ] Create `app/(trainer)/(tabs)/clients.tsx`.
    -   [ ] Use TanStack Query and `<FlashList />` to display the client list from `GET /api/clients`.
    -   [ ] Implement a nested `StackNavigator` for the client detail flow.
    -   [ ] Create the client detail screen at `app/(trainer)/client/[id]/index.tsx`. Use a top tab navigator for Measurements, Photos, Workouts, etc.
    -   [ ] **Live Workout Screen:** Create `app/(trainer)/client/[id]/live.tsx`. This screen mirrors the client's live workout UI but is non-interactive. It will subscribe to Supabase Realtime to see the client's logs appear instantly.
-   [ ] **Calendar Tab:**
    -   [ ] Create `app/(trainer)/(tabs)/calendar.tsx`.
    -   [ ] Use a library like `react-native-calendars` to build the UI.
    -   [ ] Fetch events from `GET /api/calendar/events` and display them.
    -   [ ] Implement modal for creating new sessions which calls `POST /api/sessions/plan`.

#### **Phase 5: Payments & Advanced Features**

-   [ ] **Package Purchase Flow:**
    -   [ ] On the public trainer profile screen, add a "Buy Package" button.
    -   [ ] On press, call the `POST /api/checkout/session` endpoint.
    -   [ ] On receiving the Stripe Checkout URL, open it using Expo's `WebBrowser` module for a secure, in-app browser experience.
-   [ ] **Push Notifications:**
    -   [ ] Integrate **Expo Push Notifications**.
    -   [ ] Create a backend endpoint (`POST /api/profile/me/push-token`) for the app to send its push token after login.
    -   [ ] Modify backend services (e.g., `notificationService`) to send push notifications via Expo's service for events like session reminders and new comments.

#### **Phase 6: Polish, Optimization & Deployment**

-   [ ] **Haptics:** Integrate `expo-haptics` to provide subtle feedback on button presses and successful actions on iOS.
-   [ ] **Offline Support:** For a premium experience, use a library like `zustand-persist` with `AsyncStorage` or WatermelonDB to cache essential data for offline viewing (e.g., workout history, planned sessions).
-   [ ] **Testing:** Write unit and integration tests for components and stores using Jest and React Native Testing Library.
-   [ ] **Build & Deploy:**
    -   [ ] Configure `app.json` for both iOS and Android (bundle identifiers, icons, splash screens).
    -   [ ] Use **Expo Application Services (EAS)** to build the `.ipa` (iOS) and `.aab` (Android) files.
    -   [ ] Submit the builds to Apple App Store Connect and Google Play Console.