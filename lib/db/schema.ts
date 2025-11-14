import { appSchema, tableSchema } from '@nozbe/watermelondb'

export const mySchema = appSchema({
  version: 1,
  tables: [
    // Clients table
    tableSchema({
      name: 'clients',
      columns: [
        { name: 'user_id', type: 'string', isOptional: true },
        { name: 'name', type: 'string' },
        { name: 'email', type: 'string' },
        { name: 'phone', type: 'string', isOptional: true },
        { name: 'date_of_birth', type: 'string', isOptional: true },
        { name: 'fitness_goals', type: 'string', isOptional: true },
        { name: 'medical_conditions', type: 'string', isOptional: true },
        { name: 'avatar_url', type: 'string', isOptional: true },
        { name: 'goals', type: 'string', isOptional: true },
        { name: 'health_notes', type: 'string', isOptional: true },
        { name: 'emergency_contact_name', type: 'string', isOptional: true },
        { name: 'emergency_contact_phone', type: 'string', isOptional: true },
        { name: 'status', type: 'string', isOptional: true },
        { name: 'trainer_id', type: 'string', isOptional: true },
        { name: '_status', type: 'string', isOptional: true }, // sync status
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
        { name: 'deleted_at', type: 'number', isOptional: true },
      ],
    }),
    // Trainer Profiles table
    tableSchema({
      name: 'trainer_profiles',
      columns: [
        { name: 'user_id', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'username', type: 'string' },
        { name: 'certifications', type: 'string' }, // JSON string
        { name: 'bio', type: 'string', isOptional: true },
        { name: 'specialties', type: 'string' }, // JSON string
        { name: 'experience_years', type: 'number' },
        { name: 'phone', type: 'string', isOptional: true },
        { name: 'email', type: 'string', isOptional: true },
        { name: 'website', type: 'string', isOptional: true },
        { name: 'avatar_url', type: 'string', isOptional: true },
        { name: 'social_links', type: 'string', isOptional: true }, // JSON string
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
        { name: 'deleted_at', type: 'number', isOptional: true },
      ],
    }),
    // Workout Sessions table
    tableSchema({
      name: 'workout_sessions',
      columns: [
        { name: 'user_id', type: 'string' },
        { name: 'template_id', type: 'string', isOptional: true },
        { name: 'status', type: 'string' },
        { name: 'started_at', type: 'number' },
        { name: 'finished_at', type: 'number', isOptional: true },
        { name: 'notes', type: 'string', isOptional: true },
        { name: 'name', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
        { name: 'deleted_at', type: 'number', isOptional: true },
      ],
    }),
    // Exercises table
    tableSchema({
      name: 'exercises',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'description', type: 'string', isOptional: true },
        { name: 'muscle_group', type: 'string' },
        { name: 'equipment', type: 'string', isOptional: true },
        { name: 'instructions', type: 'string', isOptional: true },
        { name: 'media_url', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
        { name: 'deleted_at', type: 'number', isOptional: true },
      ],
    }),
    // Template Exercises table (many-to-many relationship)
    tableSchema({
      name: 'template_exercises',
      columns: [
        { name: 'template_id', type: 'string' },
        { name: 'exercise_id', type: 'string' },
        { name: 'notes', type: 'string', isOptional: true },
        { name: 'order', type: 'number', isOptional: true },
        { name: 'sets', type: 'string', isOptional: true }, // JSON string for sets data
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
        { name: 'deleted_at', type: 'number', isOptional: true },
      ],
    }),
    // Client Assessments table
    tableSchema({
      name: 'client_assessments',
      columns: [
        { name: 'client_id', type: 'string' },
        { name: 'assessment_date', type: 'number' },
        { name: 'weight', type: 'number', isOptional: true },
        { name: 'height', type: 'number', isOptional: true },
        { name: 'body_fat_percentage', type: 'number', isOptional: true },
        { name: 'measurements', type: 'string', isOptional: true }, // JSON string
        { name: 'photos', type: 'string', isOptional: true }, // JSON string
        { name: 'notes', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
        { name: 'deleted_at', type: 'number', isOptional: true },
      ],
    }),
    // Client Measurements table
    tableSchema({
      name: 'client_measurements',
      columns: [
        { name: 'client_id', type: 'string' },
        { name: 'measurement_type', type: 'string' },
        { name: 'value', type: 'number' },
        { name: 'unit', type: 'string' },
        { name: 'measured_at', type: 'number' },
        { name: 'notes', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
        { name: 'deleted_at', type: 'number', isOptional: true },
      ],
    }),
    // Client Photos table
    tableSchema({
      name: 'client_photos',
      columns: [
        { name: 'client_id', type: 'string' },
        { name: 'photo_url', type: 'string' },
        { name: 'caption', type: 'string', isOptional: true },
        { name: 'taken_at', type: 'number' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
        { name: 'deleted_at', type: 'number', isOptional: true },
      ],
    }),
    // Client Exercise Logs table
    tableSchema({
      name: 'client_exercise_logs',
      columns: [
        { name: 'client_id', type: 'string' },
        { name: 'exercise_id', type: 'string' },
        { name: 'workout_session_id', type: 'string' },
        { name: 'sets', type: 'string' }, // JSON string
        { name: 'notes', type: 'string', isOptional: true },
        { name: 'completed_at', type: 'number' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
        { name: 'deleted_at', type: 'number', isOptional: true },
      ],
    }),
    // Trainer Services table
    tableSchema({
      name: 'trainer_services',
      columns: [
        { name: 'trainer_id', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'description', type: 'string', isOptional: true },
        { name: 'price', type: 'number' },
        { name: 'duration', type: 'number' },
        { name: 'is_active', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
        { name: 'deleted_at', type: 'number', isOptional: true },
      ],
    }),
    // Trainer Packages table
    tableSchema({
      name: 'trainer_packages',
      columns: [
        { name: 'trainer_id', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'description', type: 'string', isOptional: true },
        { name: 'price', type: 'number' },
        { name: 'sessions_count', type: 'number' },
        { name: 'duration_weeks', type: 'number' },
        { name: 'is_active', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
        { name: 'deleted_at', type: 'number', isOptional: true },
      ],
    }),
    // Trainer Testimonials table
    tableSchema({
      name: 'trainer_testimonials',
      columns: [
        { name: 'trainer_id', type: 'string' },
        { name: 'client_name', type: 'string' },
        { name: 'content', type: 'string' },
        { name: 'rating', type: 'number' },
        { name: 'is_active', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
        { name: 'deleted_at', type: 'number', isOptional: true },
      ],
    }),
    // Trainer Programs table
    tableSchema({
      name: 'trainer_programs',
      columns: [
        { name: 'trainer_id', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'description', type: 'string', isOptional: true },
        { name: 'is_active', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
        { name: 'deleted_at', type: 'number', isOptional: true },
      ],
    }),
    // Calendar Events table
    tableSchema({
      name: 'calendar_events',
      columns: [
        { name: 'trainer_id', type: 'string' },
        { name: 'client_id', type: 'string', isOptional: true },
        { name: 'title', type: 'string' },
        { name: 'start_time', type: 'number' },
        { name: 'end_time', type: 'number' },
        { name: 'notes', type: 'string', isOptional: true },
        { name: 'status', type: 'string' },
        { name: 'session_type', type: 'string' },
        { name: 'template_id', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
        { name: 'deleted_at', type: 'number', isOptional: true },
      ],
    }),
    // Notifications table
    tableSchema({
      name: 'notifications',
      columns: [
        { name: 'user_id', type: 'string' },
        { name: 'title', type: 'string' },
        { name: 'message', type: 'string' },
        { name: 'type', type: 'string' },
        { name: 'is_read', type: 'boolean' },
        { name: 'data', type: 'string', isOptional: true }, // JSON string
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
        { name: 'deleted_at', type: 'number', isOptional: true },
      ],
    }),
    // Bookings table
    tableSchema({
      name: 'bookings',
      columns: [
        { name: 'client_id', type: 'string' },
        { name: 'trainer_id', type: 'string' },
        { name: 'session_date', type: 'number' },
        { name: 'session_time', type: 'string' },
        { name: 'status', type: 'string' },
        { name: 'package_id', type: 'string', isOptional: true },
        { name: 'notes', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
        { name: 'deleted_at', type: 'number', isOptional: true },
      ],
    }),
  ],
})
