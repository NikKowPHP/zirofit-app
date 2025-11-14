import { database } from '@/lib/db'
import Exercise from '@/lib/db/models/Exercise'
import { Q } from '@nozbe/watermelondb'

const exercisesCollection = database.collections.get<Exercise>('exercises')

export const exerciseRepository = {
  observeExercises: () => exercisesCollection.query(Q.where('deleted_at', Q.eq(null))).observe(),

  observeExercise: (id: string) => exercisesCollection.findAndObserve(id),

  createExercise: async (data: {
    name: string
    description?: string
    muscleGroup: string
    equipment?: string
    instructions?: string
    mediaUrl?: string
  }) => {
    await database.write(async () => {
      await exercisesCollection.create(exercise => {
        exercise.name = data.name
        exercise.description = data.description
        exercise.muscleGroup = data.muscleGroup
        exercise.equipment = data.equipment
        exercise.instructions = data.instructions
        exercise.mediaUrl = data.mediaUrl
      })
    })
  },

  updateExercise: async (id: string, updates: Partial<{
    name: string
    description: string
    muscleGroup: string
    equipment: string
    instructions: string
    mediaUrl: string
  }>) => {
    await database.write(async () => {
      const exercise = await exercisesCollection.find(id)
      await exercise.update(record => {
        Object.assign(record, updates)
      })
    })
  },

  deleteExercise: async (id: string) => {
    await database.write(async () => {
      const exercise = await exercisesCollection.find(id)
      await exercise.update(record => {
        record.deletedAt = Date.now()
      })
    })
  },
}
