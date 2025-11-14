import { Model } from '@nozbe/watermelondb'
import { text, field, readonly } from '@nozbe/watermelondb/decorators'

export default class TrainerPackage extends Model {
  static table = 'trainer_packages'

  @text('trainer_id') trainerId!: string
  @text('name') name!: string
  @text('description') description?: string
  @field('price') price!: number
  @field('sessions_count') sessionsCount!: number
  @field('duration_weeks') durationWeeks!: number
  @field('is_active') isActive!: boolean

  @readonly @field('created_at') createdAt!: number
  @readonly @field('updated_at') updatedAt!: number
  @field('deleted_at') deletedAt?: number
}
