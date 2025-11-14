import { Model } from '@nozbe/watermelondb'
import { text, field, readonly } from '@nozbe/watermelondb/decorators'

export default class CalendarEvent extends Model {
  static table = 'calendar_events'

  @text('trainer_id') trainerId!: string
  @text('client_id') clientId?: string
  @text('title') title!: string
  @field('start_time') startTime!: number
  @field('end_time') endTime!: number
  @text('notes') notes?: string
  @text('status') status!: string
  @text('session_type') sessionType!: string
  @text('template_id') templateId?: string

  @readonly @field('created_at') createdAt!: number
  @readonly @field('updated_at') updatedAt!: number
  @field('deleted_at') deletedAt?: number
}
