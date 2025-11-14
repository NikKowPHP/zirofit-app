import { Database } from '@nozbe/watermelondb'
import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs'
import { Q } from '@nozbe/watermelondb'

import { mySchema } from './schema'
import Client from './models/Client'
import TrainerProfile from './models/TrainerProfile'
import WorkoutSession from './models/WorkoutSession'
import Exercise from './models/Exercise'
import WorkoutTemplate from './models/WorkoutTemplate'
import ClientAssessment from './models/ClientAssessment'
import ClientMeasurement from './models/ClientMeasurement'
import ClientPhoto from './models/ClientPhoto'
import ClientExerciseLog from './models/ClientExerciseLog'
import TrainerService from './models/TrainerService'
import TrainerPackage from './models/TrainerPackage'
import TrainerTestimonial from './models/TrainerTestimonial'
import TrainerProgram from './models/TrainerProgram'
import CalendarEvent from './models/CalendarEvent'
import Notification from './models/Notification'
import Booking from './models/Booking'
import TemplateExercise from './models/TemplateExercise'

// First, create the adapter to the underlying database:
const adapter = new LokiJSAdapter({
  schema: mySchema,
  useWebWorker: false, // optional
  useIncrementalIndexedDB: true, // optional
  // dbName: 'myapp', // optional
})

// Then, make a Watermelon database from it!
export const database = new Database({
  adapter,
  modelClasses: [
    Client,
    TrainerProfile,
    WorkoutSession,
    Exercise,
    WorkoutTemplate,
    ClientAssessment,
    ClientMeasurement,
    ClientPhoto,
    ClientExerciseLog,
    TrainerService,
    TrainerPackage,
    TrainerTestimonial,
    TrainerProgram,
    CalendarEvent,
    Notification,
    Booking,
    TemplateExercise,
  ],
})

// Debug function to check database contents
export const debugDatabase = async () => {
  console.log('=== DATABASE DEBUG ===')

  const collections = [
    'clients',
    'trainer_profiles',
    'exercises',
    'workout_sessions',
    'workout_templates',
    'client_assessments',
    'client_measurements',
    'client_photos',
    'client_exercise_logs',
    'trainer_services',
    'trainer_packages',
    'trainer_testimonials',
    'trainer_programs',
    'calendar_events',
    'notifications',
    'bookings',
    'template_exercises'
  ]

  for (const collectionName of collections) {
    try {
      const collection = database.collections.get(collectionName)
      const count = (await collection.query().fetch()).length
      console.log(`${collectionName}: ${count} records`)

      // Show first few records for collections with data
      if (count > 0 && count <= 5) {
        const records = await collection.query().fetch()
        console.log(`${collectionName} records:`, records.map(r => r._raw))
      }
    } catch (error) {
      console.log(`${collectionName}: Error - ${error}`)
    }
  }

  console.log('=== END DATABASE DEBUG ===')
}

// Debug function to check unsynced records
export const debugUnsyncedRecords = async () => {
  console.log('=== UNSYNCED RECORDS DEBUG ===')

  const collections = [
    'clients',
    'trainer_profiles',
    'exercises',
    'workout_sessions',
    'workout_templates',
    'client_assessments',
    'client_measurements',
    'client_photos',
    'client_exercise_logs',
    'trainer_services',
    'trainer_packages',
    'trainer_testimonials',
    'trainer_programs',
    'calendar_events',
    'notifications',
    'bookings'
  ]

  for (const collectionName of collections) {
    try {
      const collection = database.collections.get(collectionName)
      const unsyncedRecords = await collection.query(
        Q.where('sync_status', Q.notEq('synced'))
      ).fetch()
      const count = unsyncedRecords.length
      if (count > 0) {
        console.log(`${collectionName}: ${count} unsynced records`)
        console.log(`${collectionName} unsynced:`, unsyncedRecords.map(r => ({ id: r.id, sync_status: (r as any).sync_status })))
      }
    } catch (error) {
      console.log(`${collectionName} unsynced check: Error - ${error}`)
    }
  }

  console.log('=== END UNSYNCED RECORDS DEBUG ===')
}

// Make debug functions available globally for console access
if (typeof global !== 'undefined') {
  (global as any).debugDatabase = debugDatabase
  ;(global as any).debugUnsyncedRecords = debugUnsyncedRecords
}
