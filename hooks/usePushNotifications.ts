import { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { sendPushToken } from '@/lib/api';
import { router } from 'expo-router';
import type { Subscription, Notification } from 'expo-notifications';

export function usePushNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>('');
  const [notification, setNotification] = useState<Notification | false>(false);
  const notificationListener = useRef<Subscription | null>(null);
  const responseListener = useRef<Subscription | null>(null);

  useEffect(() => {
    // Prevent this hook from running on the server
    if (typeof window === 'undefined') {
      return;
    }

    let isMounted = true;

    const setupNotifications = async () => {
      const Notifications = await import('expo-notifications');

      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: false,
          shouldSetBadge: false,
        }),
      });

      async function registerForPushNotificationsAsync() {
        let token;
      
        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
          });
        }
      
        if (Device.isDevice || Platform.OS === 'web') {
          const { status: existingStatus } = await Notifications.getPermissionsAsync();
          let finalStatus = existingStatus;
          if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
          }
          if (finalStatus !== 'granted') {
            if(Device.isDevice) {
              alert('Failed to get push token for push notification!');
            }
            return;
          }
          
          try {
              const projectId = Constants.expoConfig?.extra?.eas?.projectId;
              if (!projectId) {
                  throw new Error('Could not find Expo Project ID in app config.');
              }
              token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
          } catch (e) {
              console.error("Error getting push token", e);
          }
          
        } else {
          // This case is mainly for development on a simulator
          console.log('Must use physical device or web for Push Notifications');
        }
      
        return token;
      }
      
      const token = await registerForPushNotificationsAsync();
      if (isMounted && token) {
        setExpoPushToken(token);
        // Send the token to your backend
        sendPushToken(token).catch(e => console.error("Failed to send push token", e));
      }

      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        if(isMounted) setNotification(notification);
      });

      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        console.log(response);
        const url = response.notification.request.content.data?.url;
        if (url) {
          router.push(url);
        }
      });
    };

    setupNotifications();

    return () => {
      isMounted = false;
      const cleanup = async () => {
        // We only need to import the module for cleanup if listeners were attached
        if(notificationListener.current || responseListener.current) {
            const Notifications = await import('expo-notifications');
            if(notificationListener.current) {
              Notifications.removeNotificationSubscription(notificationListener.current);
            }
            if(responseListener.current) {
              Notifications.removeNotificationSubscription(responseListener.current);
            }
        }
      }
      cleanup();
    };
  }, []);

  return {
    expoPushToken,
    notification,
  };
}
      