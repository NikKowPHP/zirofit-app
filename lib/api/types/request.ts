// Auth Request Types
export interface AuthRequest {
  email: string;
  password: string;
  name?: string;
}

export interface LoginRequest extends AuthRequest {}
export interface RegisterRequest extends AuthRequest {}

// Workout Request Types
export interface LogSetRequest {
  reps: number;
  weight: number;
  exercise_id: string;
  workout_session_id: string;
}

export interface StartWorkoutSessionRequest {
  templateId: string;
  clientId?: string; // Optional for trainer-initiated sessions
}

export interface FinishWorkoutSessionRequest {
  sessionId: string;
}

export interface SaveWorkoutAsTemplateRequest {
  sessionId: string;
}

export interface AddSessionCommentRequest {
  sessionId: string;
  comment: string;
}

export interface StartRestTimerRequest {
  sessionId: string;
}

export interface EndRestTimerRequest {
  sessionId: string;
}

// Client Request Types
export interface CreateClientRequest {
  email: string;
  name: string;
  phone: string;
}

export interface RequestClientLinkRequest {}

export interface LogClientExerciseRequest {
  client_id: string;
  exercise_id: string;
  workout_session_id: string;
  sets: Array<{
    reps: number;
    weight: number;
    rest_time?: number;
  }>;
  notes?: string;
}

// Trainer Request Types
export interface CreateProgramRequest {
  name: string;
  description?: string;
}

export interface CreateTemplateRequest {
  programId: string;
  name: string;
  description?: string;
}

export interface AddExerciseToTemplateRequest {
  templateId: string;
  exercise_id: string;
}

export interface PlanSessionRequest {
  date: string;
  notes: string;
  clientId: string;
  templateId?: string;
}

export interface UpdateCalendarSessionRequest {
  sessionId: string;
  date: string;
  notes: string;
}

export interface DeleteCalendarSessionRequest {
  sessionId: string;
}

// Profile Request Types
export interface UpdateTrainerCoreInfoRequest {
  name: string;
  username: string;
  certifications: string[];
  phone: string;
  bio?: string;
  specialties?: string[];
  experience_years?: number;
}

export interface AddTrainerServiceRequest {
  name: string;
  description?: string;
  price: number;
  duration: number;
}

export interface UpdateTrainerServiceRequest {
  serviceId: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
}

export interface AddTrainerPackageRequest {
  name: string;
  description?: string;
  price: number;
  sessions_count: number;
  duration_weeks: number;
}

export interface UpdateTrainerPackageRequest {
  packageId: string;
  name: string;
  description?: string;
  price: number;
  sessions_count: number;
  duration_weeks: number;
}

export interface AddTrainerTestimonialRequest {
  client_name: string;
  content: string;
}

export interface UpdateTrainerTestimonialRequest {
  testimonialId: string;
  client_name: string;
  content: string;
}

export interface UploadTransformationPhotoRequest {
  formData: FormData;
}

export interface UpdateProfileTextContentRequest {
  welcome_message?: string;
  about_me?: string;
  philosophy?: string;
  success_stories?: string;
}

export interface AddSocialLinkRequest {
  platform: string;
  url: string;
  display_name?: string;
}

export interface UpdateSocialLinkRequest {
  linkId: string;
  platform: string;
  url: string;
  display_name?: string;
}

export interface AddExternalLinkRequest {
  title: string;
  url: string;
  description?: string;
}

export interface UpdateExternalLinkRequest {
  linkId: string;
  title: string;
  url: string;
  description?: string;
}

export interface AddProfileBenefitRequest {
  title: string;
  description?: string;
}

export interface UpdateProfileBenefitRequest {
  benefitId: string;
  title: string;
  description?: string;
}

export interface OrderProfileBenefitsRequest {
  order: string[];
}

export interface UpdateProfileAvailabilityRequest {
  availability: ProfileAvailabilityRequest[];
}

export interface ProfileAvailabilityRequest {
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

export interface AddProfileExerciseRequest {
  name: string;
  description?: string;
  muscle_group: string;
  equipment?: string;
  instructions?: string;
  media_url?: string;
}

export interface UpdateProfileExerciseRequest {
  exerciseId: string;
  name: string;
  description?: string;
  muscle_group: string;
  equipment?: string;
  instructions?: string;
  media_url?: string;
}

// Booking Request Types
export interface ConfirmBookingRequest {
  bookingId: string;
}

export interface DeclineBookingRequest {
  bookingId: string;
}

// Notification Request Types
export interface UpdateNotificationRequest {
  notificationId: string;
  is_read: boolean;
}

// Webhook Request Types
export interface HandleStripeWebhookRequest {
  payload: any;
}

// Public Request Types
export interface GetPublicWorkoutSummaryRequest {
  sessionId: string;
}

export interface FindExerciseMediaRequest {
  query: string;
}

// Template Request Types
export interface CreateProgramTemplateRequest {
  name: string;
  description?: string;
}

export interface CopyProgramTemplateRequest {
  templateId: string;
}

export interface UpdateTemplateExercisesRequest {
  templateId: string;
  exercises: any[];
}

export interface GetTemplateRestRequest {
  templateId: string;
}

// Calendar Request Types
export interface SendSessionReminderRequest {
  sessionId: string;
}

// Common Request Types
export interface PaginationParams {
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface SearchParams {
  query: string;
  filters?: Record<string, any>;
}

export interface DateRange {
  start_date: string;
  end_date: string;
}