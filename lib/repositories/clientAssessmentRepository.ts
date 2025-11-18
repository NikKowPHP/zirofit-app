import { database } from '@/lib/db'
import ClientAssessment from '@/lib/db/models/ClientAssessment'
import { Q } from '@nozbe/watermelondb'

const clientAssessmentsCollection = database.collections.get<ClientAssessment>('client_assessments')

export const clientAssessmentRepository = {
  observeClientAssessments: () => clientAssessmentsCollection.query(Q.where('deleted_at', Q.eq(null))).observe(),

  observeClientAssessment: (id: string) => clientAssessmentsCollection.findAndObserve(id),

  observeAssessmentsByClient: (clientId: string) =>
    clientAssessmentsCollection.query(
      Q.where('client_id', clientId),
      Q.where('deleted_at', Q.eq(null)),
      Q.sortBy('assessment_date', Q.desc)
    ).observe(),

  createClientAssessment: async (data: {
    clientId: string
    assessmentDate: number
    weight?: number
    height?: number
    bodyFatPercentage?: number
    measurements?: string // JSON string
    photos?: string // JSON string
    notes?: string
  }) => {
    await database.write(async () => {
      await clientAssessmentsCollection.create(assessment => {
        assessment.clientId = data.clientId
        assessment.assessmentDate = data.assessmentDate
        assessment.weight = data.weight
        assessment.height = data.height
        assessment.bodyFatPercentage = data.bodyFatPercentage
        assessment.measurements = data.measurements
        assessment.photos = data.photos
        assessment.notes = data.notes
        ;(assessment as any).syncStatus = 'created'
      })
    })
  },

  updateClientAssessment: async (id: string, updates: Partial<{
    assessmentDate: number
    weight: number
    height: number
    bodyFatPercentage: number
    measurements: string
    photos: string
    notes: string
  }>) => {
    await database.write(async () => {
      const assessment = await clientAssessmentsCollection.find(id)
      await assessment.update(record => {
        Object.assign(record, updates)
        // Mark as needing sync to server if not already synced
        if ((record as any).syncStatus === 'synced') {
          ;(record as any).syncStatus = 'updated'
        }
      })
    })
  },

  deleteClientAssessment: async (id: string) => {
    await database.write(async () => {
      const assessment = await clientAssessmentsCollection.find(id)
      await assessment.update(record => {
        record.deletedAt = Date.now()
        // Mark as needing sync to server
        ;(record as any).syncStatus = 'deleted'
      })
    })
  },
}
