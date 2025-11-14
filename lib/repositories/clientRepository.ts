import { database } from '@/lib/db'
import Client from '@/lib/db/models/Client'
import withObservables from '@nozbe/with-observables'
import { Q } from '@nozbe/watermelondb'

const clientsCollection = database.collections.get<Client>('clients')

export const clientRepository = {
  observeClients: () => clientsCollection.query(Q.where('deleted_at', Q.eq(null))).observe(),

  observeClient: (id: string) => clientsCollection.findAndObserve(id),

  createClient: async (data: {
    userId?: string
    name: string
    email: string
    phone?: string
    dateOfBirth?: string
    fitnessGoals?: string
    medicalConditions?: string
    avatarUrl?: string
    goals?: string
    healthNotes?: string
    emergencyContactName?: string
    emergencyContactPhone?: string
    status?: string
    trainerId?: string
  }) => {
    await database.write(async () => {
      await clientsCollection.create(client => {
        client.userId = data.userId
        client.name = data.name
        client.email = data.email
        client.phone = data.phone
        client.dateOfBirth = data.dateOfBirth
        client.fitnessGoals = data.fitnessGoals
        client.medicalConditions = data.medicalConditions
        client.avatarUrl = data.avatarUrl
        client.goals = data.goals
        client.healthNotes = data.healthNotes
        client.emergencyContactName = data.emergencyContactName
        client.emergencyContactPhone = data.emergencyContactPhone
        client.status = data.status
        client.trainerId = data.trainerId
        // Mark as needing sync to server
        ;(client as any).syncStatus = 'created'
      })
    })
  },

  updateClient: async (id: string, updates: Partial<{
    name: string
    email: string
    phone: string
    dateOfBirth: string
    fitnessGoals: string
    medicalConditions: string
    avatarUrl: string
    goals: string
    healthNotes: string
    emergencyContactName: string
    emergencyContactPhone: string
    status: string
    trainerId: string
  }>) => {
    await database.write(async () => {
      const client = await clientsCollection.find(id)
      await client.update(record => {
        Object.assign(record, updates)
        // Mark as needing sync to server if not already synced
        if ((record as any).syncStatus === 'synced') {
          ;(record as any).syncStatus = 'updated'
        }
      })
    })
  },

  deleteClient: async (id: string) => {
    await database.write(async () => {
      const client = await clientsCollection.find(id)
      await client.update(record => {
        record.deletedAt = Date.now()
        // Mark as needing sync to server
        ;(record as any).syncStatus = 'deleted'
      })
    })
  },
}
