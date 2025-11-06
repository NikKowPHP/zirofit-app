// Auth Response Types
export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name?: string;
  };
  token: string;
}

// Workout Response Types
export interface WorkoutSession {
  id: string;
  user_id: string;
  template_id?: string;
  status: 'active' | 'completed' | 'cancelled';
  started_at: string;
  finished_at?: string;
  notes?: string;
  name?: string;
  exercises?: any[];
  logs?: any[];
}

export interface WorkoutSessionSummary {
  id: string;
  total_exercises: number;
  completed_exercises: number;
  total_sets: number;
  total_weight: number;
  duration: number;
  calories_burned?: number;
}

export interface Exercise {
  id: string;
  name: string;
  description?: string;
  muscle_group: string;
  equipment?: string;
  instructions?: string;
  media_url?: string;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  description?: string;
  exercises: Exercise[];
  created_at: string;
  updated_at: string;
}

// Client Response Types
export interface Client {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  status: string;
  date_of_birth?: string;
  fitness_goals?: string;
  medical_conditions?: string;
  created_at: string;
  updated_at: string;
  workouts?: any[];
  measurements?: any[];
  photos?: any[];
}

export interface ClientAssessment {
  id: string;
  client_id: string;
  assessment_date: string;
  weight?: number;
  height?: number;
  body_fat_percentage?: number;
  measurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
    thighs?: number;
    arms?: number;
  };
  photos?: string[];
  notes?: string;
  created_at: string;
}

export interface ClientMeasurement {
  id: string;
  client_id: string;
  measurement_type: string;
  value: number;
  unit: string;
  measured_at: string;
  notes?: string;
}

export interface ClientPhoto {
  id: string;
  client_id: string;
  photo_url: string;
  caption?: string;
  taken_at: string;
}

export interface ClientExerciseLog {
  id: string;
  client_id: string;
  exercise_id: string;
  workout_session_id: string;
  sets: Array<{
    reps: number;
    weight: number;
    rest_time?: number;
  }>;
  notes?: string;
  completed_at: string;
}

// Trainer Response Types
export interface TrainerProfile {
  id: string;
  user_id: string;
  name: string;
  username: string;
  certifications: string[];
  bio?: string;
  specialties: string[];
  experience_years: number;
  phone?: string;
  email?: string;
  website?: string;
  social_links?: {
    instagram?: string;
    tiktok?: string;
    youtube?: string;
    twitter?: string;
  };
  created_at: string;
  updated_at: string;
  services?: TrainerService[];
  packages?: TrainerPackage[];
  testimonials?: TrainerTestimonial[];
  transformations?: { id: string; photo_url: string; }[];
  avatar_url?: string;
}

export interface TrainerService {
  id: string;
  trainer_id: string;
  name: string;
  description?: string;
  price: number;
  duration: number; // in minutes
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TrainerPackage {
  id: string;
  trainer_id: string;
  name: string;
  description?: string;
  price: number;
  sessions_count: number;
  duration_weeks: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TrainerTestimonial {
  id: string;
  trainer_id: string;
  client_name: string;
  content: string;
  rating: number;
  is_active: boolean;
  created_at: string;
}

export interface TrainerProgram {
  id: string;
  trainer_id: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  templates?: WorkoutTemplate[];
}

// Profile Response Types
export interface ProfileCoreInfo {
  name: string;
  username: string;
  certifications: string[];
  phone: string;
  bio?: string;
  specialties?: string[];
  experience_years?: number;
}

export interface ProfileTextContent {
  welcome_message?: string;
  about_me?: string;
  philosophy?: string;
  success_stories?: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  display_name?: string;
  is_active: boolean;
  created_at: string;
}

export interface ExternalLink {
  id: string;
  title: string;
  url: string;
  description?: string;
  is_active: boolean;
  created_at: string;
}

export interface ProfileBenefit {
  id: string;
  title: string;
  description?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface ProfileExercise {
  id: string;
  name: string;
  description?: string;
  muscle_group: string;
  equipment?: string;
  instructions?: string;
  media_url?: string;
  is_active: boolean;
  created_at: string;
}

export interface ProfileAvailability {
  id: string;
  day_of_week: number; // 0-6 (Sunday-Saturday)
  start_time: string;
  end_time: string;
  is_available: boolean;
  created_at: string;
}

// Calendar Response Types
export interface CalendarEvent {
  id: string;
  trainer_id: string;
  client_id?: string;
  title: string;
  start_time: string;
  end_time: string;
  notes?: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  session_type: 'workout' | 'assessment' | 'consultation';
  template_id?: string;
  created_at: string;
  updated_at: string;
  name?: string;
  exercises?: any[];
  logs?: any[];
}

// Notification Response Types
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  is_read: boolean;
  created_at: string;
  data?: any;
}

// Dashboard Response Types
export interface DashboardChartData {
  label: string;
  value: number;
}

export interface ActivityFeedItem {
  id: string;
  description: string;
  timestamp: string;
}

export interface DashboardData {
  activityFeed: Array<{
    clientName: string;
    date: string;
    type: string;
  }>;
  businessPerformance: {
    currentMonth: {
      completedSessions: number;
      newClients: number;
      revenue: number;
    };
    previousMonth: {
      completedSessions: number;
      newClients: number;
      revenue: number;
    };
  };
  clientEngagement: {
    active: any[];
    atRisk: any[];
    slipping: any[];
  };
  clients: Array<{
    id: string;
    email: string;
    name: string;
    phone?: string;
    status: string;
    userId?: string;
  }>;
  profileChecklist: {
    packagesCount: number;
    profile: any;
    programsCount: number;
  };
  programsAndTemplates: {
    systemPrograms: any[];
    systemTemplates: any[];
    userPrograms: any[];
    userTemplates: any[];
  };
  servicePopularity: {
    popularPackages: any[];
    popularTemplates: any[];
  };
  upcomingSessions: Array<{
    id: string;
    clientName: string;
    time: string;
  }>;
}

// Progress Response Types
export interface ProgressData {
  client_id: string;
  period: 'week' | 'month' | 'quarter' | 'year';
  metrics: {
    weight_change?: number;
    body_fat_change?: number;
    measurements_change?: Record<string, number>;
    workout_frequency: number;
    consistency_score: number;
  };
  achievements: string[];
  goals: {
    current_weight?: number;
    target_weight?: number;
    target_date?: string;
  };
}

// Booking Response Types
export interface Booking {
  id: string;
  client_id: string;
  trainer_id: string;
  session_date: string;
  session_time: string;
  status: 'pending' | 'confirmed' | 'declined' | 'completed';
  package_id?: string;
  notes?: string;
  created_at: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Error Types
export interface ApiError {
  message: string;
  code?: string;
  details?: any;
  status: number;
}

// Common Response Types
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

// Public Response Types
export interface PublicTrainerProfile {
  id: string;
  name: string;
  username: string;
  bio?: string;
  specialties: string[];
  certifications: string[];
  experience_years: number;
  social_links?: {
    instagram?: string;
    tiktok?: string;
    youtube?: string;
    twitter?: string;
  };
  testimonials: TrainerTestimonial[];
  packages: TrainerPackage[];
  schedule?: CalendarEvent[];
}

export interface PublicWorkoutSummary {
  id: string;
  name: string;
  description?: string;
  exercises: Exercise[];
  duration?: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}