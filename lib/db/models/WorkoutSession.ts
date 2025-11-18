import { Model } from '@nozbe/watermelondb'
import { field, readonly, text } from '@nozbe/watermelondb/decorators'

export default class WorkoutSession extends Model {
  static table = 'workout_sessions'

  @text('user_id') userId!: string
  @text('client_id') clientId!: string
  @text('trainer_id') trainerId!: string
  @text('template_id') templateId?: string
  @text('name') name?: string
  @field('started_at') startedAt!: number
  @field('finished_at') finishedAt?: number
  @text('session_type') sessionType!: string
  @text('status') status!: string
  @text('notes') notes?: string
  @text('location_type') locationType?: string
  @text('location_details') locationDetails?: string
  @text('session_notes') sessionNotes?: string
  @text('client_goals') clientGoals?: string
  @text('trainer_notes') trainerNotes?: string
  @text('session_focus') sessionFocus?: string
  @field('session_rating') sessionRating?: number
  @text('feedback') feedback?: string
  @field('calories_burned') caloriesBurned?: number
  @field('steps_count') stepsCount?: number
  @field('active_time_minutes') activeTimeMinutes?: number

  @readonly @field('created_at') createdAt!: number
  @readonly @field('updated_at') updatedAt!: number
  @field('deleted_at') deletedAt?: number
}