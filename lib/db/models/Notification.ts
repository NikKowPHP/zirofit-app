import { Model } from '@nozbe/watermelondb'
import { text, field, readonly } from '@nozbe/watermelondb/decorators'

export default class Notification extends Model {
  static table = 'notifications'

  @text('user_id') userId!: string
  @text('title') title!: string
  @text('message') message!: string
  @text('type') type!: string
  @field('is_read') isRead!: boolean
  @text('data') data?: string // JSON

  @readonly @field('created_at') createdAt!: number
  @readonly @field('updated_at') updatedAt!: number
  @field('deleted_at') deletedAt?: number
}
