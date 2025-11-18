import { Model } from '@nozbe/watermelondb'
import { text, field, readonly } from '@nozbe/watermelondb/decorators'

export default class Client extends Model {
  static table = 'clients'

  @text('user_id') userId?: string
  @text('name') name!: string
  @text('email') email!: string
  @text('phone') phone?: string
  @field('date_of_birth') dateOfBirth?: string
  @text('fitness_goals') fitnessGoals?: string
  @text('medical_conditions') medicalConditions?: string
  @text('avatar_url') avatarUrl?: string
  @text('goals') goals?: string
  @text('health_notes') healthNotes?: string
  @text('emergency_contact_name') emergencyContactName?: string
  @text('emergency_contact_phone') emergencyContactPhone?: string
  @text('status') status?: string
  @text('trainer_id') trainerId?: string
  @text('sync_status') syncStatus?: string

  @readonly @field('created_at') createdAt!: number
  @readonly @field('updated_at') updatedAt!: number
  @field('deleted_at') deletedAt?: number
}
