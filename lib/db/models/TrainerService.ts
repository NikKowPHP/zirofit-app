import { Model } from '@nozbe/watermelondb'
import { text, field, readonly } from '@nozbe/watermelondb/decorators'

export default class TrainerService extends Model {
  static table = 'trainer_services'

  @text('trainer_id') trainerId!: string
  @text('name') name!: string
  @text('description') description?: string
  @field('price') price!: number
  @field('duration') duration!: number
  @field('is_active') isActive!: boolean
  @text('sync_status') syncStatus?: string

  @readonly @field('created_at') createdAt!: number
  @readonly @field('updated_at') updatedAt!: number
  @field('deleted_at') deletedAt?: number
}
