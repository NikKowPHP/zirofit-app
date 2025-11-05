import { apiFetch } from '../core/apiFetch';
import type { 
  CreateProgramRequest,
  CreateTemplateRequest,
  AddExerciseToTemplateRequest,
  PlanSessionRequest,
  UpdateCalendarSessionRequest,
  DeleteCalendarSessionRequest,
  TrainerProfile,
  TrainerService,
  TrainerPackage,
  TrainerTestimonial,
  TrainerProgram,
  WorkoutTemplate,
  Exercise
} from '../types';

/**
 * Trainer Management API endpoints
 */

/**
 * Get trainer profile
 * @returns Trainer profile information
 */
export const getTrainerProfile = (): Promise<TrainerProfile> => 
  apiFetch('/trainer/profile');

/**
 * Get trainer clients
 * @returns List of trainer's clients
 */
export const getTrainerClients = (): Promise<any[]> => 
  apiFetch('/trainer/clients');

/**
 * Get trainer programs
 * @returns List of trainer's programs
 */
export const getPrograms = (): Promise<TrainerProgram[]> => 
  apiFetch('/trainer/programs');

/**
 * Create a new program
 * @param request Program creation data
 * @returns Created program
 */
export const createProgram = (request: CreateProgramRequest): Promise<TrainerProgram> => 
  apiFetch('/trainer/programs', {
    method: 'POST',
    body: JSON.stringify(request)
  });

/**
 * Get program details
 * @param programId Program ID
 * @returns Program details
 */
export const getProgramDetails = (programId: string): Promise<TrainerProgram> => 
  apiFetch(`/trainer/programs/${programId}`);

/**
 * Create a template within a program
 * @param request Template creation data
 * @returns Created template
 */
export const createTemplate = (request: CreateTemplateRequest): Promise<WorkoutTemplate> => 
  apiFetch(`/trainer/programs/${request.programId}/templates`, {
    method: 'POST',
    body: JSON.stringify({ name: request.name, description: request.description })
  });

/**
 * Get template details
 * @param templateId Template ID
 * @returns Template details
 */
export const getTemplateDetails = (templateId: string): Promise<WorkoutTemplate> => 
  apiFetch(`/trainer/templates/${templateId}`);

/**
 * Add exercise to template
 * @param request Exercise addition data
 * @returns Updated template
 */
export const addExerciseToTemplate = (request: AddExerciseToTemplateRequest): Promise<WorkoutTemplate> => 
  apiFetch(`/trainer/templates/${request.templateId}/exercises`, {
    method: 'POST',
    body: JSON.stringify({ exercise_id: request.exercise_id })
  });

/**
 * Remove exercise from template
 * @param templateId Template ID
 * @param exerciseId Exercise ID
 * @returns Updated template
 */
export const removeExerciseFromTemplate = (templateId: string, exerciseId: string): Promise<WorkoutTemplate> => 
  apiFetch(`/trainer/templates/${templateId}/exercises/${exerciseId}`, {
    method: 'DELETE'
  });

/**
 * Get trainer calendar events
 * @param params Calendar parameters
 * @returns List of calendar events
 */
export const getCalendarEvents = (params?: { startDate?: string; endDate?: string }) => 
  apiFetch('/trainer/calendar', {
    params
  });

/**
 * Plan a new session
 * @param request Session planning data
 * @returns Created calendar event
 */
export const planSession = (request: PlanSessionRequest): Promise<any> => 
  apiFetch('/trainer/calendar', {
    method: 'POST',
    body: JSON.stringify(request)
  });

/**
 * Update calendar session
 * @param sessionId Session ID
 * @param request Update data
 * @returns Updated calendar event
 */
export const updateCalendarSession = (sessionId: string, request: UpdateCalendarSessionRequest): Promise<any> => 
  apiFetch(`/trainer/calendar/${sessionId}`, {
    method: 'PUT',
    body: JSON.stringify(request)
  });

/**
 * Delete calendar session
 * @param sessionId Session ID
 * @returns Deletion result
 */
export const deleteCalendarSession = (sessionId: string): Promise<void> => 
  apiFetch(`/trainer/calendar/${sessionId}`, {
    method: 'DELETE'
  });

/**
 * Send session reminder
 * @param sessionId Session ID
 * @returns Reminder result
 */
export const sendSessionReminder = (sessionId: string) => 
  apiFetch(`/trainer/calendar/sessions/${sessionId}/remind`, {
    method: 'POST'
  });

/**
 * Get trainer assessments
 * @returns List of trainer's assessments
 */
export const getTrainerAssessments = (): Promise<any[]> => 
  apiFetch('/trainer/assessments');

/**
 * Get trainer packages
 * @param trainerId Trainer ID
 * @returns List of trainer's packages
 */
export const getTrainerPackages = (trainerId: string): Promise<TrainerPackage[]> => 
  apiFetch(`/trainers/${trainerId}/packages`);

/**
 * Create trainer service
 * @param request Service creation data
 * @returns Created service
 */
export const createTrainerService = (request: any): Promise<TrainerService> => 
  apiFetch('/trainer/services', {
    method: 'POST',
    body: JSON.stringify(request)
  });

/**
 * Update trainer service
 * @param serviceId Service ID
 * @param request Update data
 * @returns Updated service
 */
export const updateTrainerService = (serviceId: string, request: any): Promise<TrainerService> => 
  apiFetch(`/trainer/services/${serviceId}`, {
    method: 'PUT',
    body: JSON.stringify(request)
  });

/**
 * Delete trainer service
 * @param serviceId Service ID
 * @returns Deletion result
 */
export const deleteTrainerService = (serviceId: string): Promise<void> => 
  apiFetch(`/trainer/services/${serviceId}`, {
    method: 'DELETE'
  });

/**
 * Create trainer package
 * @param request Package creation data
 * @returns Created package
 */
export const createTrainerPackage = (request: any): Promise<TrainerPackage> => 
  apiFetch('/trainer/packages', {
    method: 'POST',
    body: JSON.stringify(request)
  });

/**
 * Update trainer package
 * @param packageId Package ID
 * @param request Update data
 * @returns Updated package
 */
export const updateTrainerPackage = (packageId: string, request: any): Promise<TrainerPackage> => 
  apiFetch(`/trainer/packages/${packageId}`, {
    method: 'PUT',
    body: JSON.stringify(request)
  });

/**
 * Delete trainer package
 * @param packageId Package ID
 * @returns Deletion result
 */
export const deleteTrainerPackage = (packageId: string): Promise<void> => 
  apiFetch(`/trainer/packages/${packageId}`, {
    method: 'DELETE'
  });

/**
 * Create trainer testimonial
 * @param request Testimonial creation data
 * @returns Created testimonial
 */
export const createTrainerTestimonial = (request: any): Promise<TrainerTestimonial> => 
  apiFetch('/trainer/testimonials', {
    method: 'POST',
    body: JSON.stringify(request)
  });

/**
 * Update trainer testimonial
 * @param testimonialId Testimonial ID
 * @param request Update data
 * @returns Updated testimonial
 */
export const updateTrainerTestimonial = (testimonialId: string, request: any): Promise<TrainerTestimonial> => 
  apiFetch(`/trainer/testimonials/${testimonialId}`, {
    method: 'PUT',
    body: JSON.stringify(request)
  });

/**
 * Delete trainer testimonial
 * @param testimonialId Testimonial ID
 * @returns Deletion result
 */
export const deleteTrainerTestimonial = (testimonialId: string): Promise<void> =>
  apiFetch(`/trainer/testimonials/${testimonialId}`, {
    method: 'DELETE'
  });

/**
 * Copy program template
 * @param templateId Template ID
 * @returns Copied template
 */
export const copyProgramTemplate = (templateId: string): Promise<WorkoutTemplate> => 
  apiFetch(`/trainer/programs/templates/${templateId}/copy`, {
    method: 'POST'
  });

/**
 * Get template rest information
 * @param templateId Template ID
 * @returns Template rest information
 */
export const getTemplateRest = (templateId: string): Promise<any> => 
  apiFetch(`/trainer/programs/templates/${templateId}/rest`);

/**
 * Update template exercises
 * @param templateId Template ID
 * @param request Update data
 * @returns Updated template
 */
export const updateTemplateExercises = (templateId: string, request: any): Promise<WorkoutTemplate> => 
  apiFetch(`/trainer/programs/templates/${templateId}/exercises`, {
    method: 'PUT',
    body: JSON.stringify(request)
  });