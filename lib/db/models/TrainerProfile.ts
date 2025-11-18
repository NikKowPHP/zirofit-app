import { Model } from '@nozbe/watermelondb'
import { field, readonly, text } from '@nozbe/watermelondb/decorators'

export default class TrainerProfile extends Model {
  static table = 'trainer_profiles'

  @text('user_id') userId!: string
  @text('name') name!: string
  @text('username') username!: string
  @text('certifications') certifications!: string // JSON
  @text('bio') bio?: string
  @text('specialties') specialties!: string // JSON
  @field('experience_years') experienceYears!: number
  @text('phone') phone?: string
  @text('email') email?: string
  @text('website') website?: string
  @text('avatar_url') avatarUrl?: string
  @text('social_links') socialLinks?: string // JSON

  @readonly @field('created_at') createdAt!: number
  @readonly @field('updated_at') updatedAt!: number
  @field('deleted_at') deletedAt?: number
}
