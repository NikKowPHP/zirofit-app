import { Model } from '@nozbe/watermelondb'
import { text, field, readonly } from '@nozbe/watermelondb/decorators'

export default class ClientExerciseLog extends Model {
  static table = 'client_exercise_logs'

  @text('client_id') clientId!: string
  @text('exercise_id') exerciseId!: string
  @text('workout_session_id') workoutSessionId!: string
  @text('sets') sets!: string // JSON
  @text('notes') notes?: string
  @field('completed_at') completedAt!: number

  @readonly @field('created_at') createdAt!: number
  @readonly @field('updated_at') updatedAt!: number
  @field('deleted_at') deletedAt?: number
}
