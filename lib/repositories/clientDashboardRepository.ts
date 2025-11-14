import { database } from '@/lib/db'
import Client from '@/lib/db/models/Client'
import CalendarEvent from '@/lib/db/models/CalendarEvent'
import { Q } from '@nozbe/watermelondb'
import { combineLatest, map } from 'rxjs/operators'
import { of, combineLatest as combineLatestStatic } from 'rxjs'

const clientsCollection = database.collections.get<Client>('clients')
const calendarEventsCollection = database.collections.get<CalendarEvent>('calendar_events')

export const clientDashboardRepository = {
  /**
   * Compute client dashboard data from local repositories
   */
  observeClientDashboard: (userId: string) => {
    const clients$ = clientsCollection.query(Q.where('user_id', userId)).observe()
    const events$ = calendarEventsCollection.query(
      Q.where('client_id', userId),
      Q.where('deleted_at', Q.eq(null))
    ).observe()

    return combineLatestStatic([clients$, events$]).pipe(
      map(([clients, events]) => {
        // Check if client has a trainer (simplified - in real app would check trainer relationship)
        const hasTrainer = clients.length > 0 && clients[0].status === 'active'

        // Get upcoming sessions (events in next 7 days)
        const sevenDaysFromNow = Date.now() + (7 * 24 * 60 * 60 * 1000)
        const upcomingSessions = events
          .filter(event => event.startTime > Date.now() && event.startTime < sevenDaysFromNow)
          .map(event => ({
            id: event.id,
            time: new Date(event.startTime).toISOString(),
            title: event.title,
            status: event.status
          }))

        return {
          hasTrainer,
          upcomingSessions,
          // Add other client-specific data as needed
        }
      })
    )
  }
}
