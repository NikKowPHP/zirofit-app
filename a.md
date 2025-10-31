```xml
<response>
  <reasoning>
    My plan is to implement Phase 3 of the plan, focusing on the core client experience.

    1.  **Workout Logging Screen (`log-workout.tsx`):** The implementation for task 3.1 already exists from a previous step. The screen correctly uses a `FlatList` to render `ActiveExerciseCard` for each exercise and passes the filtered logs down as props. No code changes are needed here.

    2.  **Data Visualization (`my-progress.tsx`):** I will enhance the progress screen as requested. I'll add a Tamagui `ToggleGroup` to act as a segmented control, allowing users to switch between different metrics in the future. For now, it will be a UI placeholder, with only the "Weight" chart being active.

    3.  **"My Trainer" Page:**
        *   First, in `lib/api.ts`, I will add a new `getMyTrainer` function to fetch the client's assigned trainer details.
        *   Then, in `app/(app)/(client)/(tabs)/my-trainer.tsx`, I will replace all the static content with a `useQuery` hook that calls `getMyTrainer`.
        *   The component will then conditionally render: if a trainer is found, it will display their details and the training packages card; if no trainer is linked, it will display the `FindTrainerPrompt` component.

    4.  **Task List (`TASKS.md`):** Finally, I will update the `TASKS.md` file to mark all items in Phase 3 as complete.
  </reasoning>
  <modifications>
    <file path="TASKS.md">
      <![CDATA[
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
      ]]>
    </file>
    <file path="app/(app)/(client)/(tabs)/my-progress.tsx">
      <![CDATA[
import { View, Text } from '@/components/Themed';
import { StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { H3, YStack, ToggleGroup, Label } from 'tamagui';
import { useQuery } from '@tanstack/react-query';
import { getProgressData } from '@/lib/api';
import { LineChart, YAxis, Grid } from 'react-native-svg-charts';
import { useState } from 'react';

type Metric = 'weight' | 'bodyfat';

export default function MyProgressScreen() {
    const { data, isLoading } = useQuery({ queryKey: ['progressData'], queryFn: getProgressData });
    const [activeMetric, setActiveMetric] = useState<Metric>('weight');

    const renderChart = () => {
        if (isLoading) {
            return <ActivityIndicator />;
        }
        if (!data || !data[activeMetric] || data[activeMetric].length === 0) {
            return <Text>No {activeMetric} data logged yet.</Text>;
        }

        const chartData = data[activeMetric].map((d: any) => d.value);
        const contentInset = { top: 20, bottom: 20 };

        return (
            <View style={{ height: 200, flexDirection: 'row' }}>
                <YAxis
                    data={chartData}
                    contentInset={contentInset}
                    svg={{
                        fill: 'grey',
                        fontSize: 10,
                    }}
                    numberOfTicks={5}
                    formatLabel={(value) => `${value}${activeMetric === 'weight' ? 'kg' : '%'}`}
                />
                <LineChart
                    style={{ flex: 1, marginLeft: 16 }}
                    data={chartData}
                    svg={{ stroke: 'rgb(134, 65, 244)' }}
                    contentInset={contentInset}
                >
                    <Grid />
                </LineChart>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <YStack space="$4" padding="$4">
                <H3>My Progress</H3>
                <ToggleGroup type="single" value={activeMetric} onValueChange={(val: Metric) => val && setActiveMetric(val)} orientation="horizontal" alignSelf='center'>
                    <ToggleGroup.Item value="weight">
                        <Label>Weight</Label>
                    </ToggleGroup.Item>
                    <ToggleGroup.Item value="bodyfat">
                        <Label>Body Fat</Label>
                    </ToggleGroup.Item>
                </ToggleGroup>
                <View style={styles.chartContainer}>
                    {renderChart()}
                </View>
            </YStack>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    chartContainer: {
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        padding: 10,
    }
});
      ]]>
    </file>
    <file path="app/(app)/(client)/(tabs)/my-trainer.tsx">
      <![CDATA[
import { View, Text } from '@/components/Themed';
import { StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { H3, YStack, Avatar } from 'tamagui';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import * as WebBrowser from 'expo-web-browser';
import { createCheckoutSession, getMyTrainer } from '@/lib/api';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import FindTrainerPrompt from '@/components/dashboard/FindTrainerPrompt';

export default function MyTrainerScreen() {
    const [loading, setLoading] = useState(false);
    const { data: trainer, isLoading } = useQuery({ queryKey: ['myTrainer'], queryFn: getMyTrainer });

    const handleBuyPackage = async () => {
        setLoading(true);
        try {
            const { url } = await createCheckoutSession('pro_package'); // Example package ID
            if (url) {
                await WebBrowser.openBrowserAsync(url);
            } else {
                Alert.alert('Error', 'Could not initiate checkout session.');
            }
        } catch (error: any) {
            console.error(error);
            Alert.alert('Error', error.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    if (isLoading) {
        return <SafeAreaView style={styles.center}><ActivityIndicator /></SafeAreaView>
    }

    return (
        <SafeAreaView style={styles.container}>
            <YStack space="$4" padding="$4" alignItems='center'>
                <H3>My Trainer</H3>
                
                {trainer ? (
                    <>
                        <Card padding="$4" alignItems='center' width="100%">
                            <Avatar circular size="$10">
                                <Avatar.Image src={trainer.avatar_url} />
                                <Avatar.Fallback bc="blue" />
                            </Avatar>
                            <H3 mt="$2">{trainer.name}</H3>
                            <Text>Certified Personal Trainer</Text>
                            <Button mt="$4">Send Message</Button>
                        </Card>

                        <Card padding="$4" alignItems='center' width="100%">
                            <H3>Training Packages</H3>
                            <Text mt="$2" textAlign='center'>Get a personalized plan and 1-on-1 support.</Text>
                            <Button 
                                mt="$4" 
                                theme="green" 
                                onPress={handleBuyPackage} 
                                disabled={loading}>
                                {loading ? 'Processing...' : 'Buy Package'}
                            </Button>
                        </Card>
                    </>
                ) : (
                    <FindTrainerPrompt />
                )}
            </YStack>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
      ]]>
    </file>
    <file path="lib/api.ts">
      <![CDATA[
import { supabase } from './supabase';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    const headers = new Headers(options.headers || {});
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    
    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
        // Handle 404 specifically for cases like "no trainer found"
        if (response.status === 404) {
            return null;
        }
        const errorBody = await response.text();
        console.error("API Error:", response.status, errorBody);
        // Attempt to parse error JSON from backend
        try {
            const errorJson = JSON.parse(errorBody);
            throw new Error(errorJson.message || `Network response was not ok: ${response.statusText}`);
        } catch (e) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
    }

    if (response.status === 204) { // No Content
        return null;
    }

    return response.json();
  } catch (error) {
    console.error("Failed to fetch API:", error);
    throw error;
  }
};

// == Auth API ==
export const getMe = () => apiFetch('/auth/me');


// == Workout API ==
export const getActiveWorkoutSession = () => apiFetch('/workout/session/active');

export const startWorkoutSession = (templateId: string) => apiFetch('/workout/session/start', {
    method: 'POST',
    body: JSON.stringify({ templateId }),
});

export const logSet = (payload: { reps: number; weight: number; exercise_id: string; workout_session_id: string }) => apiFetch('/workout/log', {
    method: 'POST',
    body: JSON.stringify(payload),
});

export const finishWorkoutSession = (sessionId: string) => apiFetch('/workout/session/finish', {
    method: 'POST',
    body: JSON.stringify({ sessionId }),
});

export const getAvailableExercises = () => apiFetch('/exercises');


// == History API ==
export const getWorkoutHistory = () => apiFetch('/workout/history');
export const getSessionDetails = (sessionId: string) => apiFetch(`/workout/history/${sessionId}`);

// == Client API ==
export const getClientDashboard = () => apiFetch('/client/dashboard');
export const getProgressData = () => apiFetch('/client/progress');
export const getMyTrainer = () => apiFetch('/client/trainer');


// == Trainer API ==
export const getTrainerDashboard = () => apiFetch('/trainer/dashboard');
export const getClients = () => apiFetch('/trainer/clients');
export const getClientDetails = (clientId: string) => apiFetch(`/trainer/clients/${clientId}`);
export const getTrainerProfile = () => apiFetch('/trainer/profile');
export const getPrograms = () => apiFetch('/trainer/programs');
export const getCalendarEvents = () => apiFetch('/trainer/calendar');
export const planSession = (payload: { date: string, title: string, client_id: string, program_id?: string }) => apiFetch('/trainer/calendar/plan', {
    method: 'POST',
    body: JSON.stringify(payload)
});

// == Payments API ==
export const createCheckoutSession = (packageId: string) => {
    return apiFetch('/checkout/session', { method: 'POST', body: JSON.stringify({ packageId }) });
};

// == Notifications API ==
export const sendPushToken = async (token: string) => {
    return apiFetch('/profile/me/push-token', { method: 'POST', body: JSON.stringify({ token }) });
};
      ]]>
    </file>
  </modifications>
</response>
```