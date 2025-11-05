import { supabase } from './supabase';
import type {
  AuthRequest,
  AuthResponse,
  LogSetRequest,
  WorkoutSession,
  WorkoutSessionSummary,
  Exercise,
  WorkoutTemplate,
  Client,
  ClientAssessment,
  ClientMeasurement,
  ClientPhoto,
  ClientExerciseLog,
  TrainerProfile,
  TrainerService,
  TrainerPackage,
  TrainerTestimonial,
  TrainerProgram,
  ProfileCoreInfo,
  ProfileTextContent,
  SocialLink,
  ExternalLink,
  ProfileBenefit,
  ProfileExercise,
  ProfileAvailability,
  CalendarEvent,
  Notification,
  DashboardData,
  ProgressData,
  Booking,
  ApiResponse,
  PaginatedResponse,
  ApiError,
  PaginationParams,
  SearchParams,
  DateRange
} from './api.types';

// Custom API Error class
export class ApiFetchError extends Error implements ApiError {
  public readonly status: number;
  public readonly details?: any;
  public readonly endpoint: string;
  public readonly method: string;
  public readonly timestamp: string;
  public readonly code?: string;

  constructor(
    message: string,
    status: number,
    endpoint: string,
    method: string = 'GET',
    details?: any,
    code?: string
  ) {
    super(message);
    this.name = 'ApiFetchError';
    this.status = status;
    this.endpoint = endpoint;
    this.method = method;
    this.details = details;
    this.code = code;
    this.timestamp = new Date().toISOString();
    
    // Ensure the prototype chain is correct
    Object.setPrototypeOf(this, ApiFetchError.prototype);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      endpoint: this.endpoint,
      method: this.method,
      details: this.details,
      code: this.code,
      timestamp: this.timestamp
    };
  }
}

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
        let errorMessage = `Network response was not ok: ${response.statusText}`;
        let errorDetails: any = null;
        
        try {
            const errorJson = JSON.parse(errorBody);
            errorMessage = errorJson.message || errorMessage;
            errorDetails = errorJson.details || errorJson;
            
            // Add specific error handling for common error scenarios
            if (response.status === 401) {
                errorMessage = 'Authentication failed. Please log in again.';
            } else if (response.status === 403) {
                errorMessage = 'Access denied. You do not have permission to perform this action.';
            } else if (response.status === 422) {
                errorMessage = 'Validation failed. Please check your input and try again.';
            } else if (response.status >= 500) {
                errorMessage = 'Server error. Please try again later.';
            }
        } catch (e) {
            // If error body is not JSON, use the raw response text
            if (errorBody && errorBody.length > 0) {
                errorMessage = errorBody;
            }
        }
        
        // Create a more detailed error object
        throw new ApiFetchError(
            errorMessage,
            response.status,
            endpoint,
            options.method || 'GET',
            errorDetails
        );
    }

    if (response.status === 204) { // No Content
        return null;
    }

    return response.json();
  } catch (error) {
    console.error("Failed to fetch API:", error);
    
    // Handle network errors specifically
    if (error instanceof TypeError && error.message === 'Network request failed') {
      throw new ApiFetchError(
        'Network connection failed. Please check your internet connection and try again.',
        0,
        endpoint,
        options.method || 'GET'
      );
    }
    
    // Re-throw ApiFetchError instances as-is since they already contain detailed information
    if (error instanceof ApiFetchError) {
      throw error;
    }
    
    // Handle other errors with more user-friendly messages
    if (error instanceof Error) {
      throw new ApiFetchError(
        error.message || 'An unexpected error occurred. Please try again.',
        0,
        endpoint,
        options.method || 'GET'
      );
    }
    
    // Fallback error
    throw new ApiFetchError(
      'An unexpected error occurred. Please try again.',
      0,
      endpoint,
      options.method || 'GET'
    );
  }
};

// == Auth API ==
/**
 * Get current user information
 * @returns {Promise<AuthResponse>} User information
 */
export const getMe = (): Promise<AuthResponse> => apiFetch('/auth/me');

/**
 * Sync user data with backend
 * @returns {Promise<void>} Success response
 */
export const syncUser = (): Promise<void> => apiFetch('/auth/sync-user', { method: 'POST' });

/**
 * Sign out current user
 * @returns {Promise<void>} Success response
 */
export const signOut = (): Promise<void> => apiFetch('/auth/signout', { method: 'POST' });

/**
 * Register a new user
 * @param {AuthRequest} payload - Registration data
 * @returns {Promise<AuthResponse>} User information
 */
export const register = (payload: AuthRequest): Promise<AuthResponse> =>
  apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(payload) });

/**
 * Login user
 * @param {AuthRequest} payload - Login credentials
 * @returns {Promise<AuthResponse>} User information
 */
export const login = (payload: AuthRequest): Promise<AuthResponse> =>
  apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(payload) });

// == Dashboard API ==
/**
 * Get dashboard data including upcoming sessions, recent workouts, and stats
 * @returns {Promise<DashboardData>} Dashboard data
 */
export const getDashboard = (): Promise<DashboardData> => apiFetch('/dashboard');


// == Workout API ==
/**
 * Get currently active workout session
 * @returns {Promise<WorkoutSession | null>} Active workout session or null if none
 */
export const getActiveWorkoutSession = (): Promise<WorkoutSession | null> => apiFetch('/workout-sessions/live');

/**
 * Start a new workout session
 * @param {string} templateId - Template ID to start workout from
 * @returns {Promise<WorkoutSession>} Created workout session
 */
export const startWorkoutSession = (templateId: string): Promise<WorkoutSession> => apiFetch('/workout-sessions/start', {
    method: 'POST',
    body: JSON.stringify({ templateId }),
});

/**
 * Log a set for an exercise
 * @param {LogSetRequest} payload - Set data including reps, weight, exercise and session IDs
 * @returns {Promise<void>} Success response
 */
export const logSet = (payload: LogSetRequest): Promise<void> => apiFetch('/workout/log', {
    method: 'POST',
    body: JSON.stringify(payload),
});

/**
 * Finish a workout session
 * @param {string} sessionId - Session ID to finish
 * @returns {Promise<WorkoutSession>} Updated workout session
 */
export const finishWorkoutSession = (sessionId: string): Promise<WorkoutSession> => apiFetch('/workout-sessions/finish', {
    method: 'POST',
    body: JSON.stringify({ sessionId }),
});

/**
 * Get workout session summary
 * @param {string} sessionId - Session ID
 * @returns {Promise<WorkoutSessionSummary>} Session summary data
 */
export const getWorkoutSessionSummary = (sessionId: string): Promise<WorkoutSessionSummary> => apiFetch(`/workout-sessions/${sessionId}/summary`);

/**
 * Save a completed workout as a template
 * @param {string} sessionId - Session ID to save as template
 * @returns {Promise<WorkoutTemplate>} Created workout template
 */
export const saveWorkoutAsTemplate = (sessionId: string): Promise<WorkoutTemplate> => apiFetch(`/workout-sessions/${sessionId}/save-as-template`, { method: 'POST' });

/**
 * Add a comment to a workout session
 * @param {string} sessionId - Session ID
 * @param {string} comment - Comment text
 * @returns {Promise<void>} Success response
 */
export const addSessionComment = (sessionId: string, comment: string): Promise<void> => apiFetch(`/workout-sessions/${sessionId}/comments`, { method: 'POST', body: JSON.stringify({ comment }) });

/**
 * Start rest timer for a workout session
 * @param {string} sessionId - Session ID
 * @returns {Promise<void>} Success response
 */
export const startRestTimer = (sessionId: string): Promise<void> => apiFetch(`/workout-sessions/${sessionId}/rest/start`, { method: 'POST' });

/**
 * End rest timer for a workout session
 * @param {string} sessionId - Session ID
 * @returns {Promise<void>} Success response
 */
export const endRestTimer = (sessionId: string): Promise<void> => apiFetch(`/workout-sessions/${sessionId}/rest/end`, { method: 'POST' });

/**
 * Get available exercises
 * @returns {Promise<Exercise[]>} List of available exercises
 */
export const getAvailableExercises = (): Promise<Exercise[]> => apiFetch('/exercises');

/**
 * Get workout templates
 * @returns {Promise<WorkoutTemplate[]>} List of workout templates
 */
export const getWorkoutTemplates = (): Promise<WorkoutTemplate[]> => apiFetch('/workout/templates');

// == History API ==
/**
 * Get workout session history
 * @returns {Promise<WorkoutSession[]>} List of workout sessions
 */
export const getWorkoutHistory = (): Promise<WorkoutSession[]> => apiFetch('/workout-sessions/history');

/**
 * Get detailed information about a specific workout session
 * @param {string} sessionId - Session ID
 * @returns {Promise<WorkoutSession>} Session details
 */
export const getSessionDetails = (sessionId: string): Promise<WorkoutSession> => apiFetch(`/workout-sessions/${sessionId}`);

// == Client API ==
/**
 * Get client progress data
 * @returns {Promise<ProgressData>} Progress data including metrics and achievements
 */
export const getProgressData = (): Promise<ProgressData> => apiFetch('/client/progress');

/**
 * Get client's trainer information
 * @returns {Promise<TrainerProfile | null>} Trainer profile or null if not linked
 */
export const getMyTrainer = (): Promise<TrainerProfile | null> => apiFetch('/client/trainer');

/**
 * Get client assessments
 * @param {string} clientId - Client ID
 * @returns {Promise<ClientAssessment[]>} List of client assessments
 */
export const getClientAssessments = (clientId: string): Promise<ClientAssessment[]> => apiFetch(`/clients/${clientId}/assessments`);

/**
 * Request a client link from trainer
 * @returns {Promise<void>} Success response
 */
export const requestClientLink = (): Promise<void> => apiFetch('/clients/request-link', { method: 'POST' });

/**
 * Get client photos
 * @param {string} clientId - Client ID
 * @returns {Promise<ClientPhoto[]>} List of client photos
 */
export const getClientPhotos = (clientId: string): Promise<ClientPhoto[]> => apiFetch(`/clients/${clientId}/photos`);

/**
 * Upload a client photo
 * @param {string} clientId - Client ID
 * @param {FormData} formData - Form data with photo file
 * @returns {Promise<ClientPhoto>} Uploaded photo information
 */
export const uploadClientPhoto = (clientId: string, formData: FormData): Promise<ClientPhoto> => apiFetch(`/clients/${clientId}/photos`, { method: 'POST', body: formData });

/**
 * Delete a client photo
 * @param {string} clientId - Client ID
 * @param {string} photoId - Photo ID
 * @returns {Promise<void>} Success response
 */
export const deleteClientPhoto = (clientId: string, photoId: string): Promise<void> => apiFetch(`/clients/${clientId}/photos/${photoId}`, { method: 'DELETE' });

/**
 * Get client measurements
 * @param {string} clientId - Client ID
 * @returns {Promise<ClientMeasurement[]>} List of client measurements
 */
export const getClientMeasurements = (clientId: string): Promise<ClientMeasurement[]> => apiFetch(`/clients/${clientId}/measurements`);

/**
 * Add a client measurement
 * @param {string} clientId - Client ID
 * @param {ClientMeasurement} payload - Measurement data
 * @returns {Promise<ClientMeasurement>} Created measurement
 */
export const addClientMeasurement = (clientId: string, payload: ClientMeasurement): Promise<ClientMeasurement> => apiFetch(`/clients/${clientId}/measurements`, { method: 'POST', body: JSON.stringify(payload) });

/**
 * Update a client measurement
 * @param {string} clientId - Client ID
 * @param {string} measurementId - Measurement ID
 * @param {ClientMeasurement} payload - Updated measurement data
 * @returns {Promise<ClientMeasurement>} Updated measurement
 */
export const updateClientMeasurement = (clientId: string, measurementId: string, payload: ClientMeasurement): Promise<ClientMeasurement> => apiFetch(`/clients/${clientId}/measurements/${measurementId}`, { method: 'PUT', body: JSON.stringify(payload) });

/**
 * Delete a client measurement
 * @param {string} clientId - Client ID
 * @param {string} measurementId - Measurement ID
 * @returns {Promise<void>} Success response
 */
export const deleteClientMeasurement = (clientId: string, measurementId: string): Promise<void> => apiFetch(`/clients/${clientId}/measurements/${measurementId}`, { method: 'DELETE' });

/**
 * Log a client exercise
 * @param {string} clientId - Client ID
 * @param {ClientExerciseLog} payload - Exercise log data
 * @returns {Promise<ClientExerciseLog>} Created exercise log
 */
export const logClientExercise = (clientId: string, payload: ClientExerciseLog): Promise<ClientExerciseLog> => apiFetch(`/clients/${clientId}/exercise-logs`, { method: 'POST', body: JSON.stringify(payload) });

/**
 * Add a client assessment
 * @param {string} clientId - Client ID
 * @param {ClientAssessment} payload - Assessment data
 * @returns {Promise<ClientAssessment>} Created assessment
 */
export const addClientAssessment = (clientId: string, payload: ClientAssessment): Promise<ClientAssessment> => apiFetch(`/clients/${clientId}/assessments`, { method: 'POST', body: JSON.stringify(payload) });

/**
 * Update a client assessment
 * @param {string} clientId - Client ID
 * @param {string} assessmentId - Assessment ID
 * @param {ClientAssessment} payload - Updated assessment data
 * @returns {Promise<ClientAssessment>} Updated assessment
 */
export const updateClientAssessment = (clientId: string, assessmentId: string, payload: ClientAssessment): Promise<ClientAssessment> => apiFetch(`/clients/${clientId}/assessments/${assessmentId}`, { method: 'PUT', body: JSON.stringify(payload) });

/**
 * Delete a client assessment
 * @param {string} clientId - Client ID
 * @param {string} assessmentId - Assessment ID
 * @returns {Promise<void>} Success response
 */
export const deleteClientAssessment = (clientId: string, assessmentId: string): Promise<void> => apiFetch(`/clients/${clientId}/assessments/${assessmentId}`, { method: 'DELETE' });

/**
 * Link client to trainer
 * @returns {Promise<void>} Success response
 */
export const linkToTrainer = (): Promise<void> => apiFetch('/client/trainer/link', { method: 'POST' });

/**
 * Unlink client from trainer
 * @returns {Promise<void>} Success response
 */
export const unlinkFromTrainer = (): Promise<void> => apiFetch('/client/trainer/link', { method: 'DELETE' });


// == Trainer API ==
/**
 * Get all clients for trainer
 * @returns {Promise<Client[]>} List of clients
 */
export const getClients = (): Promise<Client[]> => apiFetch('/clients');

/**
 * Get detailed information about a specific client
 * @param {string} clientId - Client ID
 * @returns {Promise<Client>} Client details
 */
export const getClientDetails = (clientId: string): Promise<Client> => apiFetch(`/clients/${clientId}`);

/**
 * Create a new client
 * @param {string} email - Client email address
 * @returns {Promise<Client>} Created client
 */
export const createClient = (email: string): Promise<Client> => apiFetch('/clients', { method: 'POST', body: JSON.stringify({ email }) });

/**
 * Get trainer's own profile information
 * @returns {Promise<TrainerProfile>} Trainer profile
 */
export const getTrainerProfile = (): Promise<TrainerProfile> => apiFetch('/profile/me');

/**
 * Get trainer profile details (separate from /profile/me)
 * @returns {Promise<TrainerProfile>} Trainer profile details
 */
export const getTrainerProfileDetails = (): Promise<TrainerProfile> => apiFetch('/trainer/profile');

/**
 * Get trainer's assessments
 * @returns {Promise<ClientAssessment[]>} List of assessments
 */
export const getTrainerAssessments = (): Promise<ClientAssessment[]> => apiFetch('/trainer/assessments');

/**
 * Update trainer core information
 * @param {ProfileCoreInfo} payload - Core information to update
 * @returns {Promise<TrainerProfile>} Updated trainer profile
 */
export const updateTrainerCoreInfo = (payload: ProfileCoreInfo): Promise<TrainerProfile> => apiFetch('/profile/me/core-info', {
    method: 'PUT',
    body: JSON.stringify(payload)
});

/**
 * Get trainer core information
 * @returns {Promise<ProfileCoreInfo>} Trainer core information
 */
export const getTrainerCoreInfo = (): Promise<ProfileCoreInfo> => apiFetch('/profile/me/core-info');

// Trainer Profile Services
/**
 * Add a new trainer service
 * @param {TrainerService} payload - Service data
 * @returns {Promise<TrainerService>} Created service
 */
export const addTrainerService = (payload: TrainerService): Promise<TrainerService> => apiFetch('/profile/me/services', {
    method: 'POST',
    body: JSON.stringify(payload)
});

/**
 * Update a trainer service
 * @param {string} serviceId - Service ID
 * @param {TrainerService} payload - Updated service data
 * @returns {Promise<TrainerService>} Updated service
 */
export const updateTrainerService = (serviceId: string, payload: TrainerService): Promise<TrainerService> => apiFetch(`/profile/me/services/${serviceId}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
});

/**
 * Delete a trainer service
 * @param {string} serviceId - Service ID
 * @returns {Promise<void>} Success response
 */
export const deleteTrainerService = (serviceId: string): Promise<void> => apiFetch(`/profile/me/services/${serviceId}`, {
    method: 'DELETE'
});

// Trainer Profile Packages
/**
 * Add a new trainer package
 * @param {TrainerPackage} payload - Package data
 * @returns {Promise<TrainerPackage>} Created package
 */
export const addTrainerPackage = (payload: TrainerPackage): Promise<TrainerPackage> => apiFetch('/profile/me/packages', { method: 'POST', body: JSON.stringify(payload) });

/**
 * Update a trainer package
 * @param {string} packageId - Package ID
 * @param {TrainerPackage} payload - Updated package data
 * @returns {Promise<TrainerPackage>} Updated package
 */
export const updateTrainerPackage = (packageId: string, payload: TrainerPackage): Promise<TrainerPackage> => apiFetch(`/profile/me/packages/${packageId}`, { method: 'PUT', body: JSON.stringify(payload) });

/**
 * Delete a trainer package
 * @param {string} packageId - Package ID
 * @returns {Promise<void>} Success response
 */
export const deleteTrainerPackage = (packageId: string): Promise<void> => apiFetch(`/profile/me/packages/${packageId}`, { method: 'DELETE' });

// Trainer Profile Testimonials
/**
 * Add a new trainer testimonial
 * @param {TrainerTestimonial} payload - Testimonial data
 * @returns {Promise<TrainerTestimonial>} Created testimonial
 */
export const addTrainerTestimonial = (payload: TrainerTestimonial): Promise<TrainerTestimonial> => apiFetch('/profile/me/testimonials', { method: 'POST', body: JSON.stringify(payload) });

/**
 * Update a trainer testimonial
 * @param {string} testimonialId - Testimonial ID
 * @param {TrainerTestimonial} payload - Updated testimonial data
 * @returns {Promise<TrainerTestimonial>} Updated testimonial
 */
export const updateTrainerTestimonial = (testimonialId: string, payload: TrainerTestimonial): Promise<TrainerTestimonial> => apiFetch(`/profile/me/testimonials/${testimonialId}`, { method: 'PUT', body: JSON.stringify(payload) });

/**
 * Delete a trainer testimonial
 * @param {string} testimonialId - Testimonial ID
 * @returns {Promise<void>} Success response
 */
export const deleteTrainerTestimonial = (testimonialId: string): Promise<void> => apiFetch(`/profile/me/testimonials/${testimonialId}`, { method: 'DELETE' });

// Trainer Profile Transformations
/**
 * Upload a transformation photo
 * @param {FormData} formData - Form data with photo file
 * @returns {Promise<ClientPhoto>} Uploaded photo information
 */
export const uploadTransformationPhoto = (formData: FormData): Promise<ClientPhoto> => apiFetch('/profile/me/transformation-photos', { method: 'POST', body: formData });

/**
 * Get transformation photos
 * @returns {Promise<ClientPhoto[]>} List of transformation photos
 */
export const getTransformationPhotos = (): Promise<ClientPhoto[]> => apiFetch('/profile/me/transformation-photos');

/**
 * Delete a transformation photo
 * @param {string} photoId - Photo ID
 * @returns {Promise<void>} Success response
 */
export const deleteTransformationPhoto = (photoId: string): Promise<void> => apiFetch(`/profile/me/transformation-photos/${photoId}`, { method: 'DELETE' });

// Trainer Programs & Templates
/**
 * Get trainer's programs
 * @returns {Promise<TrainerProgram[]>} List of programs
 */
export const getPrograms = (): Promise<TrainerProgram[]> => apiFetch('/trainer/programs');

/**
 * Create a new program
 * @param {TrainerProgram} payload - Program data
 * @returns {Promise<TrainerProgram>} Created program
 */
export const createProgram = (payload: TrainerProgram): Promise<TrainerProgram> => apiFetch('/trainer/programs', { method: 'POST', body: JSON.stringify(payload) });

/**
 * Get program details
 * @param {string} programId - Program ID
 * @returns {Promise<TrainerProgram>} Program details
 */
export const getProgramDetails = (programId: string): Promise<TrainerProgram> => apiFetch(`/trainer/programs/${programId}`);

/**
 * Create a new template for a program
 * @param {string} programId - Program ID
 * @param {WorkoutTemplate} payload - Template data
 * @returns {Promise<WorkoutTemplate>} Created template
 */
export const createTemplate = (programId: string, payload: WorkoutTemplate): Promise<WorkoutTemplate> => apiFetch(`/trainer/programs/${programId}/templates`, { method: 'POST', body: JSON.stringify(payload) });

/**
 * Get template details
 * @param {string} templateId - Template ID
 * @returns {Promise<WorkoutTemplate>} Template details
 */
export const getTemplateDetails = (templateId: string): Promise<WorkoutTemplate> => apiFetch(`/trainer/templates/${templateId}`);

/**
 * Add exercise to template
 * @param {string} templateId - Template ID
 * @param {any} payload - Exercise data
 * @returns {Promise<void>} Success response
 */
export const addExerciseToTemplate = (templateId: string, payload: { exercise_id: string }): Promise<void> => apiFetch(`/trainer/templates/${templateId}/exercises`, { method: 'POST', body: JSON.stringify(payload) });

/**
 * Remove exercise from template
 * @param {string} templateId - Template ID
 * @param {string} exerciseId - Exercise ID
 * @returns {Promise<void>} Success response
 */
export const removeExerciseFromTemplate = (templateId: string, exerciseId: string): Promise<void> => apiFetch(`/trainer/templates/${templateId}/exercises/${exerciseId}`, { method: 'DELETE' });

/**
 * Get calendar events for date range
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Promise<CalendarEvent[]>} List of calendar events
 */
export const getCalendarEvents = (startDate: string, endDate: string): Promise<CalendarEvent[]> => apiFetch(`/trainer/calendar?startDate=${startDate}&endDate=${endDate}`);

/**
 * Plan a new session
 * @param {any} payload - Session data
 * @returns {Promise<CalendarEvent>} Created session
 */
export const planSession = (payload: { date: string, notes: string, clientId: string, templateId?: string }): Promise<CalendarEvent> => apiFetch('/trainer/calendar', {
    method: 'POST',
    body: JSON.stringify(payload)
});

/**
 * Update a calendar session
 * @param {string} sessionId - Session ID
 * @param {any} payload - Updated session data
 * @returns {Promise<CalendarEvent>} Updated session
 */
export const updateCalendarSession = (sessionId: string, payload: any): Promise<CalendarEvent> => apiFetch(`/trainer/calendar/${sessionId}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
});

/**
 * Delete a calendar session
 * @param {string} sessionId - Session ID
 * @returns {Promise<void>} Success response
 */
export const deleteCalendarSession = (sessionId: string): Promise<void> => apiFetch(`/trainer/calendar/${sessionId}`, {
    method: 'DELETE'
});

/**
 * Get active workout session for a client
 * @param {string} clientId - Client ID
 * @returns {Promise<WorkoutSession | null>} Active workout session or null
 */
export const getActiveClientWorkoutSession = (clientId: string): Promise<WorkoutSession | null> => apiFetch(`/clients/${clientId}/session/active`);

/**
 * Get trainer packages by username
 * @param {string} trainerUsername - Trainer username
 * @returns {Promise<TrainerPackage[]>} List of trainer packages
 */
export const getTrainerPackages = (trainerUsername: string): Promise<TrainerPackage[]> => apiFetch(`/trainers/${trainerUsername}/packages`);


// == Payments API ==
/**
 * Create a checkout session for payment
 * @param {string} packageId - Package ID to purchase
 * @returns {Promise<any>} Checkout session data
 */
export const createCheckoutSession = (packageId: string): Promise<any> => {
    return apiFetch('/checkout/session', { method: 'POST', body: JSON.stringify({ packageId }) });
};

// == Notifications API ==
/**
 * Get user notifications
 * @returns {Promise<Notification[]>} List of notifications
 */
export const getNotifications = (): Promise<Notification[]> => apiFetch('/notifications');

/**
 * Update a notification
 * @param {string} notificationId - Notification ID
 * @param {any} payload - Updated notification data
 * @returns {Promise<Notification>} Updated notification
 */
export const updateNotification = (notificationId: string, payload: any): Promise<Notification> => apiFetch(`/notifications/${notificationId}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
});

/**
 * Send push notification token to server
 * @param {string} token - Push notification token
 * @returns {Promise<void>} Success response
 */
export const sendPushToken = async (token: string): Promise<void> => {
    return apiFetch('/profile/me/push-token', { method: 'POST', body: JSON.stringify({ token }) });
};

// == Webhooks API ==
/**
 * Handle Stripe webhook events
 * @param {any} payload - Webhook payload
 * @returns {Promise<void>} Success response
 */
export const handleStripeWebhook = (payload: any): Promise<void> => apiFetch('/webhooks/stripe', {
    method: 'POST',
    body: JSON.stringify(payload)
});

// == Public API ==
/**
 * Get public workout summary
 * @param {string} sessionId - Session ID
 * @returns {Promise<any>} Public workout summary data
 */
export const getPublicWorkoutSummary = (sessionId: string): Promise<any> => apiFetch(`/public/workout-summary/${sessionId}`);

/**
 * Get trainer's public profile
 * @param {string} username - Trainer username
 * @returns {Promise<TrainerProfile>} Trainer public profile
 */
export const getTrainerPublicProfile = (username: string): Promise<TrainerProfile> => apiFetch(`/trainers/${username}`);

/**
 * Get trainer's testimonials (public)
 * @param {string} username - Trainer username
 * @returns {Promise<TrainerTestimonial[]>} List of testimonials
 */
export const getTrainerTestimonials = (username: string): Promise<TrainerTestimonial[]> => apiFetch(`/trainers/${username}/testimonials`);

/**
 * Get trainer's schedule (public)
 * @param {string} username - Trainer username
 * @returns {Promise<any>} Trainer schedule data
 */
export const getTrainerSchedule = (username: string): Promise<any> => apiFetch(`/trainers/${username}/schedule`);

// Live session interactions
/**
 * Add exercise to live workout session
 * @param {string} sessionId - Session ID
 * @param {any} payload - Exercise data
 * @returns {Promise<void>} Success response
 */
export const addExerciseToLiveSession = (sessionId: string, payload: { exercise_id: string }): Promise<void> => apiFetch(`/workout-sessions/${sessionId}/add-exercise`, { method: 'POST', body: JSON.stringify(payload) });
      

// == Extended Profile Management ==
/**
 * Get profile text content
 * @returns {Promise<ProfileTextContent>} Profile text content
 */
export const getProfileTextContent = (): Promise<ProfileTextContent> => apiFetch('/profile/me/text-content');

/**
 * Update profile text content
 * @param {ProfileTextContent} payload - Updated text content
 * @returns {Promise<ProfileTextContent>} Updated text content
 */
export const updateProfileTextContent = (payload: ProfileTextContent): Promise<ProfileTextContent> => apiFetch('/profile/me/text-content', {
    method: 'PUT',
    body: JSON.stringify(payload)
});

/**
 * Get profile social links
 * @returns {Promise<SocialLink[]>} List of social links
 */
export const getProfileSocialLinks = (): Promise<SocialLink[]> => apiFetch('/profile/me/social-links');

/**
 * Add a profile social link
 * @param {SocialLink} payload - Social link data
 * @returns {Promise<SocialLink>} Created social link
 */
export const addProfileSocialLink = (payload: SocialLink): Promise<SocialLink> => apiFetch('/profile/me/social-links', {
    method: 'POST',
    body: JSON.stringify(payload)
});

/**
 * Update a profile social link
 * @param {string} linkId - Link ID
 * @param {SocialLink} payload - Updated social link data
 * @returns {Promise<SocialLink>} Updated social link
 */
export const updateProfileSocialLink = (linkId: string, payload: SocialLink): Promise<SocialLink> => apiFetch(`/profile/me/social-links/${linkId}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
});

/**
 * Delete a profile social link
 * @param {string} linkId - Link ID
 * @returns {Promise<void>} Success response
 */
export const deleteProfileSocialLink = (linkId: string): Promise<void> => apiFetch(`/profile/me/social-links/${linkId}`, {
    method: 'DELETE'
});

/**
 * Get profile external links
 * @returns {Promise<ExternalLink[]>} List of external links
 */
export const getProfileExternalLinks = (): Promise<ExternalLink[]> => apiFetch('/profile/me/external-links');

/**
 * Add a profile external link
 * @param {ExternalLink} payload - External link data
 * @returns {Promise<ExternalLink>} Created external link
 */
export const addProfileExternalLink = (payload: ExternalLink): Promise<ExternalLink> => apiFetch('/profile/me/external-links', {
    method: 'POST',
    body: JSON.stringify(payload)
});

/**
 * Update a profile external link
 * @param {string} linkId - Link ID
 * @param {ExternalLink} payload - Updated external link data
 * @returns {Promise<ExternalLink>} Updated external link
 */
export const updateProfileExternalLink = (linkId: string, payload: ExternalLink): Promise<ExternalLink> => apiFetch(`/profile/me/external-links/${linkId}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
});

/**
 * Delete a profile external link
 * @param {string} linkId - Link ID
 * @returns {Promise<void>} Success response
 */
export const deleteProfileExternalLink = (linkId: string): Promise<void> => apiFetch(`/profile/me/external-links/${linkId}`, {
    method: 'DELETE'
});

/**
 * Get profile billing information
 * @returns {Promise<any>} Billing information
 */
export const getProfileBilling = (): Promise<any> => apiFetch('/profile/me/billing');

/**
 * Update profile billing information
 * @param {any} payload - Updated billing information
 * @returns {Promise<any>} Updated billing information
 */
export const updateProfileBilling = (payload: any): Promise<any> => apiFetch('/profile/me/billing', {
    method: 'POST',
    body: JSON.stringify(payload)
});

/**
 * Get profile benefits
 * @returns {Promise<ProfileBenefit[]>} List of benefits
 */
export const getProfileBenefits = (): Promise<ProfileBenefit[]> => apiFetch('/profile/me/benefits');

/**
 * Add a profile benefit
 * @param {ProfileBenefit} payload - Benefit data
 * @returns {Promise<ProfileBenefit>} Created benefit
 */
export const addProfileBenefit = (payload: ProfileBenefit): Promise<ProfileBenefit> => apiFetch('/profile/me/benefits', {
    method: 'POST',
    body: JSON.stringify(payload)
});

/**
 * Update a profile benefit
 * @param {string} benefitId - Benefit ID
 * @param {ProfileBenefit} payload - Updated benefit data
 * @returns {Promise<ProfileBenefit>} Updated benefit
 */
export const updateProfileBenefit = (benefitId: string, payload: ProfileBenefit): Promise<ProfileBenefit> => apiFetch(`/profile/me/benefits/${benefitId}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
});

/**
 * Delete a profile benefit
 * @param {string} benefitId - Benefit ID
 * @returns {Promise<void>} Success response
 */
export const deleteProfileBenefit = (benefitId: string): Promise<void> => apiFetch(`/profile/me/benefits/${benefitId}`, {
    method: 'DELETE'
});

/**
 * Order profile benefits
 * @param {any} payload - Ordering data
 * @returns {Promise<void>} Success response
 */
export const orderProfileBenefits = (payload: any): Promise<void> => apiFetch('/profile/me/benefits/order', {
    method: 'PUT',
    body: JSON.stringify(payload)
});

/**
 * Get profile availability
 * @returns {Promise<ProfileAvailability>} Profile availability
 */
export const getProfileAvailability = (): Promise<ProfileAvailability> => apiFetch('/profile/me/availability');

/**
 * Update profile availability
 * @param {ProfileAvailability} payload - Updated availability data
 * @returns {Promise<ProfileAvailability>} Updated availability
 */
export const updateProfileAvailability = (payload: ProfileAvailability): Promise<ProfileAvailability> => apiFetch('/profile/me/availability', {
    method: 'PUT',
    body: JSON.stringify(payload)
});

/**
 * Get profile exercises
 * @returns {Promise<ProfileExercise[]>} List of profile exercises
 */
export const getProfileExercises = (): Promise<ProfileExercise[]> => apiFetch('/profile/me/exercises');

/**
 * Add a profile exercise
 * @param {ProfileExercise} payload - Exercise data
 * @returns {Promise<ProfileExercise>} Created exercise
 */
export const addProfileExercise = (payload: ProfileExercise): Promise<ProfileExercise> => apiFetch('/profile/me/exercises', {
    method: 'POST',
    body: JSON.stringify(payload)
});

/**
 * Update a profile exercise
 * @param {string} exerciseId - Exercise ID
 * @param {ProfileExercise} payload - Updated exercise data
 * @returns {Promise<ProfileExercise>} Updated exercise
 */
export const updateProfileExercise = (exerciseId: string, payload: ProfileExercise): Promise<ProfileExercise> => apiFetch(`/profile/me/exercises/${exerciseId}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
});

/**
 * Delete a profile exercise
 * @param {string} exerciseId - Exercise ID
 * @returns {Promise<void>} Success response
 */
export const deleteProfileExercise = (exerciseId: string): Promise<void> => apiFetch(`/profile/me/exercises/${exerciseId}`, {
    method: 'DELETE'
});

// == Booking Management ==
/**
 * Confirm a booking
 * @param {string} bookingId - Booking ID
 * @returns {Promise<Booking>} Updated booking
 */
export const confirmBooking = (bookingId: string): Promise<Booking> => apiFetch(`/bookings/${bookingId}/confirm`, {
    method: 'PUT'
});

/**
 * Decline a booking
 * @param {string} bookingId - Booking ID
 * @returns {Promise<Booking>} Updated booking
 */
export const declineBooking = (bookingId: string): Promise<Booking> => apiFetch(`/bookings/${bookingId}/decline`, {
    method: 'PUT'
});

// == Miscellaneous ==
/**
 * Find exercise media
 * @param {string} query - Search query
 * @returns {Promise<any>} Exercise media results
 */
export const findExerciseMedia = (query: string): Promise<any> => apiFetch(`/exercises/find-media?query=${encodeURIComponent(query)}`);

/**
 * Get OpenAPI specification
 * @returns {Promise<any>} OpenAPI specification
 */
export const getOpenAPISpec = (): Promise<any> => apiFetch('/openapi');

/**
 * Create a program template
 * @param {any} payload - Template data
 * @returns {Promise<any>} Created template
 */
export const createProgramTemplate = (payload: any): Promise<any> => apiFetch('/trainer/programs/templates', {
    method: 'POST',
    body: JSON.stringify(payload)
});

/**
 * Copy a program template
 * @param {string} templateId - Template ID
 * @returns {Promise<any>} Copied template
 */
export const copyProgramTemplate = (templateId: string): Promise<any> => apiFetch(`/trainer/programs/templates/${templateId}/copy`, {
    method: 'POST'
});

/**
 * Update template exercises
 * @param {string} templateId - Template ID
 * @returns {Promise<any>} Updated template
 */
export const updateTemplateExercises = (templateId: string, payload: any): Promise<any> => apiFetch(`/trainer/programs/templates/${templateId}/exercises`, {
    method: 'PUT',
    body: JSON.stringify(payload)
});

/**
 * Get template rest settings
 * @param {string} templateId - Template ID
 * @returns {Promise<any>} Template rest settings
 */
export const getTemplateRest = (templateId: string): Promise<any> => apiFetch(`/trainer/programs/templates/${templateId}/rest`);

/**
 * Send session reminder
 * @param {string} sessionId - Session ID
 * @returns {Promise<any>} Success response
 */
export const sendSessionReminder = (sessionId: string): Promise<any> => apiFetch(`/trainer/calendar/sessions/${sessionId}/remind`, {
    method: 'POST'
});