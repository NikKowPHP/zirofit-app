import { Model } from '@nozbe/watermelondb'
import { field, readonly, text } from '@nozbe/watermelondb/decorators'

export default class CalendarEvent extends Model {
  static table = 'calendar_events'

  @text('user_id') userId!: string
  @text('trainer_id') trainerId!: string
  @text('client_id') clientId?: string
  @text('title') title!: string
  @text('session_type') sessionType!: string
  @text('description') description?: string
  @field('start_time') startTime!: number
  @field('end_time') endTime!: number
  @text('event_type') eventType!: string
  @text('status') status?: string
  @text('location') location?: string
  @text('color') color?: string
  @text('recurrence_rule') recurrenceRule?: string
  @text('template_id') templateId?: string
  @field('is_all_day') isAllDay?: boolean
  @text('notes') notes?: string

  @readonly @field('created_at') createdAt!: number
  @readonly @field('updated_at') updatedAt!: number
  @field('deleted_at') deletedAt?: number
}