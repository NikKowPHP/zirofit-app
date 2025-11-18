import { Model } from '@nozbe/watermelondb'
import { field, readonly, text } from '@nozbe/watermelondb/decorators'

export default class ClientPhoto extends Model {
  static table = 'client_photos'

  @text('user_id') userId!: string
  @text('client_id') clientId!: string
  @text('trainer_id') trainerId!: string
  @field('taken_at') takenAt!: number
  @text('photo_url') photoUrl!: string
  @text('photo_type') photoType!: string
  @text('caption') caption?: string
  @text('body_part') bodyPart?: string
  @text('description') description?: string
  @text('photo_notes') photoNotes?: string
  @text('uploaded_by') uploadedBy?: string

  @readonly @field('created_at') createdAt!: number
  @readonly @field('updated_at') updatedAt!: number
  @field('deleted_at') deletedAt?: number
}