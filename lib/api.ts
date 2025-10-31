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
      