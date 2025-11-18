import { database } from '@/lib/db'
import TrainerProfile from '@/lib/db/models/TrainerProfile'
import { Q } from '@nozbe/watermelondb'

const trainerProfilesCollection = database.collections.get<TrainerProfile>('trainer_profiles')

export const trainerProfileRepository = {
  observeTrainerProfiles: () => trainerProfilesCollection.query(Q.where('deleted_at', Q.eq(null))).observe(),

  observeTrainerProfile: (id: string) => trainerProfilesCollection.findAndObserve(id),

  observeTrainerProfileByUserId: (userId: string) =>
    trainerProfilesCollection.query(
      Q.where('user_id', userId),
      Q.where('deleted_at', Q.eq(null))
    ).observe(),

  createTrainerProfile: async (data: {
    userId: string
    name: string
    username: string
    certifications: string
    bio?: string
    specialties: string
    experienceYears: number
    phone?: string
    email?: string
    website?: string
    avatarUrl?: string
    socialLinks?: string
  }) => {
    await database.write(async () => {
      await trainerProfilesCollection.create(profile => {
        profile.userId = data.userId
        profile.name = data.name
        profile.username = data.username
        profile.certifications = data.certifications
        profile.bio = data.bio
        profile.specialties = data.specialties
        profile.experienceYears = data.experienceYears
        profile.phone = data.phone
        profile.email = data.email
        profile.website = data.website
        profile.avatarUrl = data.avatarUrl
        profile.socialLinks = data.socialLinks
        ;(profile as any).syncStatus = 'created'
      })
    })
  },

  updateTrainerProfile: async (id: string, updates: Partial<{
    name: string
    username: string
    certifications: string
    bio: string
    specialties: string
    experienceYears: number
    phone: string
    email: string
    website: string
    avatarUrl: string
    socialLinks: string
  }>) => {
    await database.write(async () => {
      const profile = await trainerProfilesCollection.find(id)
      await profile.update(record => {
        Object.assign(record, updates)
        // Mark as needing sync to server if not already synced
        if ((record as any).syncStatus === 'synced') {
          ;(record as any).syncStatus = 'updated'
        }
      })
    })
  },

  deleteTrainerProfile: async (id: string) => {
    await database.write(async () => {
      const profile = await trainerProfilesCollection.find(id)
      await profile.update(record => {
        record.deletedAt = Date.now()
        // Mark as needing sync to server
        ;(record as any).syncStatus = 'deleted'
      })
    })
  },

  // Utility function to get the current user's trainer profile
  getTrainerProfileByUserId: async (userId: string) => {
    try {
      const profiles = await trainerProfilesCollection.query(
        Q.where('user_id', userId),
        Q.where('deleted_at', Q.eq(null))
      ).fetch()
      return profiles.length > 0 ? profiles[0] : null
    } catch (error) {
      console.error('Error fetching current user trainer profile:', error)
      return null
    }
  }
}
