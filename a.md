My plan is to implement Phase 3, which focuses on building the "Assessment Viewing" feature for clients. This will complete the final major feature gap outlined in the task list.

Here is the breakdown of my actions:

1.  **Update API Library (`lib/api.ts`):** I will add a new function, `getClientAssessments`, which will fetch the client's assessment history from the `/api/client/assessments` endpoint.

2.  **Enhance "My Progress" Screen (`app/(app)/(client)/(tabs)/my-progress.tsx`):** This is where the core UI changes will happen.
    *   I will add a new "Assessments" tab to the existing `ToggleGroup`, allowing users to switch between viewing their weight/bodyfat charts and their assessment history.
    *   I will introduce a new `useQuery` hook that is conditionally enabled to fetch the assessment data only when the "Assessments" tab is active.
    *   I will create a new rendering function, `renderAssessments`, which will be responsible for displaying the fetched assessment data. It will handle loading and empty states.
    *   The main view will be updated to conditionally show either the existing charts or the new assessment list based on the selected tab. The assessment list will display each assessment as a `Card`, showing its name, date, and a list of metrics with their values and units.

3.  **Update Task List (`TASKS.md`):** Upon completion, I will mark Task 7 and all its sub-tasks as complete (`[x]`). I will also add a new entry for implementing Phase 3 and mark it as complete.

This implementation will provide clients with a clear and organized way to view their historical assessment results, directly within the progress section of the app.

```xml
<response>
  <reasoning>
    My plan is to implement Phase 3, which focuses on building the "Assessment Viewing" feature for clients. This will complete the final major feature gap outlined in the task list.

    Here is the breakdown of my actions:

    1.  **Update API Library (`lib/api.ts`):** I will add a new function, `getClientAssessments`, which will fetch the client's assessment history from the `/api/client/assessments` endpoint.

    2.  **Enhance "My Progress" Screen (`app/(app)/(client)/(tabs)/my-progress.tsx`):** This is where the core UI changes will happen.
        *   I will add a new "Assessments" tab to the existing `ToggleGroup`, allowing users to switch between viewing their weight/bodyfat charts and their assessment history.
        *   I will introduce a new `useQuery` hook that is conditionally enabled to fetch the assessment data only when the "Assessments" tab is active.
        *   I will create a new rendering function, `renderAssessments`, which will be responsible for displaying the fetched assessment data. It will handle loading and empty states.
        *   The main view will be updated to conditionally show either the existing charts or the new assessment list based on the selected tab. The assessment list will display each assessment as a `Card`, showing its name, date, and a list of metrics with their values and units.

    3.  **Update Task List (`TASKS.md`):** Upon completion, I will mark Task 7 and all its sub-tasks as complete (`[x]`). I will also add a new entry for implementing Phase 3 and mark it as complete.

    This implementation will provide clients with a clear and organized way to view their historical assessment results, directly within the progress section of the app.
  </reasoning>
  <modifications>
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

    const response = await fetch(`${API_URL}/api${endpoint}`, {
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
export const getWorkoutTemplates = () => apiFetch('/workout/templates');


// == History API ==
export const getWorkoutHistory = () => apiFetch('/workout/history');
export const getSessionDetails = (sessionId: string) => apiFetch(`/workout/history/${sessionId}`);

// == Client API ==
export const getClientDashboard = () => apiFetch('/client/dashboard');
export const getProgressData = () => apiFetch('/client/progress');
export const getMyTrainer = () => apiFetch('/client/trainer');
export const getClientAssessments = () => apiFetch('/client/assessments');


// == Trainer API ==
export const getTrainerDashboard = () => apiFetch('/trainer/dashboard');
export const getClients = () => apiFetch('/clients');
export const getClientDetails = (clientId: string) => apiFetch(`/clients/${clientId}`);
export const createClient = (email: string) => apiFetch('/clients', { method: 'POST', body: JSON.stringify({ email }) });
export const getTrainerProfile = () => apiFetch('/profile/me');
export const updateTrainerCoreInfo = (payload: { name: string, username: string, certifications: string, phone: string }) => apiFetch('/profile/me/core-info', {
    method: 'PUT',
    body: JSON.stringify(payload)
});

// Trainer Profile Services
export const addTrainerService = (payload: { name: string, description?: string, price: number, duration: number }) => apiFetch('/profile/me/services', {
    method: 'POST',
    body: JSON.stringify(payload)
});

export const updateTrainerService = (serviceId: string, payload: { name: string, description?: string, price: number, duration: number }) => apiFetch(`/profile/me/services/${serviceId}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
});

export const deleteTrainerService = (serviceId: string) => apiFetch(`/profile/me/services/${serviceId}`, {
    method: 'DELETE'
});

// Trainer Profile Packages
export const addTrainerPackage = (payload: { name: string, description?: string, price: number }) => apiFetch('/profile/me/packages', { method: 'POST', body: JSON.stringify(payload) });
export const updateTrainerPackage = (packageId: string, payload: { name: string, description?: string, price: number }) => apiFetch(`/profile/me/packages/${packageId}`, { method: 'PUT', body: JSON.stringify(payload) });
export const deleteTrainerPackage = (packageId: string) => apiFetch(`/profile/me/packages/${packageId}`, { method: 'DELETE' });

// Trainer Profile Testimonials
export const addTrainerTestimonial = (payload: { client_name: string, content: string }) => apiFetch('/profile/me/testimonials', { method: 'POST', body: JSON.stringify(payload) });
export const updateTrainerTestimonial = (testimonialId: string, payload: { client_name: string, content: string }) => apiFetch(`/profile/me/testimonials/${testimonialId}`, { method: 'PUT', body: JSON.stringify(payload) });
export const deleteTrainerTestimonial = (testimonialId: string) => apiFetch(`/profile/me/testimonials/${testimonialId}`, { method: 'DELETE' });

// Trainer Profile Transformations
export const uploadTransformationPhoto = (formData: FormData) => apiFetch('/profile/me/transformations', { method: 'POST', body: formData });
export const deleteTransformationPhoto = (photoId: string) => apiFetch(`/profile/me/transformations/${photoId}`, { method: 'DELETE' });

// Trainer Programs & Templates
export const getPrograms = () => apiFetch('/trainer/programs');
export const createProgram = (payload: { name: string, description?: string }) => apiFetch('/trainer/programs', { method: 'POST', body: JSON.stringify(payload) });
export const getProgramDetails = (programId: string) => apiFetch(`/trainer/programs/${programId}`);
export const createTemplate = (programId: string, payload: { name: string, description?: string }) => apiFetch(`/trainer/programs/${programId}/templates`, { method: 'POST', body: JSON.stringify(payload) });
export const getTemplateDetails = (templateId: string) => apiFetch(`/trainer/templates/${templateId}`);
export const addExerciseToTemplate = (templateId: string, payload: { exercise_id: string }) => apiFetch(`/trainer/templates/${templateId}/exercises`, { method: 'POST', body: JSON.stringify(payload) });
export const removeExerciseFromTemplate = (templateId: string, exerciseId: string) => apiFetch(`/trainer/templates/${templateId}/exercises/${exerciseId}`, { method: 'DELETE' });

export const getCalendarEvents = (startDate: string, endDate: string) => apiFetch(`/trainer/calendar?startDate=${startDate}&endDate=${endDate}`);
export const planSession = (payload: { date: string, notes: string, clientId: string, templateId?: string }) => apiFetch('/trainer/calendar', {
    method: 'POST',
    body: JSON.stringify(payload)
});
export const getActiveClientWorkoutSession = (clientId: string) => apiFetch(`/clients/${clientId}/session/active`);
export const getTrainerPackages = (trainerId: string) => apiFetch(`/trainers/${trainerId}/packages`);


// == Payments API ==
export const createCheckoutSession = (packageId: string) => {
    return apiFetch('/checkout/session', { method: 'POST', body: JSON.stringify({ packageId }) });
};

// == Notifications API ==
export const sendPushToken = async (token: string) => {
    return apiFetch('/profile/me/push-token', { method: 'POST', body: JSON.stringify({ token }) });
};

// Live session interactions
export const addExerciseToLiveSession = (sessionId: string, payload: { exercise_id: string }) => apiFetch(`/workout/session/${sessionId}/add-exercise`, { method: 'POST', body: JSON.stringify(payload) });
      ]]>
    </file>
    <file path="app/(app)/(client)/(tabs)/my-progress.tsx">
      <![CDATA[
import { View, Text } from '@/components/Themed';
import { StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { H3, YStack, ToggleGroup, Label, H5, XStack } from 'tamagui';
import { useQuery } from '@tanstack/react-query';
import { getProgressData, getClientAssessments } from '@/lib/api';
import { LineChart, YAxis, Grid } from 'react-native-svg-charts';
import { useState } from 'react';
import { Card } from '@/components/ui/Card';

type Metric = 'weight' | 'bodyfat';
type ActiveTab = Metric | 'assessments';

export default function MyProgressScreen() {
    const [activeTab, setActiveTab] = useState<ActiveTab>('weight');

    const { data: progressData, isLoading: isProgressLoading } = useQuery({ 
        queryKey: ['progressData'], 
        queryFn: getProgressData,
        enabled: activeTab === 'weight' || activeTab === 'bodyfat',
    });

    const { data: assessments, isLoading: areAssessmentsLoading } = useQuery({
        queryKey: ['assessments'],
        queryFn: getClientAssessments,
        enabled: activeTab === 'assessments',
    });

    const renderChart = () => {
        if (isProgressLoading) {
            return <ActivityIndicator />;
        }
        if (!progressData || !progressData[activeTab] || progressData[activeTab].length === 0) {
            return <Text>No {activeTab} data logged yet.</Text>;
        }

        const chartData = progressData[activeTab].map((d: any) => d.value);
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
                    formatLabel={(value) => `${value}${activeTab === 'weight' ? 'kg' : '%'}`}
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

    const renderAssessments = () => {
        if (areAssessmentsLoading) {
            return <ActivityIndicator />;
        }
        if (!assessments || assessments.length === 0) {
            return <Text>No assessments found.</Text>;
        }

        return (
            <ScrollView style={{width: '100%'}}>
                <YStack space="$3">
                    {assessments.map((assessment: any) => (
                        <Card key={assessment.id} padding="$3">
                            <H5>{assessment.name}</H5>
                            <Text style={styles.dateText}>{new Date(assessment.date).toDateString()}</Text>
                             {assessment.metrics.map((metric: any) => (
                                <XStack key={metric.id} justifyContent='space-between' my="$1">
                                    <Text>{metric.name}:</Text>
                                    <Text style={styles.metricValue}>{metric.value} {metric.unit}</Text>
                                </XStack>
                            ))}
                        </Card>
                    ))}
                </YStack>
            </ScrollView>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <YStack space="$4" padding="$4" flex={1}>
                <H3>My Progress</H3>
                <ToggleGroup type="single" value={activeTab} onValueChange={(val: ActiveTab) => val && setActiveTab(val)} orientation="horizontal" alignSelf='center'>
                    <ToggleGroup.Item value="weight">
                        <Label>Weight</Label>
                    </ToggleGroup.Item>
                    <ToggleGroup.Item value="bodyfat">
                        <Label>Body Fat</Label>
                    </ToggleGroup.Item>
                    <ToggleGroup.Item value="assessments">
                        <Label>Assessments</Label>
                    </ToggleGroup.Item>
                </ToggleGroup>
                <View style={styles.contentContainer}>
                    {activeTab === 'assessments' ? renderAssessments() : renderChart()}
                </View>
            </YStack>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        padding: 10,
    },
    dateText: {
        color: 'gray',
        marginBottom: 10,
    },
    metricValue: {
        fontWeight: 'bold',
    }
});
      ]]>
    </file>
    <file path="TASKS.md">
      <![CDATA[
### **Phase 1: Critical Blocker Resolution**

This phase addresses the fundamental API connection issue that prevents the entire application from functioning. This must be completed before any other work begins.

*   [x] **Task 1: Fix API Request Path Construction**
    *   **File to Modify:** `lib/api.ts`
    *   **Issue:** The `apiFetch` function constructs endpoint paths like `/auth/me` instead of the required `/api/auth/me`.
    *   **Action:** Modify the `fetch` call within the `apiFetch` function to prepend `/api` to every endpoint.
        *   Change:
            ```typescript
            const response = await fetch(`${API_URL}${endpoint}`, { ... });
            ```
        *   To:
            ```typescript
            const response = await fetch(`${API_URL}/api${endpoint}`, { ... });
            ```
    *   **Verification:** After this change, run the application and confirm that data loads on at least one screen (e.g., the Client Dashboard or Trainer Clients list).

---

### **Phase 2: Implement Core Trainer Functionality**

This phase focuses on filling the major feature gaps on the trainer side of the application, which is currently the most underdeveloped.

*   [x] **Task 2: Build the Full Profile Editor**
    *   **File to Modify:** `app/(app)/(trainer)/(tabs)/profile/edit.tsx` (and create new components as needed).
    *   **Issue:** This screen is currently a placeholder.
    *   **Sub-tasks:**
        *   [x] **2.1: Implement Core Info Form:** Create a form to edit the trainer's name, username, certifications, and phone. This form should call a new API function that performs a `PUT` request to `/api/profile/me/core-info`.
        *   [x] **2.2: Implement Services Management UI:** Create a UI to list, add, edit, and delete services. This will require new API functions for `POST`, `PUT`, and `DELETE` requests to `/api/profile/me/services` and `/api/profile/me/services/[serviceId]`.
        *   [x] **2.3: Implement Packages Management UI:** Similar to services, build a UI to manage training packages, using the endpoints `POST`, `PUT`, and `DELETE` on `/api/profile/me/packages` and `/api/profile/me/packages/[packageId]`.
        *   [x] **2.4: Implement Testimonials Management UI:** Build a UI to add, edit, and delete client testimonials using the `/api/profile/me/testimonials` endpoints.
        *   [x] **2.5: Implement Transformation Photos UI:** Build a UI to upload and delete transformation photos. This will involve handling file uploads to a dedicated endpoint if one exists, or using the existing client photo upload logic adapted for trainers.

*   [x] **Task 3: Implement Program & Template Builder**
    *   **File to Modify:** `app/(app)/(trainer)/(tabs)/programs/index.tsx`.
    *   **Issue:** This screen is currently a read-only list.
    *   **Sub-tasks:**
        *   [x] **3.1: Add "Create Program" Functionality:** Implement a button and modal/form to create a new workout program via a `POST` request to `/api/trainer/programs`.
        *   [x] **3.2: Add "Create Template" Functionality:** Implement a button and modal/form to create a new workout template within a program.
        *   [x] **3.3: Build Template Editor UI:** Create a detailed view for a selected template where the trainer can add/remove exercises. This will involve:
            *   Fetching all available exercises from `GET /api/exercises`.
            *   Building a UI to search and select exercises.
            *   Calling an endpoint to add the selected exercise to the template (e.g., `POST /api/trainer/programs/templates/[id]/exercises`).

*   [x] **Task 4: Enhance Trainer Dashboard**
    *   **File to Modify:** `app/(app)/(trainer)/(tabs)/dashboard/index.tsx`.
    *   **Issue:** The dashboard only shows basic stats and does not use the rich data from the API.
    *   **Sub-tasks:**
        *   [x] **4.1: Fetch and Display Rich Analytics:** Update the `useQuery` hook to fetch data from `/api/trainer/dashboard`.
        *   [x] **4.2: Create Chart Components:** Build simple chart components to visualize `businessPerformance`, `clientEngagement`, and `servicePopularity` data.

*   [x] **Task 5: Make Live Workout View Interactive**
    *   **File to Modify:** `app/(app)/(trainer)/client/[id]/live.tsx`.
    *   **Issue:** The view is a passive, read-only feed.
    *   **Sub-tasks:**
        *   [x] **5.1: Add Controls for Session Management:** Implement UI elements (buttons, forms) that allow the trainer to:
            *   Add a new exercise to the client's live session.
            *   Log a set (reps/weight) on behalf of the client using `POST /api/workout/log`.
            *   Finish the client's workout using `POST /api/workout/session/finish`.
        *   [x] **5.2: Update State on Action:** Ensure that after an action is performed, the component's state is updated to reflect the change, providing an interactive experience.

---

### **Phase 3: Address Client-Side Feature Gaps**

This phase addresses the missing features on the client side to provide a complete user experience.

*   [x] **Task 6: Implement Package Purchasing**
    *   **File to Modify:** `app/(app)/(client)/(tabs)/my-trainer.tsx`.
    *   **Issue:** The "Buy Package" button is hardcoded.
    *   **Sub-tasks:**
        *   [x] **6.1: Fetch Trainer's Packages:** Create a new API function to fetch the trainer's available packages from an endpoint like `GET /api/trainers/[username]/packages`.
        *   [x] **6.2: Display Packages Dynamically:** Render the fetched packages in a list or as cards.
        *   [x] **6.3: Update Checkout Flow:** Modify the `handleBuyPackage` function to use the ID of the *selected* package when calling `createCheckoutSession`.

*   [x] **Task 7: Implement Assessment Viewing**
    *   **Issue:** There is no UI for clients to view their assessment history.
    *   **Sub-tasks:**
        *   [x] **7.1: Create New Assessment Screen:** Create a new screen, possibly as a tab within `my-progress.tsx` or as a new route.
        *   [x] **7.2: Fetch Assessment Data:** Use `react-query` to fetch the client's assessment history from `GET /api/clients/[id]/assessments`.
        *   [x] **7.3: Display Assessment History:** Render the assessment data, ideally with charts to show progress for each assessment type over time.
- [x] Confirm completion of Phase 1.
- [x] Implement the full phase 2
- [x] implement the full phase 3
      ]]>
    </file>
  </modifications>
</response>
```