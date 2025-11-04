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
      
    console.log('api request with endpoint', API_URL, endpoint);

    // Handle query parameters for GET requests
    let url = `${API_URL}/api${endpoint}`;
    if (options.method === 'GET' && options.body) {
      const body = JSON.parse(options.body as string);
      const queryParams = new URLSearchParams();
      Object.keys(body).forEach(key => {
        if (body[key] !== undefined && body[key] !== null) {
          queryParams.append(key, String(body[key]));
        }
      });
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }
      // Remove body from options for GET requests
      options = { ...options, body: undefined };
    }

    const response = await fetch(url, {
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
export const syncUser = () => apiFetch('/auth/sync-user', { method: 'POST' });
export const signOut = () => apiFetch('/auth/signout', { method: 'POST' });
export const register = (payload: { email: string; password: string; name?: string }) =>
  apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(payload) });
export const login = (payload: { email: string; password: string }) =>
  apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(payload) });

// == Dashboard API ==
export const getDashboard = () => apiFetch('/dashboard');


// == Workout API ==
export const getActiveWorkoutSession = () => apiFetch('/workout-sessions/live');

export const startWorkoutSession = (templateId: string) => apiFetch('/workout-sessions/start', {
    method: 'POST',
    body: JSON.stringify({ templateId }),
});

export const logSet = (payload: { reps: number; weight: number; exercise_id: string; workout_session_id: string }) => apiFetch('/workout/log', {
    method: 'POST',
    body: JSON.stringify(payload),
});

export const finishWorkoutSession = (sessionId: string) => apiFetch('/workout-sessions/finish', {
    method: 'POST',
    body: JSON.stringify({ sessionId }),
});

export const getWorkoutSessionSummary = (sessionId: string) => apiFetch(`/workout-sessions/${sessionId}/summary`);
export const saveWorkoutAsTemplate = (sessionId: string) => apiFetch(`/workout-sessions/${sessionId}/save-as-template`, { method: 'POST' });
export const addSessionComment = (sessionId: string, comment: string) => apiFetch(`/workout-sessions/${sessionId}/comments`, { method: 'POST', body: JSON.stringify({ comment }) });
export const startRestTimer = (sessionId: string) => apiFetch(`/workout-sessions/${sessionId}/rest/start`, { method: 'POST' });
export const endRestTimer = (sessionId: string) => apiFetch(`/workout-sessions/${sessionId}/rest/end`, { method: 'POST' });

export const getAvailableExercises = () => apiFetch('/exercises');
export const getWorkoutTemplates = () => apiFetch('/workout/templates');

// == History API ==
export const getWorkoutHistory = () => apiFetch('/workout-sessions/history');
export const getSessionDetails = (sessionId: string) => apiFetch(`/workout-sessions/${sessionId}`);

// == Client API ==
export const getProgressData = () => apiFetch('/client/progress');
export const getMyTrainer = () => apiFetch('/client/trainer');
export const getClientAssessments = (clientId: string) => apiFetch(`/clients/${clientId}/assessments`);
export const requestClientLink = () => apiFetch('/clients/request-link', { method: 'POST' });
export const getClientPhotos = (clientId: string) => apiFetch(`/clients/${clientId}/photos`);
export const uploadClientPhoto = (clientId: string, formData: FormData) => apiFetch(`/clients/${clientId}/photos`, { method: 'POST', body: formData });
export const deleteClientPhoto = (clientId: string, photoId: string) => apiFetch(`/clients/${clientId}/photos/${photoId}`, { method: 'DELETE' });
export const getClientMeasurements = (clientId: string) => apiFetch(`/clients/${clientId}/measurements`);
export const addClientMeasurement = (clientId: string, payload: any) => apiFetch(`/clients/${clientId}/measurements`, { method: 'POST', body: JSON.stringify(payload) });
export const updateClientMeasurement = (clientId: string, measurementId: string, payload: any) => apiFetch(`/clients/${clientId}/measurements/${measurementId}`, { method: 'PUT', body: JSON.stringify(payload) });
export const deleteClientMeasurement = (clientId: string, measurementId: string) => apiFetch(`/clients/${clientId}/measurements/${measurementId}`, { method: 'DELETE' });
export const logClientExercise = (clientId: string, payload: any) => apiFetch(`/clients/${clientId}/exercise-logs`, { method: 'POST', body: JSON.stringify(payload) });
export const addClientAssessment = (clientId: string, payload: any) => apiFetch(`/clients/${clientId}/assessments`, { method: 'POST', body: JSON.stringify(payload) });
export const updateClientAssessment = (clientId: string, assessmentId: string, payload: any) => apiFetch(`/clients/${clientId}/assessments/${assessmentId}`, { method: 'PUT', body: JSON.stringify(payload) });
export const deleteClientAssessment = (clientId: string, assessmentId: string) => apiFetch(`/clients/${clientId}/assessments/${assessmentId}`, { method: 'DELETE' });
export const linkToTrainer = () => apiFetch('/client/trainer/link', { method: 'POST' });
export const unlinkFromTrainer = () => apiFetch('/client/trainer/link', { method: 'DELETE' });


// == Trainer API ==
export const getClients = () => apiFetch('/clients');
export const getClientDetails = (clientId: string) => apiFetch(`/clients/${clientId}`);
export const createClient = (email: string) => apiFetch('/clients', { method: 'POST', body: JSON.stringify({ email }) });
export const getTrainerProfile = () => apiFetch('/profile/me');
export const getTrainerProfileDetails = () => apiFetch('/trainer/profile');
export const getTrainerAssessments = () => apiFetch('/trainer/assessments');
export const updateTrainerCoreInfo = (payload: { name: string, username: string, certifications: string, phone: string }) => apiFetch('/profile/me/core-info', {
    method: 'PUT',
    body: JSON.stringify(payload)
});
export const getTrainerCoreInfo = () => apiFetch('/profile/me/core-info');

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
export const uploadTransformationPhoto = (formData: FormData) => apiFetch('/profile/me/transformation-photos', { method: 'POST', body: formData });
export const getTransformationPhotos = () => apiFetch('/profile/me/transformation-photos');
export const deleteTransformationPhoto = (photoId: string) => apiFetch(`/profile/me/transformation-photos/${photoId}`, { method: 'DELETE' });

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
export const updateCalendarSession = (sessionId: string, payload: any) => apiFetch(`/trainer/calendar/${sessionId}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
});
export const deleteCalendarSession = (sessionId: string) => apiFetch(`/trainer/calendar/${sessionId}`, {
    method: 'DELETE'
});
export const getActiveClientWorkoutSession = (clientId: string) => apiFetch(`/clients/${clientId}/session/active`);
export const getTrainerPackages = (trainerUsername: string) => apiFetch(`/trainers/${trainerUsername}/packages`);


// == Payments API ==
export const createCheckoutSession = (packageId: string) => {
    return apiFetch('/checkout/session', { method: 'POST', body: JSON.stringify({ packageId }) });
};

// == Notifications API ==
export const getNotifications = () => apiFetch('/notifications');
export const updateNotification = (notificationId: string, payload: any) => apiFetch(`/notifications/${notificationId}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
});
export const sendPushToken = async (token: string) => {
    return apiFetch('/profile/me/push-token', { method: 'POST', body: JSON.stringify({ token }) });
};

// == Webhooks API ==
export const handleStripeWebhook = (payload: any) => apiFetch('/webhooks/stripe', {
    method: 'POST',
    body: JSON.stringify(payload)
});

// == Public API ==
export const getPublicWorkoutSummary = (sessionId: string) => apiFetch(`/public/workout-summary/${sessionId}`);
export const getTrainerPublicProfile = (username: string) => apiFetch(`/trainers/${username}`);
export const getTrainerTestimonials = (username: string) => apiFetch(`/trainers/${username}/testimonials`);
export const getTrainerSchedule = (username: string) => apiFetch(`/trainers/${username}/schedule`);

// Live session interactions
export const addExerciseToLiveSession = (sessionId: string, payload: { exercise_id: string }) => apiFetch(`/workout-sessions/${sessionId}/add-exercise`, { method: 'POST', body: JSON.stringify(payload) });
      

// == Extended Profile Management ==
export const getProfileTextContent = () => apiFetch('/profile/me/text-content');
export const updateProfileTextContent = (payload: any) => apiFetch('/profile/me/text-content', {
    method: 'PUT',
    body: JSON.stringify(payload)
});
export const getProfileSocialLinks = () => apiFetch('/profile/me/social-links');
export const addProfileSocialLink = (payload: any) => apiFetch('/profile/me/social-links', {
    method: 'POST',
    body: JSON.stringify(payload)
});
export const updateProfileSocialLink = (linkId: string, payload: any) => apiFetch(`/profile/me/social-links/${linkId}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
});
export const deleteProfileSocialLink = (linkId: string) => apiFetch(`/profile/me/social-links/${linkId}`, {
    method: 'DELETE'
});
export const getProfileExternalLinks = () => apiFetch('/profile/me/external-links');
export const addProfileExternalLink = (payload: any) => apiFetch('/profile/me/external-links', {
    method: 'POST',
    body: JSON.stringify(payload)
});
export const updateProfileExternalLink = (linkId: string, payload: any) => apiFetch(`/profile/me/external-links/${linkId}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
});
export const deleteProfileExternalLink = (linkId: string) => apiFetch(`/profile/me/external-links/${linkId}`, {
    method: 'DELETE'
});
export const getProfileBilling = () => apiFetch('/profile/me/billing');
export const updateProfileBilling = (payload: any) => apiFetch('/profile/me/billing', {
    method: 'POST',
    body: JSON.stringify(payload)
});
export const getProfileBenefits = () => apiFetch('/profile/me/benefits');
export const addProfileBenefit = (payload: any) => apiFetch('/profile/me/benefits', {
    method: 'POST',
    body: JSON.stringify(payload)
});
export const updateProfileBenefit = (benefitId: string, payload: any) => apiFetch(`/profile/me/benefits/${benefitId}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
});
export const deleteProfileBenefit = (benefitId: string) => apiFetch(`/profile/me/benefits/${benefitId}`, {
    method: 'DELETE'
});
export const orderProfileBenefits = (payload: any) => apiFetch('/profile/me/benefits/order', {
    method: 'PUT',
    body: JSON.stringify(payload)
});
export const getProfileAvailability = () => apiFetch('/profile/me/availability');
export const updateProfileAvailability = (payload: any) => apiFetch('/profile/me/availability', {
    method: 'PUT',
    body: JSON.stringify(payload)
});
export const getProfileExercises = () => apiFetch('/profile/me/exercises');
export const addProfileExercise = (payload: any) => apiFetch('/profile/me/exercises', {
    method: 'POST',
    body: JSON.stringify(payload)
});
export const updateProfileExercise = (exerciseId: string, payload: any) => apiFetch(`/profile/me/exercises/${exerciseId}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
});
export const deleteProfileExercise = (exerciseId: string) => apiFetch(`/profile/me/exercises/${exerciseId}`, {
    method: 'DELETE'
});

// == Booking Management ==
export const confirmBooking = (bookingId: string) => apiFetch(`/bookings/${bookingId}/confirm`, {
    method: 'PUT'
});
export const declineBooking = (bookingId: string) => apiFetch(`/bookings/${bookingId}/decline`, {
    method: 'PUT'
});

// == Miscellaneous ==
export const findExerciseMedia = (query: string) => apiFetch(`/exercises/find-media?query=${encodeURIComponent(query)}`);
export const getOpenAPISpec = () => apiFetch('/openapi');
export const createProgramTemplate = (payload: any) => apiFetch('/trainer/programs/templates', {
    method: 'POST',
    body: JSON.stringify(payload)
});
export const copyProgramTemplate = (templateId: string) => apiFetch(`/trainer/programs/templates/${templateId}/copy`, {
    method: 'POST'
});
export const updateTemplateExercises = (templateId: string, payload: any) => apiFetch(`/trainer/programs/templates/${templateId}/exercises`, {
    method: 'PUT',
    body: JSON.stringify(payload)
});
export const getTemplateRest = (templateId: string) => apiFetch(`/trainer/programs/templates/${templateId}/rest`);
export const sendSessionReminder = (sessionId: string) => apiFetch(`/trainer/calendar/sessions/${sessionId}/remind`, {
    method: 'POST'
});