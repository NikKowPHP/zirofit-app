import { Model } from '@nozbe/watermelondb'
import { field, readonly, text } from '@nozbe/watermelondb/decorators'

export default class ClientMeasurement extends Model {
  static table = 'client_measurements'

  @text('user_id') userId!: string
  @text('client_id') clientId!: string
  @text('trainer_id') trainerId!: string
  @field('measured_at') measuredAt!: number
  @text('measurement_type') measurementType!: string
  @field('value') value!: number
  @text('unit') unit?: string
  @text('measurement_data') measurementData?: string // JSON
  @text('measurement_method') measurementMethod?: string
  @text('measured_by') measuredBy?: string
  @text('notes') notes?: string

  @readonly @field('created_at') createdAt!: number
  @readonly @field('updated_at') updatedAt!: number
  @field('deleted_at') deletedAt?: number
}