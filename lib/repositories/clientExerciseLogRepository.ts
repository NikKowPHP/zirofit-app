import { database } from '@/lib/db'
import ClientExerciseLog from '@/lib/db/models/ClientExerciseLog'
import { Q } from '@nozbe/watermelondb'

const clientExerciseLogsCollection = database.collections.get<ClientExerciseLog>('client_exercise_logs')

export const clientExerciseLogRepository = {
  observeClientExerciseLogs: () => clientExerciseLogsCollection.query(Q.where('deleted_at', Q.eq(null))).observe(),

  observeClientExerciseLog: (id: string) => clientExerciseLogsCollection.findAndObserve(id),

  observeClientExerciseLogsForSession: (sessionId: string) =>
    clientExerciseLogsCollection.query(
      Q.where('workout_session_id', sessionId),
      Q.where('deleted_at', Q.eq(null))
    ).observe(),

  observeClientExerciseLogsForExercise: (exerciseId: string) =>
    clientExerciseLogsCollection.query(
      Q.where('exercise_id', exerciseId),
      Q.where('deleted_at', Q.eq(null))
    ).observe(),

  createClientExerciseLog: async (data: {
    clientId: string
    exerciseId: string
    workoutSessionId: string
    sets: string // JSON string
    notes?: string
    completedAt: number
  }) => {
    await database.write(async () => {
      await clientExerciseLogsCollection.create(log => {
        log.clientId = data.clientId
        log.exerciseId = data.exerciseId
        log.workoutSessionId = data.workoutSessionId
        log.sets = data.sets
        log.notes = data.notes
        log.completedAt = data.completedAt
        ;(log as any).syncStatus = 'created'
      })
    })
  },

  updateClientExerciseLog: async (id: string, updates: Partial<{
    sets: string
    notes: string
    completedAt: number
  }>) => {
    await database.write(async () => {
      const log = await clientExerciseLogsCollection.find(id)
      await log.update(record => {
        Object.assign(record, updates)
        // Mark as needing sync to server if not already synced
        if ((record as any).syncStatus === 'synced') {
          ;(record as any).syncStatus = 'updated'
        }
      })
    })
  },

  deleteClientExerciseLog: async (id: string) => {
    await database.write(async () => {
      const log = await clientExerciseLogsCollection.find(id)
      await log.update(record => {
        record.deletedAt = Date.now()
        // Mark as needing sync to server
        ;(record as any).syncStatus = 'deleted'
      })
    })
  },
}
