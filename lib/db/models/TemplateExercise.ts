import { Model } from '@nozbe/watermelondb'
import { text, field, readonly, relation } from '@nozbe/watermelondb/decorators'
import Exercise from './Exercise'

export default class TemplateExercise extends Model {
  static table = 'template_exercises'

  static associations = {
    exercises: { type: 'belongs_to' as const, key: 'exercise_id' },
  }

  @text('template_id') templateId!: string
  @text('exercise_id') exerciseId!: string
  @text('notes') notes?: string
  @field('order') order?: number
  @text('sets') sets?: string // JSON string

  @readonly @field('created_at') createdAt!: number
  @readonly @field('updated_at') updatedAt!: number
  @field('deleted_at') deletedAt?: number

  @relation('exercises', 'exercise_id') exercise!: Exercise
}
