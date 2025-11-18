import { Model } from '@nozbe/watermelondb'
import { field, readonly, text } from '@nozbe/watermelondb/decorators'

export default class TrainerProfile extends Model {
  static table = 'trainer_profiles'

  @text('user_id') userId!: string
  @text('name') name!: string
  @text('username') username!: string
  @text('certifications') certifications!: string // JSON - maps to Profile.certifications
  @text('bio') bio?: string // Maps to Profile.aboutMe
  @text('specialties') specialties!: string // JSON - maps to Profile.specialties
  @text('phone') phone?: string // Maps to Profile.phone
  @text('email') email?: string // Maps to User.email
  @text('avatar_url') avatarUrl?: string // Maps to Profile.profilePhotoPath

  @readonly @field('created_at') createdAt!: number
  @readonly @field('updated_at') updatedAt!: number
  @field('deleted_at') deletedAt?: number
}
