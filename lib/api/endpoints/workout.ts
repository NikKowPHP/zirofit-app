import { apiFetch } from '../core/apiFetch';
import type { 
  LogSetRequest,
  StartWorkoutSessionRequest,
  FinishWorkoutSessionRequest,
  SaveWorkoutAsTemplateRequest,
  AddSessionCommentRequest,
  StartRestTimerRequest,
  EndRestTimerRequest,
  WorkoutSession,
  WorkoutSessionSummary,
  Exercise,
  WorkoutTemplate
} from '../types';

/**
 * Workout Management API endpoints
 */

/**
 * Get the currently active workout session
 * @returns Active workout session or null if none
 */
export const getActiveWorkoutSession = (): Promise<WorkoutSession | null> => 
  apiFetch('/workout-sessions/live');

/**
 * Start a new workout session
 * @param request Session start data (includes optional clientId for trainer-initiated)
 * @returns Created workout session
 */
export const startWorkoutSession = (request: StartWorkoutSessionRequest): Promise<WorkoutSession> => 
  apiFetch('/workout-sessions/start', {
    method: 'POST',
    body: JSON.stringify(request)
  });

/**
 * Log a set for an exercise in a workout session
 * @param request Set data to log
 * @returns Log result
 */
export const logSet = (request: LogSetRequest) => 
  apiFetch('/workout/log', {
    method: 'POST',
    body: JSON.stringify(request)
  });

/**
 * Finish the current workout session
 * @param request Session finish data
 * @returns Updated workout session
 */
export const finishWorkoutSession = (request: FinishWorkoutSessionRequest): Promise<WorkoutSession> => 
  apiFetch('/workout-sessions/finish', {
    method: 'POST',
    body: JSON.stringify(request)
  });

/**
 * Get workout session history
 * @returns List of workout sessions
 */
export const getWorkoutHistory = () => 
  apiFetch('/workout-sessions/history');

/**
 * Get details of a specific workout session
 * @param sessionId Session ID
 * @returns Workout session details
 */
export const getSessionDetails = (sessionId: string): Promise<WorkoutSession> => 
  apiFetch(`/workout-sessions/${sessionId}`);

/**
 * Get workout session summary
 * @param sessionId Session ID
 * @returns Session summary data
 */
export const getWorkoutSessionSummary = (sessionId: string): Promise<WorkoutSessionSummary> => 
  apiFetch(`/workout-sessions/${sessionId}/summary`);

/**
 * Save a workout session as a template
 * @param request Save template data
 * @returns Created workout template
 */
export const saveWorkoutAsTemplate = (request: SaveWorkoutAsTemplateRequest): Promise<WorkoutTemplate> => 
  apiFetch(`/workout-sessions/${request.sessionId}/save-as-template`, {
    method: 'POST'
  });

/**
 * Add a comment to a workout session
 * @param request Comment data
 * @returns Updated workout session
 */
export const addSessionComment = (request: AddSessionCommentRequest): Promise<WorkoutSession> => 
  apiFetch(`/workout-sessions/${request.sessionId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ comment: request.comment })
  });

/**
 * Start rest timer for a workout session
 * @param request Rest timer data
 * @returns Rest timer result
 */
export const startRestTimer = (request: StartRestTimerRequest) => 
  apiFetch(`/workout-sessions/${request.sessionId}/rest/start`, {
    method: 'POST'
  });

/**
 * End rest timer for a workout session
 * @param request Rest timer data
 * @returns Rest timer result
 */
export const endRestTimer = (request: EndRestTimerRequest) => 
  apiFetch(`/workout-sessions/${request.sessionId}/rest/end`, {
    method: 'POST'
  });

/**
 * Get available exercises
 * @returns List of exercises
 */
export const getAvailableExercises = (): Promise<Exercise[]> => 
  apiFetch('/exercises');

/**
 * Get workout templates
 * @returns List of workout templates
 */
export const getWorkoutTemplates = (): Promise<WorkoutTemplate[]> => 
  apiFetch('/trainer/programs/templates').then(res => {
    console.log('Fetched workout templates data:', JSON.stringify(res.data.templates, null, 2));
    return res.data.templates;
  });

/**
 * Get active client workout session
 * @param clientId Client ID
 * @returns Active workout session or null
 */
export const getActiveClientWorkoutSession = (clientId: string): Promise<WorkoutSession | null> => 
  apiFetch(`/clients/${clientId}/session/active`);

/**
 * Add exercise to live session
 * @param sessionId Session ID
 * @param request Exercise data
 * @returns Updated workout session
 */
export const addExerciseToLiveSession = (sessionId: string, request: { exercise_id: string }): Promise<WorkoutSession> => 
  apiFetch(`/workout-sessions/${sessionId}/add-exercise`, {
    method: 'POST',
    body: JSON.stringify(request)
  });