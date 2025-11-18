import { database } from '@/lib/db'
import WorkoutSession from '@/lib/db/models/WorkoutSession'
import { Q } from '@nozbe/watermelondb'

const workoutSessionsCollection = database.collections.get<WorkoutSession>('workout_sessions')

export const workoutSessionRepository = {
  observeWorkoutSessions: () => workoutSessionsCollection.query(Q.where('deleted_at', Q.eq(null))).observe(),

  observeWorkoutSession: (id: string) => workoutSessionsCollection.findAndObserve(id),

  observeActiveWorkoutSessionForClient: (clientId: string) =>
    workoutSessionsCollection.query(
      Q.where('user_id', clientId),
      Q.where('status', 'active'),
      Q.where('deleted_at', Q.eq(null))
    ).observe(),

  observeWorkoutSessionsForClient: (clientId: string) =>
    workoutSessionsCollection.query(
      Q.where('user_id', clientId),
      Q.where('deleted_at', Q.eq(null))
    ).observe(),

  createWorkoutSession: async (data: {
    userId: string
    templateId?: string
    status: string
    startedAt: number
    finishedAt?: number
    notes?: string
    name?: string
  }) => {
    await database.write(async () => {
      await workoutSessionsCollection.create(session => {
        session.userId = data.userId
        session.templateId = data.templateId
        session.status = data.status
        session.startedAt = data.startedAt
        session.finishedAt = data.finishedAt
        session.notes = data.notes
        session.name = data.name
        ;(session as any).syncStatus = 'created'
      })
    })
  },

  updateWorkoutSession: async (id: string, updates: Partial<{
    status: string
    finishedAt: number
    notes: string
    name: string
  }>) => {
    await database.write(async () => {
      const session = await workoutSessionsCollection.find(id)
      await session.update(record => {
        Object.assign(record, updates)
        // Mark as needing sync to server if not already synced
        if ((record as any).syncStatus === 'synced') {
          ;(record as any).syncStatus = 'updated'
        }
      })
    })
  },

  deleteWorkoutSession: async (id: string) => {
    await database.write(async () => {
      const session = await workoutSessionsCollection.find(id)
      await session.update(record => {
        record.deletedAt = Date.now()
        // Mark as needing sync to server
        ;(record as any).syncStatus = 'deleted'
      })
    })
  },
}
