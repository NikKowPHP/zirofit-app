import { schemaMigrations } from '@nozbe/watermelondb/Schema/migrations'

export default schemaMigrations({
  migrations: [
    {
      toVersion: 5,
      steps: [
        // Remove columns from trainer_profiles that don't exist in backend
        // Note: WatermelonDB doesn't support dropping columns, so we just stop using them
        // The columns will remain in the database but won't be accessed
      ],
    },
  ],
})
