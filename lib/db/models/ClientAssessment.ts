import { Model } from '@nozbe/watermelondb'
import { field, readonly, text } from '@nozbe/watermelondb/decorators'

export default class ClientAssessment extends Model {
  static table = 'client_assessments'

  @text('user_id') userId!: string
  @text('client_id') clientId!: string
  @text('trainer_id') trainerId!: string
  @field('assessment_date') assessmentDate!: number
  @field('weight') weight?: number
  @field('height') height?: number
  @field('body_fat_percentage') bodyFatPercentage?: number
  @text('measurements') measurements?: string
  @text('photos') photos?: string
  @text('assessment_type') assessmentType!: string
  @text('assessment_method') assessmentMethod?: string
  @field('date_performed') datePerformed!: number
  @field('assessment_score') assessmentScore?: number
  @text('score_unit') scoreUnit?: string
  @text('body_weight') bodyWeight?: string // JSON
  @text('body_measurements') bodyMeasurements?: string // JSON
  @text('body_composition') bodyComposition?: string // JSON
  @text('fitness_level') fitnessLevel?: string
  @text('health_conditions') healthConditions?: string
  @text('injuries') injuries?: string
  @text('medications') medications?: string
  @text('lifestyle_factors') lifestyleFactors?: string
  @text('goals') goals?: string
  @text('notes') notes?: string
  @text('assessed_by') assessedBy?: string

  @readonly @field('created_at') createdAt!: number
  @readonly @field('updated_at') updatedAt!: number
  @field('deleted_at') deletedAt?: number
}