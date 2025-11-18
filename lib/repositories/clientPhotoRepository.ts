import { database } from '@/lib/db'
import ClientPhoto from '@/lib/db/models/ClientPhoto'
import { Q } from '@nozbe/watermelondb'

const clientPhotosCollection = database.collections.get<ClientPhoto>('client_photos')

export const clientPhotoRepository = {
  observeClientPhotos: () => clientPhotosCollection.query(Q.where('deleted_at', Q.eq(null))).observe(),

  observeClientPhoto: (id: string) => clientPhotosCollection.findAndObserve(id),

  observePhotosByClient: (clientId: string) =>
    clientPhotosCollection.query(
      Q.where('client_id', clientId),
      Q.where('deleted_at', Q.eq(null))
    ).observe(),

  createClientPhoto: async (data: {
    clientId: string
    photoUrl: string
    caption?: string
    takenAt: number
  }) => {
    await database.write(async () => {
      await clientPhotosCollection.create(photo => {
        photo.clientId = data.clientId
        photo.photoUrl = data.photoUrl
        photo.caption = data.caption
        photo.takenAt = data.takenAt
        ;(photo as any).syncStatus = 'created'
      })
    })
  },

  updateClientPhoto: async (id: string, updates: Partial<{
    photoUrl: string
    caption: string
    takenAt: number
  }>) => {
    await database.write(async () => {
      const photo = await clientPhotosCollection.find(id)
      await photo.update(record => {
        Object.assign(record, updates)
        // Mark as needing sync to server if not already synced
        if ((record as any).syncStatus === 'synced') {
          ;(record as any).syncStatus = 'updated'
        }
      })
    })
  },

  deleteClientPhoto: async (id: string) => {
    await database.write(async () => {
      const photo = await clientPhotosCollection.find(id)
      await photo.update(record => {
        record.deletedAt = Date.now()
        // Mark as needing sync to server
        ;(record as any).syncStatus = 'deleted'
      })
    })
  },
}
