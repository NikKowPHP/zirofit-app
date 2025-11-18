import { Model } from '@nozbe/watermelondb'
import { field, readonly, text } from '@nozbe/watermelondb/decorators'

export default class Exercise extends Model {
  static table = 'exercises'

  @text('name') name!: string
  @text('description') description?: string
  @text('muscle_group') muscleGroup?: string
  @text('equipment') equipment?: string
  @text('exercise_type') exerciseType?: string
  @text('difficulty_level') difficultyLevel?: string
  @text('equipment_needed') equipmentNeeded?: string
  @text('media_url') mediaUrl?: string
  @text('instructions') instructions?: string
  @field('estimated_duration') estimatedDuration?: number
  @field('calories_per_minute') caloriesPerMinute?: number

  @readonly @field('created_at') createdAt!: number
  @readonly @field('updated_at') updatedAt!: number
  @field('deleted_at') deletedAt?: number
}