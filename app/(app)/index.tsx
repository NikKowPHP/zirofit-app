import { View } from '@/components/Themed';
import { getMe } from '@/lib/api';
import { ProfileSyncService } from '@/lib/utils/profileSyncUtils';
import useAuthStore from '@/store/authStore';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';

export default function AppIndex() {
  const { user, authenticationState } = useAuthStore();
  const [profilesSynced, setProfilesSynced] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (authenticationState === 'authenticated' && user && !profilesSynced) {
      syncUserProfile();
    }
  }, [authenticationState, user, profilesSynced]);

  const syncUserProfile = async () => {
    try {
      if (!user) return;
      
      // Use the enhanced profile sync service with error handling
      const syncResult = await ProfileSyncService.syncUserProfile(user.id);
      
      if (syncResult.success) {
        // Try to get role from API as fallback if sync service doesn't provide it
        try {
          const profileResponse = await getMe();
          if (profileResponse?.role) {
            setUserRole(profileResponse.role);
          }
        } catch (error) {
          console.warn('Could not fetch role from API, using local data');
        }
      } else {
        console.error('Profile sync failed:', syncResult.error);
        
        // For critical errors, still try to determine role from any available data
        if (syncResult.error?.type === 'network') {
          console.log('Network error during sync, will retry on next app launch');
        }
      }
      
      setProfilesSynced(true);
    } catch (error) {
      console.error('Unexpected error during profile sync:', error);
      // Still mark as synced to prevent infinite loading
      setProfilesSynced(true);
    }
  };

  if (authenticationState === 'loading' || (authenticationState === 'authenticated' && !profilesSynced)) {
    return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}><ActivityIndicator /></View>;
  }

  // Once profile is loaded, redirect based on role.
  if (userRole === 'trainer') {
    return <Redirect href="/(app)/(trainer)" />;
  }
  
  return <Redirect href={"/(app)/(client)" as any} />;
}