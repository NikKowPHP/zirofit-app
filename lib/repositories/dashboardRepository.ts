import { database } from '@/lib/db'
import Client from '@/lib/db/models/Client'
import TrainerProgram from '@/lib/db/models/TrainerProgram'
import WorkoutSession from '@/lib/db/models/WorkoutSession'
import CalendarEvent from '@/lib/db/models/CalendarEvent'
import { Q } from '@nozbe/watermelondb'
import { combineLatest, map } from 'rxjs/operators'
import { of, combineLatest as combineLatestStatic } from 'rxjs'

const clientsCollection = database.collections.get<Client>('clients')
const trainerProgramsCollection = database.collections.get<TrainerProgram>('trainer_programs')
const workoutSessionsCollection = database.collections.get<WorkoutSession>('workout_sessions')
const calendarEventsCollection = database.collections.get<CalendarEvent>('calendar_events')

export const dashboardRepository = {
  /**
   * Compute dashboard data from local repositories
   */
  observeDashboardData: () => {
    const clients$ = clientsCollection.query(Q.where('deleted_at', Q.eq(null))).observe()
    const programs$ = trainerProgramsCollection.query(Q.where('deleted_at', Q.eq(null))).observe()
    const sessions$ = workoutSessionsCollection.query(Q.where('deleted_at', Q.eq(null))).observe()
    const events$ = calendarEventsCollection.query(Q.where('deleted_at', Q.eq(null))).observe()

    return combineLatestStatic([clients$, programs$, sessions$, events$]).pipe(
      map(([clients, programs, sessions, events]) => {
        // Compute active clients (simple heuristic: clients with sessions in last 30 days)
        const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000)
        const activeClients = clients.filter(client => {
          return sessions.some(session =>
            session.userId === client.userId &&
            session.createdAt > thirtyDaysAgo
          )
        })

        // Compute upcoming sessions (events in next 7 days)
        const sevenDaysFromNow = Date.now() + (7 * 24 * 60 * 60 * 1000)
        const upcomingSessions = events
          .filter(event => event.startTime > Date.now() && event.startTime < sevenDaysFromNow)
          .map(event => {
            const client = clients.find(c => c.id === event.clientId)
            return {
              id: event.id,
              clientName: client?.name || 'Unknown Client',
              time: new Date(event.startTime).toISOString()
            }
          })

        // Compute activity feed (recent sessions and events)
        const recentActivities = [
          ...sessions
            .filter(s => s.createdAt > thirtyDaysAgo)
            .map(session => ({
              clientName: clients.find(c => c.userId === session.userId)?.name || 'Unknown',
              date: new Date(session.createdAt).toISOString(),
              type: session.status === 'completed' ? 'Completed Workout' : 'Started Workout'
            })),
          ...events
            .filter(e => e.createdAt > thirtyDaysAgo)
            .map(event => ({
              clientName: clients.find(c => c.id === event.clientId)?.name || 'Unknown',
              date: new Date(event.createdAt).toISOString(),
              type: 'Scheduled Session'
            }))
        ]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 10)

        // Basic business performance (placeholder - would need revenue tracking)
        const currentMonth = new Date().getMonth()
        const currentYear = new Date().getFullYear()
        const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1
        const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear

        const currentMonthSessions = sessions.filter(s =>
          s.createdAt >= new Date(currentYear, currentMonth, 1).getTime() &&
          s.createdAt < new Date(currentYear, currentMonth + 1, 1).getTime()
        ).length

        const prevMonthSessions = sessions.filter(s =>
          s.createdAt >= new Date(prevYear, prevMonth, 1).getTime() &&
          s.createdAt < new Date(prevYear, prevMonth + 1, 1).getTime()
        ).length

        return {
          clients: clients.map(client => ({
            id: client.id,
            name: client.name,
            email: client.email,
            phone: client.phone,
            status: client.status,
            userId: client.userId
          })),
          upcomingSessions,
          activityFeed: recentActivities,
          businessPerformance: {
            currentMonth: {
              completedSessions: currentMonthSessions,
              newClients: clients.filter(c =>
                c.createdAt >= new Date(currentYear, currentMonth, 1).getTime()
              ).length,
              revenue: 0 // Would need revenue tracking
            },
            previousMonth: {
              completedSessions: prevMonthSessions,
              newClients: clients.filter(c =>
                c.createdAt >= new Date(prevYear, prevMonth, 1).getTime() &&
                c.createdAt < new Date(currentYear, currentMonth, 1).getTime()
              ).length,
              revenue: 0
            }
          },
          clientEngagement: {
            active: activeClients,
            atRisk: [], // Would need more complex logic
            slipping: []
          },
          profileChecklist: {
            packagesCount: 0, // Would need package repository
            profile: null,
            programsCount: programs.length
          },
          programsAndTemplates: {
            systemPrograms: [],
            systemTemplates: [],
            userPrograms: programs,
            userTemplates: []
          },
          servicePopularity: {
            popularPackages: [],
            popularTemplates: []
          }
        }
      })
    )
  }
}
