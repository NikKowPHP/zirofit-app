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
      
      console.log('api request with endpoint', API_URL, endpoint)

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
    
    // Handle network errors specifically
    if (error instanceof TypeError && error.message === 'Network request failed') {
      throw new Error('Network connection failed. Please check your internet connection and try again.');
    }
    
    // Handle other errors with more user-friendly messages
    if (error instanceof Error) {
      throw new Error(error.message || 'An unexpected error occurred. Please try again.');
    }
    
    throw new Error('An unexpected error occurred. Please try again.');
  }
};

// == Auth API ==
export const getMe = () => apiFetch('/auth/me');

// == Dashboard API ==
export const getDashboard = () => apiFetch('/dashboard');


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
export const getProgressData = () => apiFetch('/client/progress');
export const getMyTrainer = () => apiFetch('/client/trainer');
export const getClientAssessments = () => apiFetch('/client/assessments');


// == Trainer API ==
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
      