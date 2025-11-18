import { Model } from '@nozbe/watermelondb'
import { field, readonly, text } from '@nozbe/watermelondb/decorators'

export default class TrainerPackage extends Model {
  static table = 'trainer_packages'

  @text('user_id') userId!: string
  @text('trainer_id') trainerId!: string
  @text('name') name!: string
  @text('description') description?: string
  @field('sessions_count') sessionsCount!: number
  @field('duration_weeks') durationWeeks!: number
  @field('price') price!: number
  @text('currency') currency?: string
  @text('package_type') packageType?: string
  @text('target_audience') targetAudience?: string
  @text('what_included') whatIncluded?: string
  @text('guarantees') guarantees?: string
  @text('payment_frequency') paymentFrequency?: string
  @field('discount_percentage') discountPercentage?: number
  @field('is_active') isActive!: boolean

  @readonly @field('created_at') createdAt!: number
  @readonly @field('updated_at') updatedAt!: number
  @field('deleted_at') deletedAt?: number
}