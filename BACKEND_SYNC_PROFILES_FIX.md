# Backend Sync Fix: Add Support for `profiles` Table

## Issue
The mobile app is trying to sync a `profiles` table, but the backend sync service doesn't have a handler for it, causing 500 Internal Server Error.

**Error Log:**
```
API Error: 500 {"error":{"message":"Internal server error.","code":"internal_error"}}
Push failed: Server error. Please try again later.
```

**Payload being sent:**
```json
{
  "profiles": {
    "created": [{
      "id": "8XwU9kCQfdDP6dR1",
      "userId": "7c1cdbb8-7525-4318-82fa-2c949ce47cc0",
      "createdAt": 1763463357549,
      "updatedAt": 1763463357549
    }],
    "updated": [],
    "deleted": []
  }
}
```

## Root Cause
The backend `SyncService` class has:
- ✅ `getTrainerProfileChanges()` method for pulling `trainer_profiles` (maps to `Profile` model)
- ❌ Missing `getProfileChanges()` method for the `profiles` table
- ❌ Missing case in `getTableChanges()` switch statement for `profiles`
- ❌ Missing case in `applyTableChanges()` for handling `profiles` push
- ❌ Missing entry in `TABLE_MODEL_MAP` for `profiles`

## Backend Schema Context
The backend has two models:
1. **User model**: Contains `name`, `email`, `username`, `role`
2. **Profile model**: Contains `certifications`, `phone`, `aboutMe`, `philosophy`, `specialties`, etc. (linked to User via `userId`)

The mobile app has two local tables:
1. **profiles**: Maps to backend's `Profile` model (certifications, phone, aboutMe, etc.)
2. **trainer_profiles**: Contains fields from BOTH backend's `User` AND `Profile` models (name, username, email, certifications, specialties, etc.)

**The Problem**: The app is trying to sync `trainer_profiles` which contains fields from multiple sources:
- User model fields: `name`, `username`, `email`
- Profile model fields: `certifications`, `phone`, `specialties`, etc.
- App-specific fields that don't map directly: `experienceYears`, `bio`, `website`, `avatarUrl`, `socialLinks`

**Field Mapping Required:**
| App Field (trainer_profiles) | Backend Model | Backend Field | Notes |
|------------------------------|---------------|---------------|-------|
| name | User | name | Direct mapping |
| username | User | username | Direct mapping |
| email | User | email | Direct mapping |
| certifications | Profile | certifications | Direct mapping |
| phone | Profile | phone | Direct mapping |
| specialties | Profile | specialties | Direct mapping |
| bio | Profile | aboutMe | Map bio → aboutMe |
| avatarUrl | Profile | profilePhotoPath | Map avatarUrl → profilePhotoPath |
| experienceYears | - | - | **Ignore** (not in backend) |
| website | - | - | **Ignore** (not in backend) |
| socialLinks | - | - | **Ignore** (use SocialLink model separately) |

## Solution Options

### Option A: Split trainer_profiles sync into User + Profile (Recommended)
The backend should handle `trainer_profiles` by updating BOTH the User and Profile models:

**In `applyCreation()` method for `trainer_profiles`:**
```typescript
if (tableName === 'trainer_profiles') {
  const { name, email, username, ...profileData } = objectKeysToCamel(record);
  
  // Update User fields
  await tx.user.update({
    where: { id: userId },
    data: {
      name: name || undefined,
      email: email || undefined,
      username: username || undefined,
      updatedAt: new Date(),
    },
  });
  
  // Upsert Profile
  await tx.profile.upsert({
    where: { userId },
    create: {
      ...profileData,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    update: {
      ...profileData,
      updatedAt: new Date(),
    },
  });
  return;
}
```

### Option B: Keep trainer_profiles separate (Alternative)
Create a separate `TrainerProfile` model in the backend that mirrors the app's structure. This would require a new Prisma model and database table.

**We recommend Option A** as it properly maps the data to existing backend models.

## Implementation Required (Option A)

### 1. Update `TABLE_MODEL_MAP` in `src/lib/sync/utils.ts`
Add mapping for the `profiles` table:

```typescript
export const TABLE_MODEL_MAP: Record<SyncTableName, string> = {
  clients: 'Client',
  profiles: 'Profile',  // ADD THIS LINE
  trainer_profiles: 'Profile',
  workout_sessions: 'WorkoutSession',
  // ... rest of mappings
}
```

### 2. Update `SyncTableName` type in `src/lib/sync/utils.ts`
Add `profiles` to the union type:

```typescript
export type SyncTableName =
  | 'clients'
  | 'profiles'  // ADD THIS LINE
  | 'trainer_profiles'
  | 'workout_sessions'
  // ... rest of types
```

### 3. Update `SYNC_TABLES` array in `src/lib/sync/utils.ts`
Add `profiles` to the array:

```typescript
export const SYNC_TABLES: SyncTableName[] = [
  'clients',
  'profiles',  // ADD THIS LINE
  'trainer_profiles',
  'workout_sessions',
  // ... rest of tables
]
```

### 4. Add `getProfileChanges()` method in `src/lib/sync/service.ts`
This returns ONLY Profile model fields (no User fields):

```typescript
private async getProfileChanges(lastPulledAt: number, userId: string): Promise<SyncChanges> {
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
```

### 4b. Update `getTrainerProfileChanges()` to include User fields
This should return a combined object with both User and Profile fields:

```typescript
private async getTrainerProfileChanges(lastPulledAt: number, userId: string): Promise<SyncChanges> {
  // Get user data
  const user = await this.prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, username: true, updatedAt: true },
  });

  // Get profile data
  const profiles = await this.prisma.profile.findMany({
    where: {
      userId,
      createdAt: { gte: new Date(lastPulledAt) },
      deletedAt: { equals: null },
    },
  });

  const updatedProfiles = await this.prisma.profile.findMany({
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

  // Combine User + Profile data
  const combineUserProfile = (profile: any) => ({
    ...profile,
    name: user?.name,
    email: user?.email,
    username: user?.username,
  });

  return {
    created: profiles.map(p => objectKeysToSnake(convertDatesToTimestamps(combineUserProfile(p)))),
    updated: updatedProfiles.map(p => objectKeysToSnake(convertDatesToTimestamps(combineUserProfile(p)))),
    deleted: deleted.map(record => record.id),
  };
}
```

### 5. Update `getTableChanges()` method in `src/lib/sync/service.ts`
Add case for `profiles` in the switch statement:

```typescript
private async getTableChanges(
  tableName: SyncTableName,
  lastPulledAt: number,
  userId: string
): Promise<SyncChanges> {
  switch (tableName) {
    case 'clients':
      return this.getClientChanges(lastPulledAt, userId);
    case 'profiles':  // ADD THIS CASE
      return this.getProfileChanges(lastPulledAt, userId);
    case 'trainer_profiles':
      return this.getTrainerProfileChanges(lastPulledAt, userId);
    // ... rest of cases
  }
}
```

### 6. Update `applyCreation()` method in `src/lib/sync/service.ts`
Add special handling for `trainer_profiles` to split User and Profile fields:

```typescript
private async applyCreation(tx: any, tableName: SyncTableName, record: any, userId: string) {
  // Validate permissions before creation
  await this.validateCreationPermission(tx, tableName, record, userId);

  // Special handling for trainer_profiles - split into User + Profile
  if (tableName === 'trainer_profiles') {
    const data = objectKeysToCamel(record);
    
    // Extract User fields
    const { name, email, username, bio, experienceYears, website, avatarUrl, socialLinks, ...rest } = data;
    
    // Update User fields (name, email, username)
    if (name || email || username) {
      await tx.user.update({
        where: { id: userId },
        data: {
          ...(name && { name }),
          ...(email && { email }),
          ...(username && { username }),
          updatedAt: new Date(),
        },
      });
    }
    
    // Filter to only valid Profile fields
    const validProfileFields = {
      certifications: rest.certifications,
      phone: rest.phone || data.phone,
      aboutMe: bio, // Map bio to aboutMe
      philosophy: rest.philosophy,
      methodology: rest.methodology,
      branding: rest.branding,
      bannerImagePath: rest.bannerImagePath,
      profilePhotoPath: avatarUrl, // Map avatarUrl to profilePhotoPath
      specialties: rest.specialties,
      trainingTypes: rest.trainingTypes,
      averageRating: rest.averageRating,
      availability: rest.availability,
      minServicePrice: rest.minServicePrice,
    };
    
    // Remove undefined values
    Object.keys(validProfileFields).forEach(key => {
      if (validProfileFields[key] === undefined) {
        delete validProfileFields[key];
      }
    });
    
    // Upsert Profile (use upsert since there can only be one profile per user)
    await tx.profile.upsert({
      where: { userId },
      create: {
        ...validProfileFields,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      update: {
        ...validProfileFields,
        updatedAt: new Date(),
      },
    });
    return;
  }

  // Special handling for profiles - use upsert
  if (tableName === 'profiles') {
    const data = objectKeysToCamel(record);
    delete data.id;
    delete data.createdAt;
    delete data.updatedAt;
    delete data.deletedAt;
    
    await tx.profile.upsert({
      where: { userId },
      create: {
        ...data,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      update: {
        ...data,
        updatedAt: new Date(),
      },
    });
    return;
  }

  // Default handling for other tables
  const modelName = TABLE_MODEL_MAP[tableName];
  const model = (tx as any)[modelName.toLowerCase()];

  const data = objectKeysToCamel(record);
  delete data.createdAt;
  delete data.updatedAt;
  delete data.deletedAt;

  const creationData = this.addUserFields(tableName, data, userId);

  await model.create({
    data: {
      ...creationData,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
}

private addUserFields(tableName: SyncTableName, data: any, userId: string): any {
  switch (tableName) {
    case 'clients':
      return { ...data, trainerId: userId };
    case 'profiles':
      return { ...data, userId };
    case 'trainer_profiles':
      return { ...data, userId };
    // ... rest of cases
  }
}
```

### 7. Add helper function to parse JSON fields
Add this helper before the `applyCreation` method:

```typescript
private parseProfileData(data: any): any {
  const parsed = { ...data };
  
  // Parse JSON string fields to arrays/objects
  if (typeof parsed.certifications === 'string') {
    try {
      parsed.certifications = JSON.parse(parsed.certifications);
    } catch (e) {
      parsed.certifications = [];
    }
  }
  
  if (typeof parsed.specialties === 'string') {
    try {
      parsed.specialties = JSON.parse(parsed.specialties);
    } catch (e) {
      parsed.specialties = [];
    }
  }
  
  if (typeof parsed.trainingTypes === 'string') {
    try {
      parsed.trainingTypes = JSON.parse(parsed.trainingTypes);
    } catch (e) {
      parsed.trainingTypes = [];
    }
  }
  
  if (typeof parsed.availability === 'string') {
    try {
      parsed.availability = JSON.parse(parsed.availability);
    } catch (e) {
      parsed.availability = null;
    }
  }
  
  return parsed;
}
```

Then use it in `applyCreation`:
```typescript
// Before filtering fields
const parsedData = this.parseProfileData(data);
const { name, email, username, bio, experienceYears, website, avatarUrl, socialLinks, ...rest } = parsedData;
```

### 8. Update validation methods in `src/lib/sync/service.ts`
Add validation for `profiles` in permission methods:

```typescript
private async validateDeletionPermission(tx: any, tableName: SyncTableName, id: string, userId: string) {
  // ... existing code ...
  
  switch (tableName) {
    case 'clients':
      if (record.trainerId !== userId) {
        throw new Error(`Unauthorized: Cannot delete client ${id}`);
      }
      break;
    case 'profiles':  // ADD THIS CASE
      if (record.userId !== userId) {
        throw new Error(`Unauthorized: Cannot delete profile ${id}`);
      }
      break;
    case 'trainer_profiles':
      if (record.userId !== userId) {
        throw new Error(`Unauthorized: Cannot delete profile ${id}`);
      }
      break;
    // ... rest of cases
  }
}

private async validateCreationPermission(tx: any, tableName: SyncTableName, record: any, userId: string) {
  switch (tableName) {
    case 'clients':
      if (record.trainerId !== userId) {
        throw new Error(`Unauthorized: Cannot create client for another trainer`);
      }
      break;
    case 'profiles':  // ADD THIS CASE
      if (record.userId !== userId) {
        throw new Error(`Unauthorized: Cannot create profile for another user`);
      }
      break;
    case 'trainer_profiles':
      if (record.userId !== userId) {
        throw new Error(`Unauthorized: Cannot create profile for another user`);
      }
      break;
    // ... rest of cases
  }
}
```

## Notes
- `profiles` table maps to backend's `Profile` model only
- `trainer_profiles` table contains fields from BOTH `User` and `Profile` models
- The backend must split `trainer_profiles` data and update both User and Profile models
- Use `upsert` for Profile since there can only be one profile per user
- User fields (name, email, username) should be updated on the User model
- Profile fields (certifications, specialties, etc.) should be updated on the Profile model
- Some app fields don't exist in backend and should be ignored: `experienceYears`, `website`, `socialLinks`
- Some app fields need to be mapped: `bio` → `aboutMe`, `avatarUrl` → `profilePhotoPath`
- Parse JSON strings for array/object fields: `certifications`, `specialties`, `socialLinks`

## Testing
After implementing these changes, test with:
1. Create a new user profile from the mobile app
2. Trigger sync
3. Verify the profile is created in the backend database
4. Update the profile from the app
5. Trigger sync and verify updates are applied
6. Delete the profile and verify soft delete works

## Priority
**HIGH** - This is blocking all new user registrations from syncing their profile data to the backend.
