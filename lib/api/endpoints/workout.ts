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
export const getAvailableExercises = async (): Promise<Exercise[]> => {
  console.log('=== getAvailableExercises CALLED ===');
  const res = await apiFetch('/exercises');

  if (!res) {
    console.log('getAvailableExercises response: null (likely 404). Returning empty list.');
    return [];
  }

  const payload = res.data ?? res;
  const exercises = (Array.isArray(payload) ? payload : payload?.exercises) ?? [];

  console.log('Fetched available exercises data:', JSON.stringify(payload, null, 2));

  if (exercises.length === 0) {
      console.log('No exercises from API, using mock data for testing');
      const mockExercises: Exercise[] = [
        { id: '1', name: 'Bench Press', description: 'Chest exercise', muscle_group: 'chest', equipment: 'barbell' },
        { id: '2', name: 'Squats', description: 'Leg exercise', muscle_group: 'legs', equipment: 'barbell' },
        { id: '3', name: 'Deadlift', description: 'Back exercise', muscle_group: 'back', equipment: 'barbell' },
        { id: '4', name: 'Overhead Press', description: 'Shoulder exercise', muscle_group: 'shoulders', equipment: 'dumbbells' },
        { id: '5', name: 'Pull-ups', description: 'Back exercise', muscle_group: 'back', equipment: 'bodyweight' },
        { id: '6', name: 'Bicep Curls', description: 'Arm exercise', muscle_group: 'biceps', equipment: 'dumbbells' },
      ];
      console.log('Using mock exercises:', mockExercises.length);
      return mockExercises;
    } else {
      console.log('=== AVAILABLE EXERCISES FETCHED ===');
      console.log('Total available exercises:', exercises.length);
      exercises.forEach((exercise: any, index: number) => {
        console.log(`Exercise ${index + 1}:`, {
          id: exercise.id,
          name: exercise.name,
          muscleGroup: exercise.muscle_group || exercise.muscleGroup,
          equipment: exercise.equipment
        });
      });
      console.log('=== END AVAILABLE EXERCISES ===');
  }
  
  return exercises;
};

/**
 * Get workout templates
 * @returns List of workout templates
 */
export const getWorkoutTemplates = (): Promise<WorkoutTemplate[]> => 
  apiFetch('/trainer/programs/templates').then(res => {
    console.log('Fetched workout templates data:', JSON.stringify(res.data.templates.length, null, 2));
    return res.data.templates;
  });

/**
 * Get active client workout session
 * @param clientId Client ID
 * @returns Active workout session or null
 */
export const getActiveClientWorkoutSession = async (clientId: string): Promise<WorkoutSession | null> => {
  console.log('=== getActiveClientWorkoutSession API CALL ===');
  console.log('Client ID:', clientId);

  const res = await apiFetch(`/clients/${clientId}/session/active`);

  if (!res) {
    console.log('getActiveClientWorkoutSession response: null (likely 404). Returning null session.');
    return null;
  }

  const payload = res.data ?? res;
  const session = (payload.session ?? payload) as any | null; // Use `any` for easier manipulation

  if (!session) {
    console.log('getActiveClientWorkoutSession response payload missing session data.');
    return null;
  }

  // Normalize response to include exercises at the top level from the workout template
  if (session.workoutTemplate && Array.isArray(session.workoutTemplate.exercises)) {
    session.exercises = session.workoutTemplate.exercises
      .filter((item: any) => item.type === 'EXERCISE' && item.exercise)
      .map((item: any) => ({
        ...item.exercise,
        template_exercise_id: item.id,
        notes: item.notes,
        targetReps: item.targetReps,
        targetSets: item.targetSets,
      }));
  } else {
    // Ensure exercises is always an array, even if it's not in the response
    session.exercises = session.exercises || [];
  }

  console.log('getActiveClientWorkoutSession response:', JSON.stringify(session, null, 2));

  if (session.exercises) {
      console.log('=== ACTIVE EXERCISES FETCHED ===');
      console.log('Total exercises in session:', session.exercises.length);
      session.exercises.forEach((exercise: any, index: number) => {
        console.log(`Exercise ${index + 1}:`, {
          id: exercise.id,
          name: exercise.name,
          muscleGroup: exercise.muscle_group || exercise.muscleGroup
        });
      });
      console.log('=== END ACTIVE EXERCISES ===');
  } else {
    console.log('No active exercises found in session');
  }

  return session;
};

/**
 * Add exercise to live session
 * @param sessionId Session ID
 * @param request Exercise data
 * @returns Updated workout session
 */
export const addExerciseToLiveSession = async (sessionId: string, request: { exercise_id: string }): Promise<WorkoutSession> => {
  console.log('=== addExerciseToLiveSession API CALL ===');
  console.log('Session ID:', sessionId);
  console.log('Request:', request);
  console.log('Adding exercise ID:', request.exercise_id, 'to session');

  const res = await apiFetch(`/workout/session/${sessionId}/add-exercise`, {
    method: 'POST',
    body: JSON.stringify(request)
  });

  if (!res) {
    console.log('addExerciseToLiveSession response: null (likely 404). Throwing error.');
    throw new Error('Active session not found or could not add exercise.');
  }

  const payload = res.data ?? res;
  const updatedSession = (payload.session ?? payload) as WorkoutSession | null;

  if (!updatedSession) {
    console.log('addExerciseToLiveSession payload missing session data.');
    throw new Error('Failed to retrieve updated session.');
  }

  console.log('addExerciseToLiveSession response:', JSON.stringify(updatedSession, null, 2));

  if (updatedSession.exercises) {
    console.log('=== UPDATED SESSION EXERCISES ===');
    console.log('Total exercises after addition:', updatedSession.exercises.length);
    const addedExercise = updatedSession.exercises.find((ex: any) => ex.id === request.exercise_id);
    if (addedExercise) {
      console.log('Successfully added exercise:', {
        id: addedExercise.id,
        name: addedExercise.name,
        muscleGroup: addedExercise.muscle_group || addedExercise.muscleGroup
      });
    }
    console.log('=== END UPDATED SESSION EXERCISES ===');
  }

  return updatedSession;
};