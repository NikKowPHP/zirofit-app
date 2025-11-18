import { Model } from '@nozbe/watermelondb'
import { field, readonly, text } from '@nozbe/watermelondb/decorators'

export default class TrainerService extends Model {
  static table = 'trainer_services'

  @text('user_id') userId!: string
  @text('trainer_id') trainerId!: string
  @text('name') name!: string
  @text('description') description?: string
  @text('service_type') serviceType?: string
  @field('duration') duration!: number
  @field('price') price!: number
  @text('currency') currency?: string
  @text('category') category?: string
  @text('includes') includes?: string
  @text('requirements') requirements?: string
  @field('max_clients') maxClients?: number
  @field('is_active') isActive!: boolean

  @readonly @field('created_at') createdAt!: number
  @readonly @field('updated_at') updatedAt!: number
  @field('deleted_at') deletedAt?: number
}