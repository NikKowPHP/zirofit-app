import { Model } from '@nozbe/watermelondb'
import { field, readonly, text } from '@nozbe/watermelondb/decorators'

export default class TrainerProgram extends Model {
  static table = 'trainer_programs'

  @text('user_id') userId!: string
  @text('trainer_id') trainerId!: string
  @text('name') name!: string
  @text('description') description?: string
  @text('category') category?: string
  @field('duration_weeks') durationWeeks?: number
  @field('difficulty_level') difficultyLevel?: number
  @field('estimated_hours_per_week') estimatedHoursPerWeek?: number
  @field('is_active') isActive!: boolean
  @field('price') price?: number
  @text('target_audience') targetAudience?: string
  @text('prerequisites') prerequisites?: string
  @text('what_you_get') whatYouGet?: string
  @text('curriculum_overview') curriculumOverview?: string

  @readonly @field('created_at') createdAt!: number
  @readonly @field('updated_at') updatedAt!: number
  @field('deleted_at') deletedAt?: number
}