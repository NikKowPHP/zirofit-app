import { database } from '@/lib/db'
import ClientMeasurement from '@/lib/db/models/ClientMeasurement'
import { Q } from '@nozbe/watermelondb'

const clientMeasurementsCollection = database.collections.get<ClientMeasurement>('client_measurements')

export const clientMeasurementRepository = {
  observeClientMeasurements: () => clientMeasurementsCollection.query(Q.where('deleted_at', Q.eq(null))).observe(),

  observeClientMeasurement: (id: string) => clientMeasurementsCollection.findAndObserve(id),

  observeMeasurementsByClient: (clientId: string) =>
    clientMeasurementsCollection.query(
      Q.where('client_id', clientId),
      Q.where('deleted_at', Q.eq(null))
    ).observe(),

  observeMeasurementsByType: (clientId: string, measurementType: string) =>
    clientMeasurementsCollection.query(
      Q.where('client_id', clientId),
      Q.where('measurement_type', measurementType),
      Q.where('deleted_at', Q.eq(null))
    ).observe(),

  createClientMeasurement: async (data: {
    clientId: string
    measurementType: string
    value: number
    unit: string
    measuredAt: number
    notes?: string
  }) => {
    await database.write(async () => {
      await clientMeasurementsCollection.create(measurement => {
        measurement.clientId = data.clientId
        measurement.measurementType = data.measurementType
        measurement.value = data.value
        measurement.unit = data.unit
        measurement.measuredAt = data.measuredAt
        measurement.notes = data.notes
      })
    })
  },

  updateClientMeasurement: async (id: string, updates: Partial<{
    measurementType: string
    value: number
    unit: string
    measuredAt: number
    notes: string
  }>) => {
    await database.write(async () => {
      const measurement = await clientMeasurementsCollection.find(id)
      await measurement.update(record => {
        Object.assign(record, updates)
      })
    })
  },

  deleteClientMeasurement: async (id: string) => {
    await database.write(async () => {
      const measurement = await clientMeasurementsCollection.find(id)
      await measurement.update(record => {
        record.deletedAt = Date.now()
      })
    })
  },
}
