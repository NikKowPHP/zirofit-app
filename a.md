<response>
  <reasoning>
    My plan is to implement logout functionality for both client and trainer users.

    1.  **Update `store/authStore.ts`:** I will modify the `setSession` function. When a session is cleared (set to `null`), I'll ensure the user's `profile` data is also cleared from the store. This guarantees a clean state upon logout and prevents data from a previous session from persisting.

    2.  **Add Logout to Trainer Profile:** I will add a "Logout" button to the trainer's profile screen at `app/(app)/(trainer)/(tabs)/profile/index.tsx`. The button's `onPress` handler will call `supabase.auth.signOut()`. The existing authentication guard (`useAuthGuard`) will automatically handle redirecting the user to the login screen.

    3.  **Add Logout to Client View:** The client app doesn't have a dedicated profile screen. The most suitable place for a logout button is the "My Trainer" tab. I will add a "Logout" button at the bottom of the screen in `app/(app)/(client)/(tabs)/my-trainer.tsx` and implement the same `supabase.auth.signOut()` logic.

    4.  **Update `TASKS.md`:** Finally, I will add a new entry for this feature and mark it as complete.
  </reasoning>
  <modifications>
    <file path="app/(app)/(client)/(tabs)/my-trainer.tsx">
      <![CDATA[
import { View, Text } from '@/components/Themed';
import { StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { H3, YStack, Avatar, H4, Paragraph } from 'tamagui';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import * as WebBrowser from 'expo-web-browser';
import { createCheckoutSession, getMyTrainer, getTrainerPackages } from '@/lib/api';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import FindTrainerPrompt from '@/components/dashboard/FindTrainerPrompt';
import { supabase } from '@/lib/supabase';

export default function MyTrainerScreen() {
    const [loadingPackageId, setLoadingPackageId] = useState<string | null>(null);
    
    const { data: trainer, isLoading: isTrainerLoading } = useQuery({ 
        queryKey: ['myTrainer'], 
        queryFn: getMyTrainer 
    });

    const trainerId = trainer?.id;
    
    const { data: packages, isLoading: arePackagesLoading } = useQuery({
        queryKey: ['trainerPackages', trainerId],
        queryFn: () => getTrainerPackages(trainerId as string),
        enabled: !!trainerId,
    });

    const handleBuyPackage = async (packageId: string) => {
        setLoadingPackageId(packageId);
        try {
            const { url } = await createCheckoutSession(packageId);
            if (url) {
                await WebBrowser.openBrowserAsync(url);
            } else {
                Alert.alert('Error', 'Could not initiate checkout session.');
            }
        } catch (error: any) {
            console.error(error);
            Alert.alert('Error', error.message || 'An unexpected error occurred.');
        } finally {
            setLoadingPackageId(null);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    if (isTrainerLoading) {
        return <SafeAreaView style={styles.center}><ActivityIndicator /></SafeAreaView>
    }

    return (
        <SafeAreaView style={styles.container}>
            <YStack space="$4" padding="$4" alignItems='center'>
                <H3>My Trainer</H3>
                
                {trainer ? (
                    <>
                        <Card padding="$4" alignItems='center' width="100%">
                            <Avatar circular size="$10">
                                <Avatar.Image src={trainer.avatar_url} />
                                <Avatar.Fallback bc="blue" />
                            </Avatar>
                            <H3 mt="$2">{trainer.name}</H3>
                            <Text>Certified Personal Trainer</Text>
                            <Button mt="$4">Send Message</Button>
                        </Card>

                        <Card padding="$4" width="100%">
                            <H3 textAlign='center'>Training Packages</H3>
                            {arePackagesLoading ? <ActivityIndicator style={{marginTop: 20}} /> : (
                                <YStack space="$3" mt="$3">
                                    {packages && packages.length > 0 ? packages.map((pkg: any) => (
                                        <Card key={pkg.id} padding="$3" backgroundColor="$backgroundHover">
                                            <H4>{pkg.name}</H4>
                                            <Paragraph>{pkg.description}</Paragraph>
                                            <Text style={styles.price}>${(pkg.price / 100).toFixed(2)}</Text>
                                            <Button 
                                                mt="$3"
                                                theme="green" 
                                                onPress={() => handleBuyPackage(pkg.id)} 
                                                disabled={!!loadingPackageId}
                                            >
                                                {loadingPackageId === pkg.id ? 'Processing...' : 'Buy Package'}
                                            </Button>
                                        </Card>
                                    )) : (
                                        <Text style={styles.noPackagesText}>This trainer has not set up any packages yet.</Text>
                                    )}
                                </YStack>
                            )}
                        </Card>
                    </>
                ) : (
                    <FindTrainerPrompt />
                )}

                <Button theme="red" onPress={handleLogout} width="100%" marginTop="$4">
                    Logout
                </Button>
            </YStack>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 8,
    },
    noPackagesText: {
        textAlign: 'center',
        marginTop: 10,
        color: 'gray',
    }
});
      ]]>
    </file>
    <file path="app/(app)/(trainer)/(tabs)/profile/index.tsx">
      <![CDATA[
import { View, Text } from '@/components/Themed';
import { StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { getTrainerProfile } from '@/lib/api';
import { YStack, H3, Avatar } from 'tamagui';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function ProfileScreen() {
    const { data: profile, isLoading } = useQuery({ queryKey: ['trainerProfile'], queryFn: getTrainerProfile });
    const router = useRouter();
    
    if (isLoading) {
        return <SafeAreaView style={styles.center}><ActivityIndicator /></SafeAreaView>
    }

    const handleLogout = async () => {
        await supabase.auth.signOut();
        // Auth guard will redirect
    };

    return (
        <SafeAreaView style={styles.container}>
            <YStack space="$4" padding="$4" alignItems='center'>
                <H3>My Profile</H3>
                <Card padding="$4" alignItems='center' width="100%">
                    <Avatar circular size="$10">
                        <Avatar.Image src={profile.avatar_url} />
                        <Avatar.Fallback bc="blue" />
                    </Avatar>
                    <H3 mt="$2">{profile.name}</H3>
                    <Text>{profile.email}</Text>

                    <Button mt="$4" onPress={() => router.push('/(trainer)/(tabs)/profile/edit')}>
                        Edit Profile
                    </Button>
                    <Button mt="$2" theme="red" onPress={handleLogout}>
                        Logout
                    </Button>
                </Card>
            </YStack>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});
      ]]>
    </file>
    <file path="store/authStore.ts">
      <![CDATA[
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session, User } from '@supabase/supabase-js';

export type UserProfile = {
  // This should match your backend's profile structure
  id: string;
  role: 'client' | 'trainer';
  [key: string]: any; // Allow other properties
};

type AuthState = {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  authenticationState: 'loading' | 'authenticated' | 'unauthenticated';
  setSession: (session: Session | null) => void;
  setProfile: (profile: UserProfile | null) => void;
};

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      user: null,
      profile: null,
      authenticationState: 'loading',
      setSession: (session) => {
        set(state => ({
          session,
          user: session?.user ?? null,
          profile: session ? state.profile : null, // Clear profile on logout
          authenticationState: session ? 'authenticated' : 'unauthenticated',
        }));
      },
      setProfile: (profile) => set({ profile }),
    }),
    {
      name: 'auth-storage', // unique name
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        session: state.session,
        user: state.user,
        profile: state.profile
       }), // Only persist these fields
       onRehydrateStorage: () => (state) => {
        if (state) {
            state.authenticationState = state.session ? 'authenticated' : 'unauthenticated';
        }
       }
    }
  )
);

export default useAuthStore;
      ]]>
    </file>
    <file path="TASKS.md">
      <![CDATA[
- [x] Fix `localStorage` error on web build by dynamically importing `expo-notifications` on the client.
- [x] Fix syntax error in `usePushNotifications.ts` causing Tamagui parse error.
- [x] Fix Expo Router layout structure for client tabs to remove warnings.
- [x] Fix TypeScript error in `BlurView` by providing a default for `colorScheme`.
- [x] Resolve dependency conflicts and standardize on `victory-native` for charting.
- [x] Fix `import.meta` syntax error on web by expanding the babel include list in `app.json` for web builds.
- [x] Add logout functionality.
      ]]>
    </file>
  </modifications>
</response>