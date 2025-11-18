import { database } from '@/lib/db'
import Profile from '@/lib/db/models/Profile'
import { Q } from '@nozbe/watermelondb'

const profilesCollection = database.collections.get<Profile>('profiles')

export const profileRepository = {
  observeProfiles: () => profilesCollection.query(Q.where('deleted_at', Q.eq(null))).observe(),

  observeProfile: (id: string) => profilesCollection.findAndObserve(id),

  observeProfileByUserId: (userId: string) =>
    profilesCollection.query(
      Q.where('user_id', userId),
      Q.where('deleted_at', Q.eq(null))
    ).observe(),

  createProfile: async (data: {
    userId: string
    certifications?: string
    phone?: string
    aboutMe?: string
    philosophy?: string
    methodology?: string
    branding?: string
    bannerImagePath?: string
    profilePhotoPath?: string
    specialties?: string // JSON array
    trainingTypes?: string // JSON array
    averageRating?: number
    availability?: string // JSON
    minServicePrice?: number
  }) => {
    await database.write(async () => {
      await profilesCollection.create(profile => {
        profile.userId = data.userId
        profile.certifications = data.certifications
        profile.phone = data.phone
        profile.aboutMe = data.aboutMe
        profile.philosophy = data.philosophy
        profile.methodology = data.methodology
        profile.branding = data.branding
        profile.bannerImagePath = data.bannerImagePath
        profile.profilePhotoPath = data.profilePhotoPath
        profile.specialties = data.specialties
        profile.trainingTypes = data.trainingTypes
        profile.averageRating = data.averageRating
        profile.availability = data.availability
        profile.minServicePrice = data.minServicePrice
      })
    })
  },

  updateProfile: async (id: string, updates: Partial<{
    certifications?: string
    phone?: string
    aboutMe?: string
    philosophy?: string
    methodology?: string
    branding?: string
    bannerImagePath?: string
    profilePhotoPath?: string
    specialties?: string // JSON array
    trainingTypes?: string // JSON array
    averageRating?: number
    availability?: string // JSON
    minServicePrice?: number
  }>) => {
    await database.write(async () => {
      const profile = await profilesCollection.find(id)
      await profile.update(record => {
        Object.assign(record, updates)
        // Note: sync status is handled automatically by WatermelonDB
      })
    })
  },

  deleteProfile: async (id: string) => {
    await database.write(async () => {
      const profile = await profilesCollection.find(id)
      await profile.update(record => {
        record.deletedAt = Date.now()
        // Note: sync status is handled automatically by WatermelonDB
      })
    })
  },

  // Utility function to get the current user's profile
  getCurrentUserProfile: async (userId: string) => {
    try {
      const profiles = await profilesCollection.query(
        Q.where('user_id', userId),
        Q.where('deleted_at', Q.eq(null))
      ).fetch()
      return profiles.length > 0 ? profiles[0] : null
    } catch (error) {
      console.error('Error fetching current user profile:', error)
      return null
    }
  }
}