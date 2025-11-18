import { Model } from '@nozbe/watermelondb'
import { text, field, readonly } from '@nozbe/watermelondb/decorators'

export default class ClientMeasurement extends Model {
  static table = 'client_measurements'

  @text('client_id') clientId!: string
  @text('measurement_type') measurementType!: string
  @field('value') value!: number
  @text('unit') unit!: string
  @field('measured_at') measuredAt!: number
  @text('notes') notes?: string
  @text('sync_status') syncStatus?: string

  @readonly @field('created_at') createdAt!: number
  @readonly @field('updated_at') updatedAt!: number
  @field('deleted_at') deletedAt?: number
}
