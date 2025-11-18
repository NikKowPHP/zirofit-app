import { Model } from '@nozbe/watermelondb'
import { text, field, readonly } from '@nozbe/watermelondb/decorators'

export default class ClientAssessment extends Model {
  static table = 'client_assessments'

  @text('client_id') clientId!: string
  @field('assessment_date') assessmentDate!: number
  @field('weight') weight?: number
  @field('height') height?: number
  @field('body_fat_percentage') bodyFatPercentage?: number
  @text('measurements') measurements?: string // JSON
  @text('photos') photos?: string // JSON array
  @text('notes') notes?: string
  @text('sync_status') syncStatus?: string

  @readonly @field('created_at') createdAt!: number
  @readonly @field('updated_at') updatedAt!: number
  @field('deleted_at') deletedAt?: number
}
