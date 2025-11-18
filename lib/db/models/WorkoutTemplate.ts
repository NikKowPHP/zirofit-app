import { Model } from '@nozbe/watermelondb'
import { field, readonly, text } from '@nozbe/watermelondb/decorators'

export default class WorkoutTemplate extends Model {
  static table = 'workout_templates'

  @text('trainer_id') trainerId?: string
  @text('name') name?: string
  @text('description') description?: string
  @text('category') category?: string
  @field('duration') duration?: number
  @field('difficulty_level') difficultyLevel?: number
  @field('estimated_calories_burned') estimatedCaloriesBurned?: number
  @field('is_active') isActive?: boolean
  @field('version') version?: number
  @text('notes') notes?: string

  @readonly @field('created_at') createdAt!: number
  @readonly @field('updated_at') updatedAt!: number
  @field('deleted_at') deletedAt?: number
}