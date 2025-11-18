import { Model } from '@nozbe/watermelondb'
import { field, readonly, text } from '@nozbe/watermelondb/decorators'

export default class Notification extends Model {
  static table = 'notifications'

  @text('user_id') userId!: string
  @text('type') type!: string
  @text('title') title!: string
  @text('message') message!: string
  @text('data') data?: string // JSON
  @field('is_read') isRead!: boolean
  @readonly @field('created_at') createdAt!: number
  @readonly @field('updated_at') updatedAt!: number
  @field('deleted_at') deletedAt?: number
}