import { Model } from '@nozbe/watermelondb'
import { field, readonly, text } from '@nozbe/watermelondb/decorators'

export default class Booking extends Model {
  static table = 'bookings'

  @text('user_id') userId!: string
  @text('client_id') clientId!: string
  @text('trainer_id') trainerId!: string
  @text('session_type') sessionType!: string
  @field('session_date') sessionDate!: number
  @text('session_time') sessionTime!: string
  @text('status') status!: string
  @text('package_id') packageId?: string
  @text('payment_status') paymentStatus?: string
  @field('session_duration') sessionDuration!: number
  @field('session_cost') sessionCost?: number
  @text('notes') notes?: string
  @text('cancellation_reason') cancellationReason?: string
  @field('cancellation_fee') cancellationFee?: number
  @field('reschedule_count') rescheduleCount?: number

  @readonly @field('created_at') createdAt!: number
  @readonly @field('updated_at') updatedAt!: number
  @field('deleted_at') deletedAt?: number
}