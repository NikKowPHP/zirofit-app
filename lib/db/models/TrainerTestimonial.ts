import { Model } from '@nozbe/watermelondb'
import { field, readonly, text } from '@nozbe/watermelondb/decorators'

export default class TrainerTestimonial extends Model {
  static table = 'trainer_testimonials'

  @text('user_id') userId!: string
  @text('trainer_id') trainerId!: string
  @text('client_name') clientName!: string
  @text('content') content!: string
  @text('testimony') testimony!: string
  @field('rating') rating?: number
  @field('is_active') isActive!: boolean
  @field('is_approved') isApproved?: boolean
  @field('order') order?: number

  @readonly @field('created_at') createdAt!: number
  @readonly @field('updated_at') updatedAt!: number
  @field('deleted_at') deletedAt?: number
}