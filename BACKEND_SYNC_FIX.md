# Backend Sync Fix Required for `client_measurements`

## Issue
The backend is throwing `TypeError: Cannot read properties of undefined (reading 'create')` when trying to sync `client_measurements` records.

## Root Cause
The `TABLE_MODEL_MAP` in the backend sync utils file is missing an entry for `client_measurements`.

## Required Backend Fixes

### 1. Add to `TABLE_MODEL_MAP`
In the backend file `src/lib/sync/utils.ts` (or wherever `TABLE_MODEL_MAP` is defined), add:

```typescript
export const TABLE_MODEL_MAP: Record<SyncTableName, string> = {
  // ... existing entries ...
  'client_measurements': 'ClientMeasurement',
  // ... other entries ...
};
```

### 2. Fix Model Access (Required)
The current code at line 1402 in `src/lib/sync/service.ts` uses:

```typescript
const model = (tx as any)[modelName.toLowerCase()];
```

This is incorrect because Prisma models are accessed in camelCase, not lowercase. For example:
- `ClientMeasurement` should be accessed as `tx.clientMeasurement`
- Not `tx.clientmeasurement`

**Recommended fix:**
```typescript
// Convert PascalCase to camelCase
const toCamelCase = (str: string) => str.charAt(0).toLowerCase() + str.slice(1);
const model = (tx as any)[toCamelCase(modelName)];
```

Or use a helper function:
```typescript
function getPrismaModel(tx: any, modelName: string) {
  // Prisma client uses camelCase for model names
  const camelCase = modelName.charAt(0).toLowerCase() + modelName.slice(1);
  return (tx as any)[camelCase];
}

const model = getPrismaModel(tx, modelName);
```

### 3. Add Validation for `client_measurements` (Required for Security)
In `validateCreationPermission` method (around line 1468), add validation to ensure the `clientId` belongs to a client owned by the authenticated trainer:

```typescript
case 'client_measurements':
  // Verify the client belongs to this trainer
  const client = await tx.client.findUnique({
    where: { id: record.clientId },
  });
  if (!client || client.trainerId !== userId) {
    throw new Error(`Unauthorized: Cannot create measurement for client ${record.clientId}`);
  }
  break;
```

**Note:** The `addUserFields` method (line 1486) does NOT need a case for `client_measurements` because measurements are linked to clients via `clientId`, not directly to the trainer's `userId`. The client relationship already provides the necessary authorization.

## Frontend Status
The frontend is correctly:
- ✅ Transforming `client_measurements` data to match backend schema
- ✅ Converting `measuredAt` timestamp to `measurementDate` ISO date string
- ✅ Mapping measurement types to `weightKg`, `bodyFatPercentage`, or `customMetrics`
- ✅ Sending data in the correct format

## Testing
After applying the backend fixes, test by:
1. Creating a new measurement in the app
2. Triggering a sync
3. Verifying the measurement is successfully created on the backend

