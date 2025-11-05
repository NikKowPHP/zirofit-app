import { apiFetch } from '../core/apiFetch';
import type { 
  GetPublicWorkoutSummaryRequest,
  FindExerciseMediaRequest,
  PublicTrainerProfile,
  PublicWorkoutSummary,
  Exercise
} from '../types';

/**
 * Public API endpoints (no authentication required)
 */

/**
 * Get public trainer profile by username
 * @param username Trainer username
 * @returns Public trainer profile
 */
export const getPublicTrainerProfile = (username: string): Promise<PublicTrainerProfile> => 
  apiFetch(`/trainers/${username}`);

/**
 * Get public trainer testimonials by username
 * @param username Trainer username
 * @returns List of testimonials
 */
export const getPublicTrainerTestimonials = (username: string) => 
  apiFetch(`/trainers/${username}/testimonials`);

/**
 * Get public trainer schedule by username
 * @param username Trainer username
 * @returns Trainer schedule
 */
export const getPublicTrainerSchedule = (username: string) => 
  apiFetch(`/trainers/${username}/schedule`);

/**
 * Get public trainer packages by username
 * @param username Trainer username
 * @returns List of packages
 */
export const getPublicTrainerPackages = (username: string) => 
  apiFetch(`/trainers/${username}/packages`);

/**
 * Get public workout summary
 * @param request Workout summary request
 * @returns Public workout summary
 */
export const getPublicWorkoutSummary = (request: GetPublicWorkoutSummaryRequest): Promise<PublicWorkoutSummary> => 
  apiFetch(`/public/workout-summary/${request.sessionId}`);

/**
 * Find exercise media
 * @param request Search request
 * @returns Exercise media results
 */
export const findExerciseMedia = (request: FindExerciseMediaRequest): Promise<Exercise[]> => 
  apiFetch('/exercises/find-media', {
    params: { query: request.query }
  });

/**
 * Get public exercises
 * @returns List of exercises
 */
export const getPublicExercises = (): Promise<Exercise[]> => 
  apiFetch('/exercises');

/**
 * Get public exercise details
 * @param exerciseId Exercise ID
 * @returns Exercise details
 */
export const getPublicExerciseDetails = (exerciseId: string): Promise<Exercise> => 
  apiFetch(`/exercises/${exerciseId}`);

/**
 * Search exercises
 * @param query Search query
 * @param filters Search filters
 * @returns Search results
 */
export const searchExercises = (query: string, filters?: Record<string, any>) => 
  apiFetch('/exercises/search', {
    params: { query, ...filters }
  });

/**
 * Get exercise categories
 * @returns List of exercise categories
 */
export const getExerciseCategories = () => 
  apiFetch('/exercises/categories');

/**
 * Get exercises by category
 * @param category Category name
 * @returns List of exercises in category
 */
export const getExercisesByCategory = (category: string) => 
  apiFetch(`/exercises/category/${category}`);

/**
 * Get exercise muscle groups
 * @returns List of muscle groups
 */
export const getExerciseMuscleGroups = () => 
  apiFetch('/exercises/muscle-groups');

/**
 * Get exercises by muscle group
 * @param muscleGroup Muscle group name
 * @returns List of exercises for muscle group
 */
export const getExercisesByMuscleGroup = (muscleGroup: string) => 
  apiFetch(`/exercises/muscle-group/${muscleGroup}`);

/**
 * Get exercise equipment
 * @returns List of equipment types
 */
export const getExerciseEquipment = () => 
  apiFetch('/exercises/equipment');

/**
 * Get exercises by equipment
 * @param equipment Equipment type
 * @returns List of exercises using equipment
 */
export const getExercisesByEquipment = (equipment: string) => 
  apiFetch(`/exercises/equipment/${equipment}`);

/**
 * Get popular exercises
 * @returns List of popular exercises
 */
export const getPopularExercises = () => 
  apiFetch('/exercises/popular');

/**
 * Get trending exercises
 * @returns List of trending exercises
 */
export const getTrendingExercises = () => 
  apiFetch('/exercises/trending');

/**
 * Get exercise recommendations
 * @param params Recommendation parameters
 * @returns Recommended exercises
 */
export const getExerciseRecommendations = (params?: { 
  muscle_group?: string; 
  equipment?: string; 
  difficulty?: string; 
  limit?: number 
}) => 
  apiFetch('/exercises/recommendations', {
    params
  });

/**
 * Get exercise variations
 * @param exerciseId Exercise ID
 * @returns List of exercise variations
 */
export const getExerciseVariations = (exerciseId: string) => 
  apiFetch(`/exercises/${exerciseId}/variations`);

/**
 * Get exercise instructions
 * @param exerciseId Exercise ID
 * @returns Exercise instructions
 */
export const getExerciseInstructions = (exerciseId: string) => 
  apiFetch(`/exercises/${exerciseId}/instructions`);

/**
 * Get exercise tips
 * @param exerciseId Exercise ID
 * @returns Exercise tips
 */
export const getExerciseTips = (exerciseId: string) => 
  apiFetch(`/exercises/${exerciseId}/tips`);

/**
 * Get exercise common mistakes
 * @param exerciseId Exercise ID
 * @returns Common mistakes
 */
export const getExerciseCommonMistakes = (exerciseId: string) => 
  apiFetch(`/exercises/${exerciseId}/common-mistakes`);

/**
 * Rate exercise
 * @param exerciseId Exercise ID
 * @param rating Rating (1-5)
 * @returns Rating result
 */
export const rateExercise = (exerciseId: string, rating: number) => 
  apiFetch(`/exercises/${exerciseId}/rate`, {
    method: 'POST',
    body: JSON.stringify({ rating })
  });

/**
 * Get exercise ratings
 * @param exerciseId Exercise ID
 * @returns Exercise ratings
 */
export const getExerciseRatings = (exerciseId: string) => 
  apiFetch(`/exercises/${exerciseId}/ratings`);

/**
 * Report exercise issue
 * @param exerciseId Exercise ID
 * @param request Issue report data
 * @returns Report result
 */
export const reportExerciseIssue = (exerciseId: string, request: { issue_type: string; description: string }) => 
  apiFetch(`/exercises/${exerciseId}/report`, {
    method: 'POST',
    body: JSON.stringify(request)
  });

/**
 * Get OpenAPI specification
 * @returns OpenAPI specification
 */
export const getOpenAPISpec = () => 
  apiFetch('/openapi');

/**
 * Get API health status
 * @returns Health status
 */
export const getHealthStatus = () => 
  apiFetch('/health');

/**
 * Get API version
 * @returns API version information
 */
export const getApiVersion = () => 
  apiFetch('/version');