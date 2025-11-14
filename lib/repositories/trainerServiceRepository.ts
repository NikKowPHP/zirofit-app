import { database } from '@/lib/db'
import TrainerService from '@/lib/db/models/TrainerService'
import { Q } from '@nozbe/watermelondb'

const trainerServicesCollection = database.collections.get<TrainerService>('trainer_services')

export const trainerServiceRepository = {
  observeTrainerServices: () => trainerServicesCollection.query(Q.where('deleted_at', Q.eq(null))).observe(),

  observeTrainerService: (id: string) => trainerServicesCollection.findAndObserve(id),

  observeServicesByTrainer: (trainerId: string) =>
    trainerServicesCollection.query(
      Q.where('trainer_id', trainerId),
      Q.where('deleted_at', Q.eq(null)),
      Q.where('is_active', true)
    ).observe(),

  createTrainerService: async (data: {
    trainerId: string
    name: string
    description?: string
    price: number
    duration: number
    isActive?: boolean
  }) => {
    await database.write(async () => {
      await trainerServicesCollection.create(service => {
        service.trainerId = data.trainerId
        service.name = data.name
        service.description = data.description
        service.price = data.price
        service.duration = data.duration
        service.isActive = data.isActive ?? true
      })
    })
  },

  updateTrainerService: async (id: string, updates: Partial<{
    name: string
    description: string
    price: number
    duration: number
    isActive: boolean
  }>) => {
    await database.write(async () => {
      const service = await trainerServicesCollection.find(id)
      await service.update(record => {
        Object.assign(record, updates)
      })
    })
  },

  deleteTrainerService: async (id: string) => {
    await database.write(async () => {
      const service = await trainerServicesCollection.find(id)
      await service.update(record => {
        record.deletedAt = Date.now()
      })
    })
  },
}
