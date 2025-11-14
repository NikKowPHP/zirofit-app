import { Model } from '@nozbe/watermelondb'
import { text, readonly, field } from '@nozbe/watermelondb/decorators'

export default class Exercise extends Model {
  static table = 'exercises'

  @text('name') name!: string
  @text('description') description?: string
  @text('muscle_group') muscleGroup!: string
  @text('equipment') equipment?: string
  @text('instructions') instructions?: string
  @text('media_url') mediaUrl?: string

  @readonly @field('created_at') createdAt!: number
  @readonly @field('updated_at') updatedAt!: number
  @field('deleted_at') deletedAt?: number
}
