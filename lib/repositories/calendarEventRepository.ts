import { database } from '@/lib/db'
import CalendarEvent from '@/lib/db/models/CalendarEvent'
import { Q } from '@nozbe/watermelondb'

const calendarEventsCollection = database.collections.get<CalendarEvent>('calendar_events')

export const calendarEventRepository = {
  observeCalendarEvents: () => calendarEventsCollection.query(Q.where('deleted_at', Q.eq(null))).observe(),

  observeCalendarEvent: (id: string) => calendarEventsCollection.findAndObserve(id),

  observeCalendarEventsByTrainer: (trainerId: string) =>
    calendarEventsCollection.query(
      Q.where('trainer_id', trainerId),
      Q.where('deleted_at', Q.eq(null))
    ).observe(),

  observeCalendarEventsByClient: (clientId: string) =>
    calendarEventsCollection.query(
      Q.where('client_id', clientId),
      Q.where('deleted_at', Q.eq(null))
    ).observe(),

  createCalendarEvent: async (data: {
    trainerId: string
    clientId?: string
    title: string
    startTime: number
    endTime: number
    notes?: string
    status: string
    sessionType: string
    templateId?: string
  }) => {
    await database.write(async () => {
      await calendarEventsCollection.create(event => {
        event.trainerId = data.trainerId
        event.clientId = data.clientId
        event.title = data.title
        event.startTime = data.startTime
        event.endTime = data.endTime
        event.notes = data.notes
        event.status = data.status
        event.sessionType = data.sessionType
        event.templateId = data.templateId
      })
    })
  },

  updateCalendarEvent: async (id: string, updates: Partial<{
    trainerId: string
    clientId: string
    title: string
    startTime: number
    endTime: number
    notes: string
    status: string
    sessionType: string
    templateId: string
  }>) => {
    await database.write(async () => {
      const event = await calendarEventsCollection.find(id)
      await event.update(record => {
        Object.assign(record, updates)
      })
    })
  },

  deleteCalendarEvent: async (id: string) => {
    await database.write(async () => {
      const event = await calendarEventsCollection.find(id)
      await event.update(record => {
        record.deletedAt = Date.now()
      })
    })
  },
}
