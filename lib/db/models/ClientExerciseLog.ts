import { Model } from '@nozbe/watermelondb'
import { field, readonly, text } from '@nozbe/watermelondb/decorators'

export default class ClientExerciseLog extends Model {
  static table = 'client_exercise_logs'

  @text('user_id') userId!: string
  @text('client_id') clientId!: string
  @text('exercise_id') exerciseId!: string
  @field('completed_at') completedAt!: number
  @text('workout_session_id') workoutSessionId?: string
  @text('sets') sets!: string // JSON array of sets
  @text('notes') notes?: string
  @text('rating') rating?: string // How the client felt about the exercise
  @field('duration_minutes') durationMinutes?: number
  @field('calories_burned') caloriesBurned?: number
  @text('rpe') rpe?: string // Rate of Perceived Exertion
  @text('form_quality') formQuality?: string
  @text('completed_by') completedBy?: string

  @readonly @field('created_at') createdAt!: number
  @readonly @field('updated_at') updatedAt!: number
  @field('deleted_at') deletedAt?: number
}