import { database } from '@/lib/db'
import TrainerProgram from '@/lib/db/models/TrainerProgram'
import { Q } from '@nozbe/watermelondb'

const trainerProgramsCollection = database.collections.get<TrainerProgram>('trainer_programs')

export const trainerProgramRepository = {
  observeTrainerPrograms: () => trainerProgramsCollection.query(Q.where('deleted_at', Q.eq(null))).observe(),

  observeTrainerProgram: (id: string) => trainerProgramsCollection.findAndObserve(id),

  observeTrainerProgramsByTrainer: (trainerId: string) =>
    trainerProgramsCollection.query(
      Q.where('trainer_id', trainerId),
      Q.where('deleted_at', Q.eq(null))
    ).observe(),

  createTrainerProgram: async (data: {
    trainerId: string
    name: string
    description?: string
    isActive: boolean
  }) => {
    await database.write(async () => {
      await trainerProgramsCollection.create(program => {
        program.trainerId = data.trainerId
        program.name = data.name
        program.description = data.description
        program.isActive = data.isActive
      })
    })
  },

  updateTrainerProgram: async (id: string, updates: Partial<{
    name: string
    description: string
    isActive: boolean
  }>) => {
    await database.write(async () => {
      const program = await trainerProgramsCollection.find(id)
      await program.update(record => {
        Object.assign(record, updates)
      })
    })
  },

  deleteTrainerProgram: async (id: string) => {
    await database.write(async () => {
      const program = await trainerProgramsCollection.find(id)
      await program.update(record => {
        record.deletedAt = Date.now()
      })
    })
  },
}
