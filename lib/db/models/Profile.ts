import { Model } from '@nozbe/watermelondb'
import { field, readonly, text } from '@nozbe/watermelondb/decorators'

export default class Profile extends Model {
  static table = 'profiles'

  @text('user_id') userId!: string
  @text('certifications') certifications?: string
  @text('phone') phone?: string
  @text('about_me') aboutMe?: string
  @text('philosophy') philosophy?: string
  @text('methodology') methodology?: string
  @text('branding') branding?: string
  @text('banner_image_path') bannerImagePath?: string
  @text('profile_photo_path') profilePhotoPath?: string
  @text('specialties') specialties?: string // JSON array
  @text('training_types') trainingTypes?: string // JSON array
  @field('average_rating') averageRating?: number
  @text('availability') availability?: string // JSON
  @field('min_service_price') minServicePrice?: number
  @text('sync_status') syncStatus?: string

  @readonly @field('created_at') createdAt!: number
  @readonly @field('updated_at') updatedAt!: number
  @field('deleted_at') deletedAt?: number
}

