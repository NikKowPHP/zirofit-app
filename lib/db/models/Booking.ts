import { Model } from '@nozbe/watermelondb'
import { text, field, readonly } from '@nozbe/watermelondb/decorators'

export default class Booking extends Model {
  static table = 'bookings'

  @text('client_id') clientId!: string
  @text('trainer_id') trainerId!: string
  @field('session_date') sessionDate!: number
  @text('session_time') sessionTime!: string
  @text('status') status!: string
  @text('package_id') packageId?: string
  @text('notes') notes?: string

  @readonly @field('created_at') createdAt!: number
  @readonly @field('updated_at') updatedAt!: number
  @field('deleted_at') deletedAt?: number
}
