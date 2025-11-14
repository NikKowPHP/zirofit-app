import { Model } from '@nozbe/watermelondb'
import { text, field, readonly } from '@nozbe/watermelondb/decorators'

export default class WorkoutSession extends Model {
  static table = 'workout_sessions'

  @text('user_id') userId!: string
  @text('template_id') templateId?: string
  @text('status') status!: string
  @field('started_at') startedAt!: number
  @field('finished_at') finishedAt?: number
  @text('notes') notes?: string
  @text('name') name?: string

  @readonly @field('created_at') createdAt!: number
  @readonly @field('updated_at') updatedAt!: number
  @field('deleted_at') deletedAt?: number
}
