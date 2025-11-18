
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum WorkoutSessionStatus {
  PLANNED
  IN_PROGRESS
  COMPLETED
}

enum StepType {
  EXERCISE
  REST
}

enum TrainingType {
  IN_PERSON
  ONLINE
}

enum BookingStatus {
  PENDING
  CONFIRMED
  CANCELLED
}

enum WeightUnit {
  KG
  LB
}

model User {
  id              String    @id @unique // Use Supabase Auth UUID as the primary key
  name            String
  email           String    @unique
  username        String?   @unique // Will be used for public profile URLs
  role            String // e.g., "trainer", "admin"
  emailVerifiedAt DateTime?

  profile                Profile? // One-to-one relation to Profile
  clients                Client[]                @relation("TrainerClients") // One-to-many relation: A trainer has many clients
  notifications          Notification[]
  bookings               Booking[] // Relation to bookings made with this trainer
  selfManagedClient      Client?                 @relation("ClientUser")
  customExercises        Exercise[]              @relation("CustomExercises")
  workoutPrograms        WorkoutProgram[]
  workoutSessionComments WorkoutSessionComment[]
  packages               Package[]
  bookingsAsClient       Booking[]               @relation("ClientBookings")
  assessments            Assessment[]            @relation("TrainerAssessments")

  // Monetization fields
  tier                     String?                 @default("FREE") // FREE or PREMIUM
  stripeCustomerId         String?                 @unique
  stripeSubscriptionId     String?                 @unique
  stripeSubscriptionStatus String?
  stripeConnectAccountId   String?                 @unique // For trainer payment onboarding
  weightUnit               WeightUnit              @default(KG)
  pushTokens               String[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("User")
  @@index([createdAt])
  @@index([updatedAt])
}

model Profile {
  id     String @id @default(cuid())
  userId String @unique // Foreign key to User model
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  certifications     String?
  phone              String?
  aboutMe            String?        @db.Text // For longer text
  philosophy         String?        @db.Text
  methodology        String?        @db.Text
  branding           String?        @db.Text // For branding information
  bannerImagePath    String?
  profilePhotoPath   String?
  specialties        String[] // For trainer specialties
  trainingTypes      TrainingType[] // For robust filtering
  averageRating      Float? // For storing the average rating

  locations            Location[]
  services             Service[]
  testimonials         Testimonial[]
  transformationPhotos TransformationPhoto[]
  externalLinks        ExternalLink[]
  benefits             Benefit[]
  socialLinks          SocialLink[]
  availability         Json? // e.g., { "mon": ["09:00-17:00"], "tue": ["..."] }
  minServicePrice      Decimal? @db.Decimal(10, 2)
  search_vector      Unsupported("tsvector")?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?

  /// @deprecated These fields are being replaced by the Location model. They will be removed in a future migration.
  location           String?
  locationNormalized String?  @db.Text
  latitude           Float?
  longitude          Float?

  @@index([minServicePrice])
  @@index([specialties], type: Gin)
  @@index([trainingTypes], type: Gin)
  @@index([search_vector], type: Gin)
  @@index([averageRating])
  @@index([createdAt])
  @@index([updatedAt])
  @@index([deletedAt])
}

model Location {
  id                String   @id @default(cuid())
  profileId         String
  profile           Profile  @relation(fields: [profileId], references: [id], onDelete: Cascade)
  address           String
  normalizedAddress String
  latitude          Float?
  longitude         Float?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?

  @@index([profileId])
  @@index([latitude, longitude])
  @@index([createdAt])
  @@index([updatedAt])
  @@index([deletedAt])
}

model Service {
  id          String   @id @default(cuid())
  profileId   String // Foreign key to Profile model
  profile     Profile  @relation(fields: [profileId], references: [id], onDelete: Cascade)
  title       String
  description String   @db.Text
  price       Decimal? @db.Decimal(10, 2)
  currency    String?
  duration    Int? // Duration in minutes

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?

  @@index([createdAt])
  @@index([updatedAt])
  @@index([deletedAt])
}

model Testimonial {
  id        String  @id @default(cuid())
  profileId String // Foreign key to Profile model
  profile   Profile @relation(fields: [profileId], references: [id], onDelete: Cascade)

  clientName      String
  testimonialText String  @db.Text
  rating          Int? // Star rating from 1 to 5

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?

  @@index([createdAt])
  @@index([updatedAt])
  @@index([deletedAt])
}

model TransformationPhoto {
  id        String  @id @default(cuid())
  profileId String // Foreign key to Profile model
  profile   Profile @relation(fields: [profileId], references: [id], onDelete: Cascade)

  imagePath  String // Path to the image file (e.g., in Supabase Storage)
  caption    String?
  clientName String?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?

  @@index([createdAt])
  @@index([updatedAt])
  @@index([deletedAt])
}

model SocialLink {
  id        String  @id @default(cuid())
  profileId String
  profile   Profile @relation(fields: [profileId], references: [id], onDelete: Cascade)

  platform   String
  username   String
  profileUrl String

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?

  @@index([createdAt])
  @@index([updatedAt])
  @@index([deletedAt])
}

model ExternalLink {
  id        String  @id @default(cuid())
  profileId String // Foreign key to Profile model
  profile   Profile @relation(fields: [profileId], references: [id], onDelete: Cascade)

  linkUrl String
  label   String

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?

  @@index([createdAt])
  @@index([updatedAt])
  @@index([deletedAt])
}

model Benefit {
  id        String  @id @default(cuid())
  profileId String // Foreign key to Profile model
  profile   Profile @relation(fields: [profileId], references: [id], onDelete: Cascade)

  iconName    String? // Name of the icon (e.g., from an icon library)
  iconStyle   String? @default("outline") // e.g., 'outline', 'solid'
  title       String
  description String? @db.Text
  orderColumn Int     @default(0) // For ordering benefits

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?

  @@index([createdAt])
  @@index([updatedAt])
  @@index([deletedAt])
}

model Client {
  id        String  @id @default(cuid())
  trainerId String? // Foreign key to User model (trainer)
  trainer   User?   @relation("TrainerClients", fields: [trainerId], references: [id], onDelete: Cascade) // 'trainer' is the User
  userId    String? @unique // Link to a user account if the client is a user
  user      User?   @relation("ClientUser", fields: [userId], references: [id], onDelete: SetNull)

  name                  String
  email                 String? // Email of the client, can be unique per trainer
  phone                 String?
  status                String    @default("active") // e.g., "active", "inactive", "lead"
  dateOfBirth           DateTime? @db.Date
  goals                 String?   @db.Text
  healthNotes           String?   @db.Text
  emergencyContactName  String?
  emergencyContactPhone String?

  measurements       ClientMeasurement[]       @relation("ClientMeasurements")
  progressPhotos     ClientProgressPhoto[]     @relation("ClientProgressPhotos")
  exerciseLogs       ClientExerciseLog[]       @relation("ClientExerciseLogs")
  workoutSessions    WorkoutSession[]          @relation("ClientWorkoutSessions")
  programAssignments ClientProgramAssignment[]
  personalRecords    PersonalRecord[]
  clientPackages     ClientPackage[]
  assessmentResults  AssessmentResult[]        @relation("ClientAssessmentResults")

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?

  @@index([trainerId])
  @@index([trainerId, status])
  @@index([createdAt])
  @@index([updatedAt])
  @@index([deletedAt])
}

model ClientMeasurement {
  id       String @id @default(cuid())
  clientId String
  client   Client @relation("ClientMeasurements", fields: [clientId], references: [id], onDelete: Cascade)

  measurementDate   DateTime @db.Date
  weightKg          Float?
  bodyFatPercentage Float?
  notes             String?  @db.Text
  customMetrics     Json? // To store array of {name: string, value: string}

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?

  @@index([clientId, measurementDate])
  @@index([createdAt])
  @@index([updatedAt])
  @@index([deletedAt])
}

model ClientProgressPhoto {
  id       String @id @default(cuid())
  clientId String
  client   Client @relation("ClientProgressPhotos", fields: [clientId], references: [id], onDelete: Cascade)

  photoDate DateTime @db.Date
  imagePath String // Path to the image file
  caption   String?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?

  @@index([clientId])
  @@index([clientId, photoDate])
  @@index([createdAt])
  @@index([updatedAt])
  @@index([deletedAt])
}

model Notification {
  id     String @id @default(cuid())
  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  message    String
  type       String // e.g., "milestone", "system", "reminder"
  readStatus Boolean @default(false)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?

  @@index([createdAt])
  @@index([updatedAt])
  @@index([deletedAt])
}

model Booking {
  id        String   @id @default(cuid())
  startTime DateTime
  endTime   DateTime
  status    BookingStatus   @default(PENDING) 

  trainerId String
  trainer   User   @relation(fields: [trainerId], references: [id], onDelete: Cascade)

  // New fields for registered clients
  clientId String?
  client   User?   @relation("ClientBookings", fields: [clientId], references: [id], onDelete: SetNull)

  // Old fields made optional for backward compatibility
  clientName  String?
  clientEmail String?
  clientNotes String? @db.Text

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?

  @@index([trainerId, startTime, endTime])
  @@index([createdAt])
  @@index([updatedAt])
  @@index([deletedAt])
}

model Exercise {
  id                     String             @id @default(cuid())
  name                   String             @unique
  muscleGroup            String?
  equipment              String?
  description            String?            @db.Text
  videoUrl               String?
  logs                   ClientExerciseLog[]
  createdById            String?
  createdBy              User?              @relation("CustomExercises", fields: [createdById], references: [id], onDelete: SetNull)
  recommendedRestSeconds Int?
  templateExercises      TemplateExercise[]
  personalRecords        PersonalRecord[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?

  @@index([name])
  @@index([createdAt])
  @@index([updatedAt])
  @@index([deletedAt])
}

model ClientExerciseLog {
  id               String         @id @default(cuid())
  clientId         String
  client           Client         @relation("ClientExerciseLogs", fields: [clientId], references: [id], onDelete: Cascade)
  exerciseId       String
  exercise         Exercise       @relation(fields: [exerciseId], references: [id], onDelete: Cascade)
  reps             Int?
  weight           Float?
  isCompleted      Boolean?
  order            Int?
  createdAt        DateTime       @default(now())
  updatedAt        DateTime       @updatedAt
  deletedAt        DateTime?
  workoutSessionId String
  workoutSession   WorkoutSession @relation(fields: [workoutSessionId], references: [id], onDelete: Cascade)
  supersetKey      String?
  orderInSuperset  Int?
  sets             Json? @db.JsonB // DEPRECATED: To be removed after data migration

  @@index([clientId])
  @@index([workoutSessionId])
  @@index([createdAt])
  @@index([updatedAt])
  @@index([deletedAt])
}

model WorkoutSession {
  id                  String                  @id @default(cuid())
  clientId            String
  client              Client                  @relation("ClientWorkoutSessions", fields: [clientId], references: [id], onDelete: Cascade)
  name                String?                 // New field for custom workout names
  startTime           DateTime                @default(now())
  endTime             DateTime?
  status              WorkoutSessionStatus    @default(IN_PROGRESS)
  notes               String?                 @db.Text
  restStartedAt       DateTime?
  exerciseLogs        ClientExerciseLog[]
  workoutTemplateId   String?
  workoutTemplate     WorkoutTemplate?        @relation(fields: [workoutTemplateId], references: [id], onDelete: SetNull)
  plannedDate         DateTime?               @db.Date
  personalRecords     PersonalRecord[]
  comments            WorkoutSessionComment[]
  clientPackageId     String?
  clientPackage       ClientPackage?          @relation(fields: [clientPackageId], references: [id], onDelete: SetNull)
  reminderTime        DateTime?
  trainerReminderSent Boolean                 @default(false)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?

  @@index([clientId])
  @@index([clientId, status])
  @@index([plannedDate])
  @@index([startTime])
  @@index([clientId, status, startTime])
  @@index([endTime])
  @@index([workoutTemplateId])
  @@index([clientId, endTime])
  @@index([plannedDate, startTime, endTime])
  @@index([createdAt])
  @@index([updatedAt])
  @@index([deletedAt])
}

model WorkoutSessionComment {
  id               String         @id @default(cuid())
  text             String         @db.Text
  createdAt        DateTime       @default(now())
  updatedAt        DateTime       @updatedAt
  deletedAt        DateTime?
  workoutSessionId String
  workoutSession   WorkoutSession @relation(fields: [workoutSessionId], references: [id], onDelete: Cascade)
  userId           String // The author of the comment
  user             User           @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([workoutSessionId])
  @@index([userId])
  @@index([createdAt])
  @@index([updatedAt])
  @@index([deletedAt])
}

model WorkoutProgram {
  id                  String                    @id @default(cuid())
  name                String
  description         String?                   @db.Text
  trainerId           String?
  trainer             User?                     @relation(fields: [trainerId], references: [id], onDelete: Cascade)
  category            String?
  templates           WorkoutTemplate[]
  clientAssignments   ClientProgramAssignment[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?

  @@index([createdAt])
  @@index([updatedAt])
  @@index([deletedAt])
}

model WorkoutTemplate {
  id          String           @id @default(cuid())
  name        String
  description String?          @db.Text
  programId   String
  program     WorkoutProgram   @relation(fields: [programId], references: [id], onDelete: Cascade)
  exercises   TemplateExercise[]
  order       Int              @default(0)
  sessions    WorkoutSession[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?

  @@index([createdAt])
  @@index([updatedAt])
  @@index([deletedAt])
}

model TemplateExercise {
  id              String          @id @default(cuid())
  templateId      String
  template        WorkoutTemplate @relation(fields: [templateId], references: [id], onDelete: Cascade)
  type            StepType?
  exerciseId      String?
  exercise        Exercise?       @relation(fields: [exerciseId], references: [id], onDelete: Cascade)
  targetReps      String? // e.g., "8-12"
  targetRIR       Int? // Reps in Reserve
  durationSeconds Int? // for REST steps, this is rest duration. for EXERCISE, it's recommended rest after.
  notes           String?         @db.Text
  order           Int             @default(0)

  // DEPRECATED: To be removed after data migration
  targetSets      Int?
  targetRest      Int?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?

  @@index([createdAt])
  @@index([updatedAt])
  @@index([deletedAt])
}

model ClientProgramAssignment {
  id        String         @id @default(cuid())
  clientId  String
  client    Client         @relation(fields: [clientId], references: [id], onDelete: Cascade)
  programId String
  program   WorkoutProgram @relation(fields: [programId], references: [id], onDelete: Cascade)
  startDate DateTime
  isActive  Boolean        @default(true)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?

  @@index([startDate])
  @@index([createdAt])
  @@index([updatedAt])
  @@index([deletedAt])
}

model PersonalRecord {
  id               String         @id @default(cuid())
  clientId         String
  client           Client         @relation(fields: [clientId], references: [id], onDelete: Cascade)
  exerciseId       String
  exercise         Exercise       @relation(fields: [exerciseId], references: [id], onDelete: Cascade)
  workoutSessionId String
  workoutSession   WorkoutSession @relation(fields: [workoutSessionId], references: [id], onDelete: Cascade)
  recordType       String // e.g., "e1rm", "best_set_volume", "max_weight", "max_reps"
  value            Float

  achievedAt DateTime @default(now())
  deletedAt  DateTime?

  @@unique([clientId, exerciseId, recordType])
  @@index([clientId])
  @@index([exerciseId])
  @@index([achievedAt])
  @@index([deletedAt])
}

model Package {
  id               String   @id @default(cuid())
  name             String
  description      String?  @db.Text
  price            Decimal  @db.Decimal(10, 2)
  numberOfSessions Int
  isActive         Boolean  @default(true)
  stripeProductId  String   @unique
  stripePriceId    String   @unique

  trainerId String
  trainer   User   @relation(fields: [trainerId], references: [id], onDelete: Cascade)

  clientPackages ClientPackage[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?

  @@index([trainerId])
  @@index([createdAt])
  @@index([updatedAt])
  @@index([deletedAt])
}

model ClientPackage {
  id                String   @id @default(cuid())
  clientId          String
  client            Client   @relation(fields: [clientId], references: [id], onDelete: Cascade)
  packageId         String
  package           Package  @relation(fields: [packageId], references: [id], onDelete: Cascade)
  sessionsRemaining Int
  purchaseDate      DateTime @default(now())

  usedSessions WorkoutSession[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?

  @@index([clientId])
  @@index([packageId])
  @@index([packageId, purchaseDate])
  @@index([createdAt])
  @@index([updatedAt])
  @@index([deletedAt])
}

model Assessment {
  id          String   @id @default(cuid())
  name        String
  description String?  @db.Text
  unit        String // e.g., "cm", "seconds", "meters", "reps"
  trainerId   String? // Null for system-wide assessments
  trainer     User?    @relation("TrainerAssessments", fields: [trainerId], references: [id], onDelete: Cascade)
  results     AssessmentResult[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?

  @@unique([trainerId, name])
  @@index([createdAt])
  @@index([updatedAt])
  @@index([deletedAt])
}

model AssessmentResult {
  id           String     @id @default(cuid())
  assessmentId String
  assessment   Assessment @relation(fields: [assessmentId], references: [id], onDelete: Cascade)
  clientId     String
  client       Client     @relation("ClientAssessmentResults", fields: [clientId], references: [id], onDelete: Cascade)
  value        Float
  date         DateTime
  notes        String?    @db.Text

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?

  @@index([assessmentId, clientId, date])
  @@index([createdAt])
  @@index([updatedAt])
  @@index([deletedAt])
}


// src/lib/sync/service.ts
import { PrismaClient, User } from "@prisma/client";
import {
  SYNC_TABLES,
  TABLE_MODEL_MAP,
  SyncTableName,
  convertDatesToTimestamps,
  convertTimestampsToDates,
  objectKeysToSnake,
  objectKeysToCamel,
  dateToTimestamp
} from "./utils";

interface SyncChanges {
  created: any[];
  updated: any[];
  deleted: string[];
}

interface SyncData {
  changes: Record<SyncTableName, SyncChanges>;
  timestamp: number;
}

export class SyncService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Get all changes since the last sync for a user
   */
  async pull(lastPulledAt: number, userId: string): Promise<SyncData> {
    const changes: Record<SyncTableName, SyncChanges> = {} as any;
    const serverTimestamp = Date.now();

    // Run all table queries in parallel to dramatically improve performance
    const tablePromises = SYNC_TABLES.map(tableName =>
      this.getTableChanges(tableName, lastPulledAt, userId)
        .then(tableChanges => ({ tableName, tableChanges }))
        .catch(error => {
          console.error(`Error fetching changes for table ${tableName}:`, error);
          // Return empty changes for failed table to prevent the whole sync from failing
          return { tableName, tableChanges: { created: [], updated: [], deleted: [] } };
        })
    );

    const results = await Promise.all(tablePromises);

    results.forEach(({ tableName, tableChanges }) => {
      changes[tableName] = tableChanges;
    });

    return {
      changes,
      timestamp: serverTimestamp,
    };
  }

  /**
   * Apply client changes to the server
   */
  async push(changes: Record<SyncTableName, SyncChanges>, userId: string): Promise<{ timestamp: number }> {
    const serverTimestamp = Date.now();

    // Process changes in transaction for atomicity
    await this.prisma.$transaction(async (tx) => {
      for (const [tableName, tableChanges] of Object.entries(changes)) {
        await this.applyTableChanges(tx, tableName as SyncTableName, tableChanges, userId);
      }
    });

    return { timestamp: serverTimestamp };
  }

  private async getTableChanges(
    tableName: SyncTableName,
    lastPulledAt: number,
    userId: string
  ): Promise<SyncChanges> {
    switch (tableName) {
      case 'clients':
        return this.getClientChanges(lastPulledAt, userId);
      case 'trainer_profiles':
        return this.getTrainerProfileChanges(lastPulledAt, userId);
      case 'workout_sessions':
        return this.getWorkoutSessionChanges(lastPulledAt, userId);
      case 'exercises':
        return this.getExerciseChanges(lastPulledAt, userId);
      case 'workout_templates':
        return this.getWorkoutTemplateChanges(lastPulledAt, userId);
      case 'client_assessments':
        return this.getClientAssessmentChanges(lastPulledAt, userId);
      case 'client_measurements':
        return this.getClientMeasurementChanges(lastPulledAt, userId);
      case 'client_photos':
        return this.getClientPhotoChanges(lastPulledAt, userId);
      case 'client_exercise_logs':
        return this.getClientExerciseLogChanges(lastPulledAt, userId);
      case 'trainer_services':
        return this.getTrainerServiceChanges(lastPulledAt, userId);
      case 'trainer_packages':
        return this.getTrainerPackageChanges(lastPulledAt, userId);
      case 'trainer_testimonials':
        return this.getTrainerTestimonialChanges(lastPulledAt, userId);
      case 'trainer_programs':
        return this.getTrainerProgramChanges(lastPulledAt, userId);
      case 'calendar_events':
      case 'bookings':
        return this.getBookingChanges(lastPulledAt, userId);
      case 'notifications':
        return this.getNotificationChanges(lastPulledAt, userId);
      default:
        throw new Error(`Unsupported table: ${tableName}`);
    }
  }

  private async getClientChanges(lastPulledAt: number, userId: string): Promise<SyncChanges> {
    const created = await this.prisma.client.findMany({
      where: {
        trainerId: userId,
        createdAt: { gte: new Date(lastPulledAt) },
        deletedAt: { equals: null },
      },
    });

    const updated = await this.prisma.client.findMany({
      where: {
        trainerId: userId,
        updatedAt: { gte: new Date(lastPulledAt) },
        createdAt: { lt: new Date(lastPulledAt) },
        deletedAt: { equals: null },
      },
    });

    const deleted = await this.prisma.client.findMany({
      where: {
        trainerId: userId,
        deletedAt: { gte: new Date(lastPulledAt) },
      },
      select: { id: true },
    });

    return {
      created: created.map(record => objectKeysToSnake(convertDatesToTimestamps(record))),
      updated: updated.map(record => objectKeysToSnake(convertDatesToTimestamps(record))),
      deleted: deleted.map(record => record.id),
    };
  }

  private async getTrainerProfileChanges(lastPulledAt: number, userId: string): Promise<SyncChanges> {
    const created = await this.prisma.profile.findMany({
      where: {
        userId,
        createdAt: { gte: new Date(lastPulledAt) },
        deletedAt: { equals: null },
      },
    });

    const updated = await this.prisma.profile.findMany({
      where: {
        userId,
        updatedAt: { gte: new Date(lastPulledAt) },
        createdAt: { lt: new Date(lastPulledAt) },
        deletedAt: { equals: null },
      },
    });

    const deleted = await this.prisma.profile.findMany({
      where: {
        userId,
        deletedAt: { gte: new Date(lastPulledAt) },
      },
      select: { id: true },
    });

    return {
      created: created.map(record => objectKeysToSnake(convertDatesToTimestamps(record))),
      updated: updated.map(record => objectKeysToSnake(convertDatesToTimestamps(record))),
      deleted: deleted.map(record => record.id),
    };
  }

  private async getWorkoutSessionChanges(lastPulledAt: number, userId: string): Promise<SyncChanges> {
    // Get sessions for clients that belong to this trainer
    const created = await this.prisma.workoutSession.findMany({
      where: {
        client: {
          trainerId: userId,
        },
        createdAt: { gte: new Date(lastPulledAt) },
        deletedAt: { equals: null },
      },
    });

    const updated = await this.prisma.workoutSession.findMany({
      where: {
        client: {
          trainerId: userId,
        },
        updatedAt: { gte: new Date(lastPulledAt) },
        createdAt: { lt: new Date(lastPulledAt) },
        deletedAt: { equals: null },
      },
    });

    const deleted = await this.prisma.workoutSession.findMany({
      where: {
        client: {
          trainerId: userId,
        },
        deletedAt: { gte: new Date(lastPulledAt) },
      },
      select: { id: true },
    });

    return {
      created: created.map(record => objectKeysToSnake(convertDatesToTimestamps(record))),
      updated: updated.map(record => objectKeysToSnake(convertDatesToTimestamps(record))),
      deleted: deleted.map(record => record.id),
    };
  }

  private async getExerciseChanges(lastPulledAt: number, userId: string): Promise<SyncChanges> {
    // Include both system exercises and user-created exercises
    const created = await this.prisma.exercise.findMany({
      where: {
        OR: [
          { createdById: userId },
          { createdById: null }, // System exercises
        ],
        createdAt: { gte: new Date(lastPulledAt) },
        deletedAt: { equals: null },
      },
    });

    const updated = await this.prisma.exercise.findMany({
      where: {
        OR: [
          { createdById: userId },
          { createdById: null },
        ],
        updatedAt: { gte: new Date(lastPulledAt) },
        createdAt: { lt: new Date(lastPulledAt) },
        deletedAt: { equals: null },
      },
    });

    const deleted = await this.prisma.exercise.findMany({
      where: {
        OR: [
          { createdById: userId },
          { createdById: null },
        ],
        deletedAt: { gte: new Date(lastPulledAt) },
      },
      select: { id: true },
    });

    return {
      created: created.map(record => objectKeysToSnake(convertDatesToTimestamps(record))),
      updated: updated.map(record => objectKeysToSnake(convertDatesToTimestamps(record))),
      deleted: deleted.map(record => record.id),
    };
  }

  private async getWorkoutTemplateChanges(lastPulledAt: number, userId: string): Promise<SyncChanges> {
    // Templates belong to programs which belong to trainers
    const created = await this.prisma.workoutTemplate.findMany({
      where: {
        program: {
          trainerId: userId,
        },
        createdAt: { gte: new Date(lastPulledAt) },
        deletedAt: { equals: null },
      },
    });

    const updated = await this.prisma.workoutTemplate.findMany({
      where: {
        program: {
          trainerId: userId,
        },
        updatedAt: { gte: new Date(lastPulledAt) },
        createdAt: { lt: new Date(lastPulledAt) },
        deletedAt: { equals: null },
      },
    });

    const deleted = await this.prisma.workoutTemplate.findMany({
      where: {
        program: {
          trainerId: userId,
        },
        deletedAt: { gte: new Date(lastPulledAt) },
      },
      select: { id: true },
    });

    return {
      created: created.map(record => objectKeysToSnake(convertDatesToTimestamps(record))),
      updated: updated.map(record => objectKeysToSnake(convertDatesToTimestamps(record))),
      deleted: deleted.map(record => record.id),
    };
  }

  private async getClientAssessmentChanges(lastPulledAt: number, userId: string): Promise<SyncChanges> {
    const created = await this.prisma.assessmentResult.findMany({
      where: {
        client: {
          trainerId: userId,
        },
        createdAt: { gte: new Date(lastPulledAt) },
        deletedAt: { equals: null },
      },
    });

    const updated = await this.prisma.assessmentResult.findMany({
      where: {
        client: {
          trainerId: userId,
        },
        updatedAt: { gte: new Date(lastPulledAt) },
        createdAt: { lt: new Date(lastPulledAt) },
        deletedAt: { equals: null },
      },
    });

    const deleted = await this.prisma.assessmentResult.findMany({
      where: {
        client: {
          trainerId: userId,
        },
        deletedAt: { gte: new Date(lastPulledAt) },
      },
      select: { id: true },
    });

    return {
      created: created.map(record => objectKeysToSnake(convertDatesToTimestamps(record))),
      updated: updated.map(record => objectKeysToSnake(convertDatesToTimestamps(record))),
      deleted: deleted.map(record => record.id),
    };
  }

  private async getClientMeasurementChanges(lastPulledAt: number, userId: string): Promise<SyncChanges> {
    const created = await this.prisma.clientMeasurement.findMany({
      where: {
        client: {
          trainerId: userId,
        },
        createdAt: { gte: new Date(lastPulledAt) },
        deletedAt: { equals: null },
      },
    });

    const updated = await this.prisma.clientMeasurement.findMany({
      where: {
        client: {
          trainerId: userId,
        },
        updatedAt: { gte: new Date(lastPulledAt) },
        createdAt: { lt: new Date(lastPulledAt) },
        deletedAt: { equals: null },
      },
    });

    const deleted = await this.prisma.clientMeasurement.findMany({
      where: {
        client: {
          trainerId: userId,
        },
        deletedAt: { gte: new Date(lastPulledAt) },
      },
      select: { id: true },
    });

    return {
      created: created.map(record => objectKeysToSnake(convertDatesToTimestamps(record))),
      updated: updated.map(record => objectKeysToSnake(convertDatesToTimestamps(record))),
      deleted: deleted.map(record => record.id),
    };
  }

  private async getClientPhotoChanges(lastPulledAt: number, userId: string): Promise<SyncChanges> {
    const created = await this.prisma.clientProgressPhoto.findMany({
      where: {
        client: {
          trainerId: userId,
        },
        createdAt: { gte: new Date(lastPulledAt) },
        deletedAt: { equals: null },
      },
    });

    const updated = await this.prisma.clientProgressPhoto.findMany({
      where: {
        client: {
          trainerId: userId,
        },
        updatedAt: { gte: new Date(lastPulledAt) },
        createdAt: { lt: new Date(lastPulledAt) },
        deletedAt: { equals: null },
      },
    });

    const deleted = await this.prisma.clientProgressPhoto.findMany({
      where: {
        client: {
          trainerId: userId,
        },
        deletedAt: { gte: new Date(lastPulledAt) },
      },
      select: { id: true },
    });

    return {
      created: created.map(record => objectKeysToSnake(convertDatesToTimestamps(record))),
      updated: updated.map(record => objectKeysToSnake(convertDatesToTimestamps(record))),
      deleted: deleted.map(record => record.id),
    };
  }

  private async getClientExerciseLogChanges(lastPulledAt: number, userId: string): Promise<SyncChanges> {
    const created = await this.prisma.clientExerciseLog.findMany({
      where: {
        client: {
          trainerId: userId,
        },
        createdAt: { gte: new Date(lastPulledAt) },
        deletedAt: { equals: null },
      },
    });

    const updated = await this.prisma.clientExerciseLog.findMany({
      where: {
        client: {
          trainerId: userId,
        },
        updatedAt: { gte: new Date(lastPulledAt) },
        createdAt: { lt: new Date(lastPulledAt) },
        deletedAt: { equals: null },
      },
    });

    const deleted = await this.prisma.clientExerciseLog.findMany({
      where: {
        client: {
          trainerId: userId,
        },
        deletedAt: { gte: new Date(lastPulledAt) },
      },
      select: { id: true },
    });

    return {
      created: created.map(record => objectKeysToSnake(convertDatesToTimestamps(record))),
      updated: updated.map(record => objectKeysToSnake(convertDatesToTimestamps(record))),
      deleted: deleted.map(record => record.id),
    };
  }

  private async getTrainerServiceChanges(lastPulledAt: number, userId: string): Promise<SyncChanges> {
    const created = await this.prisma.service.findMany({
      where: {
        profile: { userId },
        createdAt: { gte: new Date(lastPulledAt) },
        deletedAt: { equals: null },
      },
    });

    const updated = await this.prisma.service.findMany({
      where: {
        profile: { userId },
        updatedAt: { gte: new Date(lastPulledAt) },
        createdAt: { lt: new Date(lastPulledAt) },
        deletedAt: { equals: null },
      },
    });

    const deleted = await this.prisma.service.findMany({
      where: {
        profile: { userId },
        deletedAt: { gte: new Date(lastPulledAt) },
      },
      select: { id: true },
    });

    return {
      created: created.map(record => objectKeysToSnake(convertDatesToTimestamps(record))),
      updated: updated.map(record => objectKeysToSnake(convertDatesToTimestamps(record))),
      deleted: deleted.map(record => record.id),
    };
  }

  private async getTrainerPackageChanges(lastPulledAt: number, userId: string): Promise<SyncChanges> {
    const created = await this.prisma.package.findMany({
      where: {
        trainerId: userId,
        createdAt: { gte: new Date(lastPulledAt) },
        deletedAt: { equals: null },
      },
    });

    const updated = await this.prisma.package.findMany({
      where: {
        trainerId: userId,
        updatedAt: { gte: new Date(lastPulledAt) },
        createdAt: { lt: new Date(lastPulledAt) },
        deletedAt: { equals: null },
      },
    });

    const deleted = await this.prisma.package.findMany({
      where: {
        trainerId: userId,
        deletedAt: { gte: new Date(lastPulledAt) },
      },
      select: { id: true },
    });

    return {
      created: created.map(record => objectKeysToSnake(convertDatesToTimestamps(record))),
      updated: updated.map(record => objectKeysToSnake(convertDatesToTimestamps(record))),
      deleted: deleted.map(record => record.id),
    };
  }

  private async getTrainerTestimonialChanges(lastPulledAt: number, userId: string): Promise<SyncChanges> {
    const created = await this.prisma.testimonial.findMany({
      where: {
        profile: { userId: userId },
        createdAt: { gte: new Date(lastPulledAt) },
        deletedAt: { equals: null },
      },
    });

    const updated = await this.prisma.testimonial.findMany({
      where: {
        profile: { userId: userId },
        updatedAt: { gte: new Date(lastPulledAt) },
        createdAt: { lt: new Date(lastPulledAt) },
        deletedAt: { equals: null },
      },
    });

    const deleted = await this.prisma.testimonial.findMany({
      where: {
        profile: { userId: userId },
        deletedAt: { gte: new Date(lastPulledAt) },
      },
      select: { id: true },
    });

    return {
      created: created.map(record => objectKeysToSnake(convertDatesToTimestamps(record))),
      updated: updated.map(record => objectKeysToSnake(convertDatesToTimestamps(record))),
      deleted: deleted.map(record => record.id),
    };
  }

  private async getTrainerProgramChanges(lastPulledAt: number, userId: string): Promise<SyncChanges> {
    const created = await this.prisma.workoutProgram.findMany({
      where: {
        trainerId: userId,
        createdAt: { gte: new Date(lastPulledAt) },
        deletedAt: { equals: null },
      },
    });

    const updated = await this.prisma.workoutProgram.findMany({
      where: {
        trainerId: userId,
        updatedAt: { gte: new Date(lastPulledAt) },
        createdAt: { lt: new Date(lastPulledAt) },
        deletedAt: { equals: null },
      },
    });

    const deleted = await this.prisma.workoutProgram.findMany({
      where: {
        trainerId: userId,
        deletedAt: { gte: new Date(lastPulledAt) },
      },
      select: { id: true },
    });

    return {
      created: created.map(record => objectKeysToSnake(convertDatesToTimestamps(record))),
      updated: updated.map(record => objectKeysToSnake(convertDatesToTimestamps(record))),
      deleted: deleted.map(record => record.id),
    };
  }

  private async getBookingChanges(lastPulledAt: number, userId: string): Promise<SyncChanges> {
    const created = await this.prisma.booking.findMany({
      where: {
        trainerId: userId,
        createdAt: { gte: new Date(lastPulledAt) },
        deletedAt: { equals: null },
      },
    });

    const updated = await this.prisma.booking.findMany({
      where: {
        trainerId: userId,
        updatedAt: { gte: new Date(lastPulledAt) },
        createdAt: { lt: new Date(lastPulledAt) },
        deletedAt: { equals: null },
      },
    });

    const deleted = await this.prisma.booking.findMany({
      where: {
        trainerId: userId,
        deletedAt: { gte: new Date(lastPulledAt) },
      },
      select: { id: true },
    });

    return {
      created: created.map(record => objectKeysToSnake(convertDatesToTimestamps(record))),
      updated: updated.map(record => objectKeysToSnake(convertDatesToTimestamps(record))),
      deleted: deleted.map(record => record.id),
    };
  }

  private async getNotificationChanges(lastPulledAt: number, userId: string): Promise<SyncChanges> {
    const created = await this.prisma.notification.findMany({
      where: {
        userId,
        createdAt: { gte: new Date(lastPulledAt) },
        deletedAt: { equals: null },
      },
    });

    const updated = await this.prisma.notification.findMany({
      where: {
        userId,
        updatedAt: { gte: new Date(lastPulledAt) },
        createdAt: { lt: new Date(lastPulledAt) },
        deletedAt: { equals: null },
      },
    });

    const deleted = await this.prisma.notification.findMany({
      where: {
        userId,
        deletedAt: { gte: new Date(lastPulledAt) },
      },
      select: { id: true },
    });

    return {
      created: created.map(record => objectKeysToSnake(convertDatesToTimestamps(record))),
      updated: updated.map(record => objectKeysToSnake(convertDatesToTimestamps(record))),
      deleted: deleted.map(record => record.id),
    };
  }

  private async applyTableChanges(
    tx: any,
    tableName: SyncTableName,
    changes: SyncChanges,
    userId: string
  ) {
    // Apply deletions first (soft deletes)
    for (const id of changes.deleted) {
      await this.applyDeletion(tx, tableName, id, userId);
    }

    // Apply updates
    for (const record of changes.updated) {
      await this.applyUpdate(tx, tableName, record, userId);
    }

    // Apply creations
    for (const record of changes.created) {
      await this.applyCreation(tx, tableName, record, userId);
    }
  }

  private async applyDeletion(tx: any, tableName: SyncTableName, id: string, userId: string) {
    // Validate permissions before deletion
    await this.validateDeletionPermission(tx, tableName, id, userId);

    const modelName = TABLE_MODEL_MAP[tableName];
    const model = (tx as any)[modelName.toLowerCase()];

    await model.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  private async applyUpdate(tx: any, tableName: SyncTableName, record: any, userId: string) {
    // Validate permissions before update
    await this.validateUpdatePermission(tx, tableName, record.id, userId);

    const modelName = TABLE_MODEL_MAP[tableName];
    const model = (tx as any)[modelName.toLowerCase()];

    const data = objectKeysToCamel(record);
    delete data.id;
    delete data.createdAt;
    delete data.deletedAt;

    // Check for conflicts using last-write-wins strategy
    const existing = await model.findUnique({ where: { id: record.id } });
    if (existing && existing.updatedAt.getTime() > (data.updatedAt || 0)) {
      // Server version is newer, keep server version
      return;
    }

    await model.update({
      where: { id: record.id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  private async applyCreation(tx: any, tableName: SyncTableName, record: any, userId: string) {
    // Validate permissions before creation
    await this.validateCreationPermission(tx, tableName, record, userId);

    const modelName = TABLE_MODEL_MAP[tableName];
    const model = (tx as any)[modelName.toLowerCase()];

    const data = objectKeysToCamel(record);
    delete data.createdAt;
    delete data.updatedAt;
    delete data.deletedAt;

    // Add user-specific fields
    const creationData = this.addUserFields(tableName, data, userId);

    await model.create({
      data: {
        ...creationData,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  private async validateDeletionPermission(tx: any, tableName: SyncTableName, id: string, userId: string) {
    const modelName = TABLE_MODEL_MAP[tableName];
    const model = (tx as any)[modelName.toLowerCase()];

    const record = await model.findUnique({ where: { id } });
    if (!record) return; // Record doesn't exist, nothing to validate

    switch (tableName) {
      case 'clients':
        if (record.trainerId !== userId) {
          throw new Error(`Unauthorized: Cannot delete client ${id}`);
        }
        break;
      case 'trainer_profiles':
        if (record.userId !== userId) {
          throw new Error(`Unauthorized: Cannot delete profile ${id}`);
        }
        break;
      case 'workout_sessions':
        const sessionWithClient = await tx.workoutSession.findUnique({
          where: { id },
          include: { client: true },
        });
        if (sessionWithClient?.client?.trainerId !== userId) {
          throw new Error(`Unauthorized: Cannot delete workout session ${id}`);
        }
        break;
      // Add more validation cases as needed
      default:
        // For now, allow deletions for other tables
        break;
    }
  }

  private async validateUpdatePermission(tx: any, tableName: SyncTableName, id: string, userId: string) {
    const modelName = TABLE_MODEL_MAP[tableName];
    const model = (tx as any)[modelName.toLowerCase()];

    const record = await model.findUnique({ where: { id } });
    if (!record) {
      throw new Error(`Record ${id} not found for update`);
    }

    // Apply same validation as deletion
    await this.validateDeletionPermission(tx, tableName, id, userId);
  }

  private async validateCreationPermission(tx: any, tableName: SyncTableName, record: any, userId: string) {
    switch (tableName) {
      case 'clients':
        if (record.trainerId !== userId) {
          throw new Error(`Unauthorized: Cannot create client for another trainer`);
        }
        break;
      case 'trainer_profiles':
        if (record.userId !== userId) {
          throw new Error(`Unauthorized: Cannot create profile for another user`);
        }
        break;
      // Add more validation cases as needed
      default:
        break;
    }
  }

  private addUserFields(tableName: SyncTableName, data: any, userId: string): any {
    switch (tableName) {
      case 'clients':
        return { ...data, trainerId: userId };
      case 'trainer_profiles':
        return { ...data, userId };
      case 'trainer_services':
        return { ...data, profile: { connect: { userId } } };
      case 'trainer_packages':
        return { ...data, trainerId: userId };
      case 'trainer_testimonials':
        return { ...data, profile: { connect: { userId } } };
      case 'trainer_programs':
        return { ...data, trainerId: userId };
      case 'bookings':
      case 'calendar_events':
        return { ...data, trainerId: userId };
      case 'notifications':
        return { ...data, userId };
      default:
        return data;
    }
  }
}
