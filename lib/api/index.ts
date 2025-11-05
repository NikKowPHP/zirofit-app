// Core API utilities
export { apiFetch } from './core/apiFetch';
export { ApiFetchError } from './core/ApiFetchError';
export type { ApiFetchOptions } from './core/apiFetch';

// Authentication endpoints
export * from './endpoints/auth';

// Workout management endpoints
export * from './endpoints/workout';

// Client management endpoints
export * from './endpoints/client';

// Trainer management endpoints
export * from './endpoints/trainer';

// Profile management endpoints
export {
  // Profile-specific exports (avoiding conflicts with trainer endpoints)
  getProfile,
  getProfileCoreInfo,
  updateProfileCoreInfo,
  getProfileTextContent,
  updateProfileTextContent,
  getProfileSocialLinks,
  addSocialLink,
  updateSocialLink,
  deleteSocialLink,
  getProfileExternalLinks,
  addExternalLink,
  updateExternalLink,
  deleteExternalLink,
  getProfileBenefits,
  addProfileBenefit,
  updateProfileBenefit,
  deleteProfileBenefit,
  orderProfileBenefits,
  getProfileAvailability,
  updateProfileAvailability,
  getProfileExercises,
  addProfileExercise,
  updateProfileExercise,
  deleteProfileExercise,
  getTransformationPhotos,
  uploadTransformationPhoto,
  deleteTransformationPhoto,
  getProfileTestimonials,
  addTrainerTestimonial,
  getProfileServices,
  addTrainerService,
  getProfilePackages,
  addTrainerPackage,
  sendPushToken
} from './endpoints/profile';

// Calendar management endpoints
export {
  // Calendar-specific exports (avoiding conflicts with trainer endpoints)
  getCalendarEvents as getTrainerCalendarEvents,
  planSession as planTrainerSession,
  updateCalendarSession as updateTrainerCalendarSession,
  deleteCalendarSession as deleteTrainerCalendarSession,
  sendSessionReminder as sendTrainerSessionReminder
} from './endpoints/calendar';

// Notification & webhook endpoints
export * from './endpoints/notification';

// Public endpoints
export * from './endpoints/public';

// Booking & miscellaneous endpoints
export {
  // Misc-specific exports (avoiding conflicts with client endpoints)
  getClientDashboard as getClientDashboardData,
  confirmBooking,
  declineBooking,
  getAvailableTimeSlots
} from './endpoints/misc';

// Types
export * from './types';

// Re-export common types for convenience
export type {
  // Auth Types
  AuthRequest,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  
  // Workout Types
  WorkoutSession,
  WorkoutSessionSummary,
  Exercise,
  WorkoutTemplate,
  LogSetRequest,
  StartWorkoutSessionRequest,
  FinishWorkoutSessionRequest,
  SaveWorkoutAsTemplateRequest,
  AddSessionCommentRequest,
  StartRestTimerRequest,
  EndRestTimerRequest,
  
  // Client Types
  Client,
  ClientAssessment,
  ClientMeasurement,
  ClientPhoto,
  ClientExerciseLog,
  CreateClientRequest,
  RequestClientLinkRequest,
  LogClientExerciseRequest,
  ProgressData,
  
  // Trainer Types
  TrainerProfile,
  TrainerService,
  TrainerPackage,
  TrainerTestimonial,
  TrainerProgram,
  CreateProgramRequest,
  CreateTemplateRequest,
  AddExerciseToTemplateRequest,
  PlanSessionRequest,
  
  // Profile Types
  ProfileCoreInfo,
  ProfileTextContent,
  SocialLink,
  ExternalLink,
  ProfileBenefit,
  ProfileExercise,
  ProfileAvailability,
  UpdateTrainerCoreInfoRequest,
  AddTrainerServiceRequest,
  UpdateTrainerServiceRequest,
  AddTrainerPackageRequest,
  UpdateTrainerPackageRequest,
  AddTrainerTestimonialRequest,
  UpdateTrainerTestimonialRequest,
  UpdateProfileTextContentRequest,
  AddSocialLinkRequest,
  UpdateSocialLinkRequest,
  AddExternalLinkRequest,
  UpdateExternalLinkRequest,
  AddProfileBenefitRequest,
  UpdateProfileBenefitRequest,
  OrderProfileBenefitsRequest,
  UpdateProfileAvailabilityRequest,
  AddProfileExerciseRequest,
  UpdateProfileExerciseRequest,
  
  // Calendar Types
  CalendarEvent,
  UpdateCalendarSessionRequest,
  DeleteCalendarSessionRequest,
  SendSessionReminderRequest,
  
  // Notification Types
  Notification,
  UpdateNotificationRequest,
  HandleStripeWebhookRequest,
  
  // Public Types
  PublicTrainerProfile,
  PublicWorkoutSummary,
  GetPublicWorkoutSummaryRequest,
  FindExerciseMediaRequest,
  
  // Booking Types
  Booking,
  ConfirmBookingRequest,
  DeclineBookingRequest,
  
  // Misc Types
  DashboardData,
  
  // Common Types
  ApiResponse,
  PaginatedResponse,
  ApiError,
  PaginationParams,
  SearchParams,
  DateRange
} from './types';