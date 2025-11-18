import { getMe } from '@/lib/api';
import { database } from '@/lib/db';
import { profileRepository } from '@/lib/repositories/profileRepository';
import { trainerProfileRepository } from '@/lib/repositories/trainerProfileRepository';

export interface ProfileSyncError {
  type: 'network' | 'validation' | 'database' | 'unknown';
  message: string;
  originalError?: Error;
}

export class ProfileSyncService {
  /**
   * Enhanced profile sync with comprehensive error handling
   */
  static async syncUserProfile(userId: string): Promise<{ success: boolean; error?: ProfileSyncError }> {
    try {
      if (!userId) {
        return {
          success: false,
          error: {
            type: 'validation',
            message: 'User ID is required for profile sync'
          }
        };
      }

      // Fetch profile data from API with retry logic
      let profileResponse;
      try {
        profileResponse = await this.fetchProfileWithRetry(userId, 3);
      } catch (error) {
        return {
          success: false,
          error: {
            type: 'network',
            message: 'Failed to fetch profile data from server',
            originalError: error as Error
          }
        };
      }

      if (!profileResponse) {
        return {
          success: false,
          error: {
            type: 'validation',
            message: 'No profile data received from server'
          }
        };
      }

      // Sync basic profile data to local DB
      try {
        await this.syncBasicProfile(profileResponse);
      } catch (error) {
        return {
          success: false,
          error: {
            type: 'database',
            message: 'Failed to sync basic profile data',
            originalError: error as Error
          }
        };
      }

      // If user is a trainer, sync trainer profile data
      if (profileResponse.role === 'trainer') {
        try {
          await this.syncTrainerProfile(profileResponse, userId);
        } catch (error) {
          return {
            success: false,
            error: {
              type: 'database',
              message: 'Failed to sync trainer profile data',
              originalError: error as Error
            }
          };
        }
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: {
          type: 'unknown',
          message: 'Unexpected error during profile sync',
          originalError: error as Error
        }
      };
    }
  }

  /**
   * Fetch profile with retry logic
   */
  private static async fetchProfileWithRetry(userId: string, maxRetries: number): Promise<any> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const profileResponse = await getMe();
        return profileResponse;
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxRetries) {
          throw lastError;
        }
        
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
    
    throw lastError!;
  }

  /**
   * Sync basic profile data
   */
  private static async syncBasicProfile(profileResponse: any): Promise<void> {
    if (!profileResponse.id) return;

    const existingProfile = await profileRepository.getCurrentUserProfile(profileResponse.id);
    if (!existingProfile) {
      await profileRepository.createProfile({
        userId: profileResponse.id,
        phone: profileResponse.phone,
        aboutMe: profileResponse.about_me,
        philosophy: profileResponse.philosophy,
        methodology: profileResponse.methodology,
        branding: profileResponse.branding,
        bannerImagePath: profileResponse.banner_image_path,
        profilePhotoPath: profileResponse.profile_photo_path,
        specialties: profileResponse.specialties ? JSON.stringify(profileResponse.specialties) : undefined,
        trainingTypes: profileResponse.training_types ? JSON.stringify(profileResponse.training_types) : undefined,
        averageRating: profileResponse.average_rating,
        availability: profileResponse.availability ? JSON.stringify(profileResponse.availability) : undefined,
        minServicePrice: profileResponse.min_service_price,
      });
    }
  }

  /**
   * Sync trainer profile data
   */
  private static async syncTrainerProfile(profileResponse: any, userId: string): Promise<void> {
    const existingTrainerProfile = await trainerProfileRepository.getTrainerProfileByUserId(userId);
    if (!existingTrainerProfile && profileResponse.id) {
      await trainerProfileRepository.createTrainerProfile({
        userId: userId,
        name: profileResponse.name || '',
        username: profileResponse.username || '',
        certifications: profileResponse.certifications ? JSON.stringify(profileResponse.certifications) : '[]',
        bio: profileResponse.bio,
        specialties: profileResponse.specialties ? JSON.stringify(profileResponse.specialties) : '[]',
        experienceYears: profileResponse.experience_years || 0,
        phone: profileResponse.phone,
        email: profileResponse.email,
        website: profileResponse.website,
        avatarUrl: profileResponse.avatar_url,
        socialLinks: profileResponse.social_links ? JSON.stringify(profileResponse.social_links) : '{}',
      });
    }
  }

  /**
   * Check if profile sync is needed
   */
  static async isProfileSyncNeeded(userId: string): Promise<boolean> {
    try {
      const existingProfile = await profileRepository.getCurrentUserProfile(userId);
      return !existingProfile;
    } catch (error) {
      console.error('Error checking if profile sync is needed:', error);
      return true; // Assume sync is needed if we can't check
    }
  }

  /**
   * Clear cached profile data (for logout or data reset)
   */
  static async clearProfileData(userId: string): Promise<void> {
    try {
      await database.write(async () => {
        // Soft delete profiles for this user
        const profiles = await profileRepository.getCurrentUserProfile(userId);
        if (profiles) {
          await profiles.update(record => {
            record.deletedAt = Date.now();
            ;(record as any).syncStatus = 'deleted';
          });
        }

        // Soft delete trainer profiles for this user
        const trainerProfiles = await trainerProfileRepository.getTrainerProfileByUserId(userId);
        if (trainerProfiles) {
          await trainerProfiles.update(record => {
            record.deletedAt = Date.now();
            ;(record as any).syncStatus = 'deleted';
          });
        }
      });
    } catch (error) {
      console.error('Error clearing profile data:', error);
      throw error;
    }
  }
}