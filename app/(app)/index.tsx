import { Redirect } from 'expo-router';
import useAuthStore from '@/store/authStore';
import { ActivityIndicator } from 'react-native';
import { View } from '@/components/Themed';
import { getMe } from '@/lib/api';
import { useEffect } from 'react';

export default function AppIndex() {
  const { profile, setProfile, authenticationState } = useAuthStore();

  useEffect(() => {
    if (authenticationState === 'authenticated' && !profile) {
      getMe()
        .then((profileResponse) => {
          if (profileResponse) {
            setProfile(profileResponse);
          }
        })
        .catch(console.error);
    }
  }, [authenticationState, profile]);


  if (authenticationState === 'loading' || (authenticationState === 'authenticated' && !profile)) {
    return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}><ActivityIndicator /></View>;
  }

  // Once profile is loaded, redirect based on role.
  if (profile?.role === 'trainer') {
    return <Redirect href="/(app)/(trainer)" />;
  }
  
  return <Redirect href={"/(app)/(client)" as any} />;
}
      