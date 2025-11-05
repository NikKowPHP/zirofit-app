// Core API utilities
export { apiFetch } from '@/lib/api/core/apiFetch';
export { ApiFetchError } from '@/lib/api/core/ApiFetchError';
export type { ApiFetchOptions } from '@/lib/api/core/apiFetch';

// Authentication endpoints
export * from '@/lib/api/endpoints/auth';

// Workout management endpoints
export * from '@/lib/api/endpoints/workout';

// Client management endpoints
export * from '@/lib/api/endpoints/client';

// Trainer management endpoints
export {
  getTrainerProfile,
  getTrainerClients,
  getPrograms,
  createProgram,
  getProgramDetails,
  createTemplate,
  getTemplateDetails,
  addExerciseToTemplate,
  removeExerciseFromTemplate,
  getTrainerAssessments,
  getTrainerPackages,
  createTrainerService,
  
  createTrainerPackage,

  createTrainerTestimonial,


  copyProgramTemplate,
  getTemplateRest,
  updateTemplateExercises
} from '@/lib/api/endpoints/trainer';

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
  updateTrainerTestimonial,
  deleteTrainerTestimonial,
  getProfileServices,
  addTrainerService,
  updateTrainerService,
  deleteTrainerService,
  getProfilePackages,
  addTrainerPackage,
  updateTrainerPackage,
  deleteTrainerPackage,
  sendPushToken
} from '@/lib/api/endpoints/profile';

// Calendar management endpoints
export {
  // Calendar-specific exports (avoiding conflicts with trainer endpoints)
  getCalendarEvents,
  planSession,
  updateCalendarSession,
  deleteCalendarSession,
  sendSessionReminder,
  getUpcomingSessions,
  getSessionDetails,
  confirmBooking as confirmCalendarBooking,
  declineBooking as declineCalendarBooking,
  getAvailableTimeSlots as getCalendarAvailableTimeSlots,
  blockTimeSlot,
  unblockTimeSlot,
  getTrainerAvailability
} from '@/lib/api/endpoints/calendar';


// Notification & webhook endpoints
export * from '@/lib/api/endpoints/notification';

// Public endpoints
export * from '@/lib/api/endpoints/public';

// Booking & miscellaneous endpoints
export {
  getDashboard,
  createBooking,
  getBookingDetails,
  getUserBookings,
  confirmBooking as confirmMiscBooking,
  declineBooking as declineMiscBooking,
  cancelBooking,
  rescheduleBooking,
  getAvailableTimeSlots as getMiscAvailableTimeSlots,
  getBookingPackages,
  getPackageDetails,
  processPayment,
  getPaymentMethods,
  addPaymentMethod,
  removePaymentMethod,
  getPaymentHistory,
  getPaymentDetails,
  refundPayment,
  getRefundHistory,
  getRefundDetails,
  getSystemSettings,
  updateSystemSettings,
  getSystemStatus,
  getSystemLogs,
  getLogDetails,
  downloadLogFile,
  getAnalytics,
  getAnalyticsSummary,
  exportAnalytics,
  getSystemMetrics,
  getRealTimeMetrics,
  getMetricHistory,
  createCheckoutSession
} from '@/lib/api/endpoints/misc';

// Types
export * from '@/lib/api/types';

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
} from '@/lib/api/types';
