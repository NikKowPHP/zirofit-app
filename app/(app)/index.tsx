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
      
      // Always try to get role first from API, regardless of sync status
      let roleFetched = false;
      try {
        const profileResponse = await getMe();
        if (profileResponse?.role) {
          setUserRole(profileResponse.role);
          roleFetched = true;
          console.log('Successfully fetched role from API:', profileResponse.role);
        }
      } catch (error) {
        console.warn('Could not fetch role from API:', error);
      }
      
      // Use the enhanced profile sync service with error handling
      const syncResult = await ProfileSyncService.syncUserProfile(user.id);
      
      if (!syncResult.success) {
        console.error('Profile sync failed:', syncResult.error);
        
        // If we still don't have a role, try one more time as fallback
        if (!roleFetched) {
          try {
            const fallbackProfile = await getMe();
            if (fallbackProfile?.role) {
              setUserRole(fallbackProfile.role);
              console.log('Successfully fetched role from fallback API call:', fallbackProfile.role);
            }
          } catch (fallbackError) {
            console.error('Fallback role fetch also failed:', fallbackError);
          }
        }
      }
      
      setProfilesSynced(true);
    } catch (error) {
      console.error('Unexpected error during profile sync:', error);
      
      // As a last resort, try to get role directly
      try {
        const lastResortProfile = await getMe();
        if (lastResortProfile?.role) {
          setUserRole(lastResortProfile.role);
          console.log('Successfully fetched role from last resort API call:', lastResortProfile.role);
        }
      } catch (lastResortError) {
        console.error('Last resort role fetch failed:', lastResortError);
      }
      
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