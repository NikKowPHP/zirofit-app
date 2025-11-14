import { database } from '@/lib/db'
import WorkoutTemplate from '@/lib/db/models/WorkoutTemplate'
import TemplateExercise from '@/lib/db/models/TemplateExercise'
import Exercise from '@/lib/db/models/Exercise'
import { Q } from '@nozbe/watermelondb'

const workoutTemplatesCollection = database.collections.get<WorkoutTemplate>('workout_templates')
const templateExercisesCollection = database.collections.get<TemplateExercise>('template_exercises')

export const workoutTemplateRepository = {
  observeWorkoutTemplates: () => workoutTemplatesCollection.query(Q.where('deleted_at', Q.eq(null))).observe(),

  observeWorkoutTemplate: (id: string) => workoutTemplatesCollection.findAndObserve(id),

  observeWorkoutTemplatesByTrainer: (trainerId: string) =>
    workoutTemplatesCollection.query(
      Q.where('trainer_id', trainerId),
      Q.where('deleted_at', Q.eq(null))
    ).observe(),

  createWorkoutTemplate: async (data: {
    name: string
    description?: string
    trainerId?: string
  }) => {
    await database.write(async () => {
      await workoutTemplatesCollection.create(template => {
        template.name = data.name
        template.description = data.description
        template.trainerId = data.trainerId
      })
    })
  },

  updateWorkoutTemplate: async (id: string, updates: Partial<{
    name: string
    description: string
    trainerId: string
  }>) => {
    await database.write(async () => {
      const template = await workoutTemplatesCollection.find(id)
      await template.update(record => {
        Object.assign(record, updates)
      })
    })
  },

  observeTemplateExercises: (templateId: string) =>
    templateExercisesCollection.query(
      Q.where('template_id', templateId),
      Q.where('deleted_at', Q.eq(null))
    ).observe(),

  addExerciseToTemplate: async (templateId: string, exerciseId: string, options?: {
    notes?: string
    order?: number
    sets?: string
  }) => {
    await database.write(async () => {
      await templateExercisesCollection.create(templateExercise => {
        templateExercise.templateId = templateId
        templateExercise.exerciseId = exerciseId
        templateExercise.notes = options?.notes
        templateExercise.order = options?.order
        templateExercise.sets = options?.sets
      })
    })
  },

  removeExerciseFromTemplate: async (templateId: string, exerciseId: string) => {
    await database.write(async () => {
      const templateExercises = await templateExercisesCollection.query(
        Q.where('template_id', templateId),
        Q.where('exercise_id', exerciseId),
        Q.where('deleted_at', Q.eq(null))
      ).fetch()

      for (const templateExercise of templateExercises) {
        await templateExercise.update(record => {
          record.deletedAt = Date.now()
        })
      }
    })
  },

  updateTemplateExercise: async (templateId: string, exerciseId: string, updates: Partial<{
    notes: string
    order: number
    sets: string
  }>) => {
    await database.write(async () => {
      const templateExercises = await templateExercisesCollection.query(
        Q.where('template_id', templateId),
        Q.where('exercise_id', exerciseId),
        Q.where('deleted_at', Q.eq(null))
      ).fetch()

      for (const templateExercise of templateExercises) {
        await templateExercise.update(record => {
          Object.assign(record, updates)
        })
      }
    })
  },
};
