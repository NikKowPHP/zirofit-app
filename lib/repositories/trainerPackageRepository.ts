import { database } from '@/lib/db'
import TrainerPackage from '@/lib/db/models/TrainerPackage'
import { Q } from '@nozbe/watermelondb'

const trainerPackagesCollection = database.collections.get<TrainerPackage>('trainer_packages')

export const trainerPackageRepository = {
  observeTrainerPackages: () => trainerPackagesCollection.query(Q.where('deleted_at', Q.eq(null))).observe(),

  observeTrainerPackage: (id: string) => trainerPackagesCollection.findAndObserve(id),

  observePackagesByTrainer: (trainerId: string) =>
    trainerPackagesCollection.query(
      Q.where('trainer_id', trainerId),
      Q.where('deleted_at', Q.eq(null)),
      Q.where('is_active', true)
    ).observe(),

  createTrainerPackage: async (data: {
    trainerId: string
    name: string
    description?: string
    price: number
    sessionsCount: number
    durationWeeks: number
    isActive?: boolean
  }) => {
    await database.write(async () => {
      await trainerPackagesCollection.create(pkg => {
        pkg.trainerId = data.trainerId
        pkg.name = data.name
        pkg.description = data.description
        pkg.price = data.price
        pkg.sessionsCount = data.sessionsCount
        pkg.durationWeeks = data.durationWeeks
        pkg.isActive = data.isActive ?? true
        ;(pkg as any).syncStatus = 'created'
      })
    })
  },

  updateTrainerPackage: async (id: string, updates: Partial<{
    name: string
    description: string
    price: number
    sessionsCount: number
    durationWeeks: number
    isActive: boolean
  }>) => {
    await database.write(async () => {
      const pkg = await trainerPackagesCollection.find(id)
      await pkg.update(record => {
        Object.assign(record, updates)
        // Mark as needing sync to server if not already synced
        if ((record as any).syncStatus === 'synced') {
          ;(record as any).syncStatus = 'updated'
        }
      })
    })
  },

  deleteTrainerPackage: async (id: string) => {
    await database.write(async () => {
      const pkg = await trainerPackagesCollection.find(id)
      await pkg.update(record => {
        record.deletedAt = Date.now()
        // Mark as needing sync to server
        ;(record as any).syncStatus = 'deleted'
      })
    })
  },
}
