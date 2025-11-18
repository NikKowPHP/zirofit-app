import { Model } from '@nozbe/watermelondb'
import { text, readonly, field } from '@nozbe/watermelondb/decorators'

export default class TrainerProgram extends Model {
  static table = 'trainer_programs'

  @text('trainer_id') trainerId!: string
  @text('name') name!: string
  @text('description') description?: string
  @field('is_active') isActive!: boolean
  @text('sync_status') syncStatus?: string

  @readonly @field('created_at') createdAt!: number
  @readonly @field('updated_at') updatedAt!: number
  @field('deleted_at') deletedAt?: number
}
