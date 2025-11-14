import { Database } from '@nozbe/watermelondb'
import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs'

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
