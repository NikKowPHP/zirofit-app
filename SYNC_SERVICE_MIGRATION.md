# Core Data Model Setup Instructions

## Important: Visual Model Required

The Core Data model file (`Zirofit.xcdatamodeld`) has been created, but **you must use Xcode's visual editor** to define all entities, attributes, and relationships.

## Steps to Complete Core Data Model

### 1. Open the Model in Xcode

1. In Xcode, navigate to `Core/Data/Zirofit.xcdatamodeld`
2. Click on it to open the visual Core Data model editor

### 2. Create All Entities

Add the following entities (matching the Prisma schema):

#### Core Entities
- **User** - User account information
- **Profile** - Trainer profile (one-to-one with User)
- **Client** - Client information
- **Exercise** - Exercise library
- **WorkoutSession** - Workout session records
- **WorkoutProgram** - Workout programs
- **WorkoutTemplate** - Templates within programs
- **TemplateExercise** - Exercise steps in templates
- **ClientExerciseLog** - Logged exercise sets
- **Booking** - Calendar bookings
- **Notification** - User notifications
- **Package** - Training packages
- **ClientPackage** - Client package purchases
- **Assessment** - Assessment definitions
- **AssessmentResult** - Assessment results
- **PersonalRecord** - Personal records

#### Profile-Related Entities
- **Location** - Trainer locations
- **Service** - Trainer services
- **Testimonial** - Client testimonials
- **TransformationPhoto** - Transformation photos
- **SocialLink** - Social media links
- **ExternalLink** - External links
- **Benefit** - Trainer benefits

#### Client-Related Entities
- **ClientMeasurement** - Body measurements
- **ClientProgressPhoto** - Progress photos
- **ClientProgramAssignment** - Program assignments
- **WorkoutSessionComment** - Comments on sessions

### 3. Add Attributes to Each Entity

Each entity should have these base attributes:

#### Required for All Entities:
- `id` - String (primary key)
- `createdAt` - Date
- `updatedAt` - Date
- `deletedAt` - Date (optional, for soft deletes)
- `lastModified` - Date (for sync tracking)
- `isLocalChange` - Boolean (marks unsynced changes)

#### Entity-Specific Attributes:

**User:**
- name: String
- email: String
- username: String? (optional)
- role: String
- emailVerifiedAt: Date? (optional)
- tier: String? (optional)
- weightUnit: String (default: "KG")
- pushTokens: [String] (Transformable)

**Profile:**
- userId: String (relationship to User)
- certifications: String? (optional)
- phone: String? (optional)
- aboutMe: String? (optional)
- philosophy: String? (optional)
- methodology: String? (optional)
- branding: String? (optional)
- bannerImagePath: String? (optional)
- profilePhotoPath: String? (optional)
- specialties: [String] (Transformable)
- trainingTypes: [String] (Transformable)
- averageRating: Float? (optional)
- minServicePrice: Decimal? (optional)
- availability: Data? (optional, JSON)

**Client:**
- trainerId: String? (optional, relationship)
- userId: String? (optional, relationship)
- name: String
- email: String? (optional)
- phone: String? (optional)
- status: String (default: "active")
- dateOfBirth: Date? (optional)
- goals: String? (optional)
- healthNotes: String? (optional)
- emergencyContactName: String? (optional)
- emergencyContactPhone: String? (optional)

**Exercise:**
- name: String (unique)
- muscleGroup: String? (optional)
- equipment: String? (optional)
- description: String? (optional)
- videoUrl: String? (optional)
- recommendedRestSeconds: Int32? (optional)
- createdById: String? (optional)

**WorkoutSession:**
- clientId: String (relationship)
- name: String? (optional)
- startTime: Date
- endTime: Date? (optional)
- status: String (default: "IN_PROGRESS")
- notes: String? (optional)
- restStartedAt: Date? (optional)
- workoutTemplateId: String? (optional, relationship)
- plannedDate: Date? (optional)
- clientPackageId: String? (optional, relationship)
- reminderTime: Date? (optional)
- trainerReminderSent: Boolean (default: false)

**WorkoutProgram:**
- name: String
- description: String? (optional)
- trainerId: String? (optional, relationship)
- category: String? (optional)

**WorkoutTemplate:**
- programId: String (relationship)
- name: String
- description: String? (optional)
- order: Int32 (default: 0)

**TemplateExercise:**
- templateId: String (relationship)
- type: String? (optional) - "EXERCISE" or "REST"
- exerciseId: String? (optional, relationship)
- targetReps: String? (optional)
- targetRIR: Int32? (optional)
- durationSeconds: Int32? (optional)
- notes: String? (optional)
- order: Int32 (default: 0)

**ClientExerciseLog:**
- clientId: String (relationship)
- exerciseId: String (relationship)
- workoutSessionId: String (relationship)
- reps: Int32? (optional)
- weight: Float? (optional)
- isCompleted: Boolean? (optional)
- order: Int32? (optional)
- supersetKey: String? (optional)
- orderInSuperset: Int32? (optional)

**Booking:**
- trainerId: String (relationship)
- clientId: String? (optional, relationship)
- startTime: Date
- endTime: Date
- status: String (default: "PENDING")
- clientName: String? (optional)
- clientEmail: String? (optional)
- clientNotes: String? (optional)

**Notification:**
- userId: String (relationship)
- message: String
- type: String
- readStatus: Boolean (default: false)

**Package:**
- trainerId: String (relationship)
- name: String
- description: String? (optional)
- price: Decimal
- numberOfSessions: Int32
- isActive: Boolean (default: true)
- stripeProductId: String (unique)
- stripePriceId: String (unique)

**ClientPackage:**
- clientId: String (relationship)
- packageId: String (relationship)
- sessionsRemaining: Int32
- purchaseDate: Date

**Assessment:**
- name: String
- description: String? (optional)
- unit: String
- trainerId: String? (optional, relationship)

**AssessmentResult:**
- assessmentId: String (relationship)
- clientId: String (relationship)
- value: Float
- date: Date
- notes: String? (optional)

**PersonalRecord:**
- clientId: String (relationship)
- exerciseId: String (relationship)
- workoutSessionId: String (relationship)
- recordType: String
- value: Float
- achievedAt: Date

**ClientMeasurement:**
- clientId: String (relationship)
- measurementDate: Date
- weightKg: Float? (optional)
- bodyFatPercentage: Float? (optional)
- notes: String? (optional)
- customMetrics: Data? (optional, JSON)

**ClientProgressPhoto:**
- clientId: String (relationship)
- photoDate: Date
- imagePath: String
- caption: String? (optional)

**Location:**
- profileId: String (relationship)
- address: String
- normalizedAddress: String
- latitude: Float? (optional)
- longitude: Float? (optional)

**Service:**
- profileId: String (relationship)
- title: String
- description: String
- price: Decimal? (optional)
- currency: String? (optional)
- duration: Int32? (optional)

**Testimonial:**
- profileId: String (relationship)
- clientName: String
- testimonialText: String
- rating: Int32? (optional)

**TransformationPhoto:**
- profileId: String (relationship)
- imagePath: String
- caption: String? (optional)
- clientName: String? (optional)

**SocialLink:**
- profileId: String (relationship)
- platform: String
- username: String
- profileUrl: String

**ExternalLink:**
- profileId: String (relationship)
- linkUrl: String
- label: String

**Benefit:**
- profileId: String (relationship)
- iconName: String? (optional)
- iconStyle: String? (optional, default: "outline")
- title: String
- description: String? (optional)
- orderColumn: Int32 (default: 0)

**ClientProgramAssignment:**
- clientId: String (relationship)
- programId: String (relationship)
- startDate: Date
- isActive: Boolean (default: true)

**WorkoutSessionComment:**
- workoutSessionId: String (relationship)
- userId: String (relationship)
- text: String
- createdAt: Date
- updatedAt: Date

### 4. Set Up Relationships

Configure relationships in Xcode's visual editor:

- User ↔ Profile (one-to-one)
- User ↔ Client[] (one-to-many, as trainer)
- User ↔ Client (one-to-one, as self-managed client)
- Profile ↔ Location[] (one-to-many)
- Profile ↔ Service[] (one-to-many)
- Profile ↔ Testimonial[] (one-to-many)
- Profile ↔ TransformationPhoto[] (one-to-many)
- Profile ↔ SocialLink[] (one-to-many)
- Profile ↔ ExternalLink[] (one-to-many)
- Profile ↔ Benefit[] (one-to-many)
- Client ↔ WorkoutSession[] (one-to-many)
- Client ↔ ClientMeasurement[] (one-to-many)
- Client ↔ ClientProgressPhoto[] (one-to-many)
- Client ↔ ClientExerciseLog[] (one-to-many)
- Client ↔ ClientProgramAssignment[] (one-to-many)
- Client ↔ PersonalRecord[] (one-to-many)
- Client ↔ ClientPackage[] (one-to-many)
- Client ↔ AssessmentResult[] (one-to-many)
- WorkoutProgram ↔ WorkoutTemplate[] (one-to-many)
- WorkoutTemplate ↔ TemplateExercise[] (one-to-many)
- WorkoutTemplate ↔ WorkoutSession[] (one-to-many)
- Exercise ↔ ClientExerciseLog[] (one-to-many)
- Exercise ↔ TemplateExercise[] (one-to-many)
- Exercise ↔ PersonalRecord[] (one-to-many)
- WorkoutSession ↔ ClientExerciseLog[] (one-to-many)
- WorkoutSession ↔ PersonalRecord[] (one-to-many)
- WorkoutSession ↔ WorkoutSessionComment[] (one-to-many)
- Package ↔ ClientPackage[] (one-to-many)
- ClientPackage ↔ WorkoutSession[] (one-to-many)
- Assessment ↔ AssessmentResult[] (one-to-many)

### 5. Add Indexes

In Xcode, add indexes for performance:
- All `id` fields (primary keys)
- `createdAt`, `updatedAt`, `deletedAt` on all entities
- `trainerId` on Client
- `clientId` on WorkoutSession, ClientMeasurement, etc.
- `status` fields where applicable

### 6. Set Delete Rules

Configure delete rules:
- **Cascade**: For child entities (e.g., Client → WorkoutSession)
- **Nullify**: For optional relationships
- **Deny**: For required relationships that shouldn't be deleted

## Notes

- Use **Transformable** type for arrays (specialties, trainingTypes, pushTokens)
- Use **Decimal** type for monetary values (price, minServicePrice)
- Use **Date** type for all date/time fields
- Set **Optional** checkbox appropriately
- Set **Default Values** where specified
- Use **String** type for enums (status, type, etc.) - we'll handle conversion in code

## After Creating the Model

Once the model is complete:
1. Build the project to generate NSManagedObject subclasses
2. Create extensions for each entity (Task 2.1.3)
3. Test Core Data operations

See `DETAILED_IMPLEMENTATION_PLAN.md` Section 2.1 for more details.

