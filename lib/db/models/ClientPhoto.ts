import { Model } from '@nozbe/watermelondb'
import { text, field, readonly } from '@nozbe/watermelondb/decorators'

export default class ClientPhoto extends Model {
  static table = 'client_photos'

  @text('client_id') clientId!: string
  @text('photo_url') photoUrl!: string
  @text('caption') caption?: string
  @field('taken_at') takenAt!: number

  @readonly @field('created_at') createdAt!: number
  @readonly @field('updated_at') updatedAt!: number
  @field('deleted_at') deletedAt?: number
}
