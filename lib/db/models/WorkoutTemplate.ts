import { Model } from '@nozbe/watermelondb'
import { text, readonly, field, children, relation } from '@nozbe/watermelondb/decorators'
import TemplateExercise from './TemplateExercise'
import Exercise from './Exercise'

export default class WorkoutTemplate extends Model {
  static table = 'workout_templates'

  static associations = {
    template_exercises: { type: 'has_many' as const, foreignKey: 'template_id' },
  }

  @text('name') name!: string
  @text('description') description?: string
  @text('trainer_id') trainerId?: string

  @readonly @field('created_at') createdAt!: number
  @readonly @field('updated_at') updatedAt!: number
  @field('deleted_at') deletedAt?: number

  @children('template_exercises') templateExercises!: TemplateExercise[]
}
