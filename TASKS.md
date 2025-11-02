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
      