import { Model } from '@nozbe/watermelondb'
import { field, readonly, text } from '@nozbe/watermelondb/decorators'

export default class TemplateExercise extends Model {
  static table = 'template_exercises'

  @text('template_id') templateId!: string
  @text('exercise_id') exerciseId!: string
  @text('sets') sets?: string // JSON string
  @text('repetitions') repetitions?: string // JSON string
  @text('weight') weight?: string // JSON string
  @text('rest_time') restTime?: string // JSON string
  @field('order') order!: number
  @text('notes') notes?: string
  @text('intensity_level') intensityLevel?: string
  @text('target_rpe') targetRpe?: string // Rate of Perceived Exertion

  @readonly @field('created_at') createdAt!: number
  @readonly @field('updated_at') updatedAt!: number
  @field('deleted_at') deletedAt?: number
}