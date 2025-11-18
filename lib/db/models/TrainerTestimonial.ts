import { Model } from '@nozbe/watermelondb'
import { text, field, readonly } from '@nozbe/watermelondb/decorators'

export default class TrainerTestimonial extends Model {
  static table = 'trainer_testimonials'

  @text('trainer_id') trainerId!: string
  @text('client_name') clientName!: string
  @text('content') content!: string
  @field('rating') rating!: number
  @field('is_active') isActive!: boolean
  @text('sync_status') syncStatus?: string

  @readonly @field('created_at') createdAt!: number
  @readonly @field('updated_at') updatedAt!: number
  @field('deleted_at') deletedAt?: number
}
