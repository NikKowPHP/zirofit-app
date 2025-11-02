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

  useEffect(() => {
    // Push notifications are temporarily disabled
    console.log('Push notifications are temporarily disabled');
    
    // Set empty token to indicate push notifications are disabled
    setExpoPushToken('');
    
    // No notification listeners are set up when disabled
  }, []);

  return {
    expoPushToken: '',
    notification: false,
  };
}
      